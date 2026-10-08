import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory audio cache to avoid repeated TTS calls
const audioCache = new Map<string, { buffer: Buffer; base64: string }>();

// Initialize Gemini client server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function generateTTSAudio(
  text: string,
  voiceName: string = 'Leda',
  lang: string = 'vi'
): Promise<{ buffer: Buffer; base64: string }> {
  // Normalize Gemini prebuilt voice name
  let geminiVoice = voiceName;
  let isEnglish = lang === 'en';

  if (voiceName.endsWith('_EN') || ['Puck', 'Charon', 'Fenrir', 'Kore'].includes(voiceName)) {
    isEnglish = true;
    geminiVoice = voiceName.replace('_EN', '');
  } else if (voiceName.endsWith('_VI')) {
    isEnglish = false;
    geminiVoice = voiceName.replace('_VI', '');
  }

  const cacheKey = `${geminiVoice}:${isEnglish ? 'en' : 'vi'}:${text.trim()}`;
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey)!;
  }

  // Choose prompt instruction based on language and accent
  const promptText = isEnglish
    ? `Read with a native American English (US) accent, clear, articulate, natural, expressive, and friendly tone:\n${text.trim()}`
    : `Nói bằng tiếng Việt giọng chuẩn miền Bắc Việt Nam (Hà Nội), phát âm chuẩn, nhẹ nhàng, ấm áp, truyền cảm, tự nhiên như cô giáo:\n${text.trim()}`;

  const speechStyle = isEnglish
    ? 'Native American English (US) accent, articulate, clear, warm, engaging voice'
    : 'Vietnamese Northern accent, clear, gentle, expressive female voice, natural and friendly';

  let response;
  try {
    response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: promptText,
              speechMetadata: {
                style: speechStyle,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: geminiVoice || 'Leda' },
          },
        },
      },
    });
  } catch (err: any) {
    if (err?.message?.includes('429') || err?.status === 'RESOURCE_EXHAUSTED' || err?.message?.includes('quota')) {
      console.warn('Lite TTS quota exceeded, falling back to gemini-3.8-flash-tts...');
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: promptText,
                speechMetadata: {
                  style: speechStyle,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: geminiVoice || 'Leda' },
            },
          },
        },
      });
    } else {
      throw err;
    }
  }

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error('Gemini TTS did not return audio data');
  }

  const buffer = Buffer.from(base64Audio, 'base64');
  const result = { buffer, base64: base64Audio };

  // Keep cache bounded
  if (audioCache.size > 200) {
    const firstKey = audioCache.keys().next().value;
    if (firstKey) audioCache.delete(firstKey);
  }
  audioCache.set(cacheKey, result);

  return result;
}

// POST endpoint returning base64 audio data
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voiceName = 'Leda', lang = 'vi' } = req.body;
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Nội dung text không hợp lệ' });
      return;
    }

    const { base64 } = await generateTTSAudio(text, voiceName, lang);
    res.json({
      audio: base64,
      mimeType: 'audio/wav',
      voice: voiceName,
      lang: lang,
    });
  } catch (error: any) {
    console.error('Error in /api/tts:', error?.message || error);
    res.status(500).json({
      error: 'Không thể tạo âm thanh từ Gemini TTS',
      details: error?.message || String(error),
    });
  }
});

// GET endpoint returning raw audio/wav stream directly
app.get('/api/tts/stream', async (req, res) => {
  try {
    const text = req.query.text as string;
    const voiceName = (req.query.voice as string) || 'Leda';
    const lang = (req.query.lang as string) || 'vi';
    if (!text) {
      res.status(400).send('Missing text parameter');
      return;
    }

    const { buffer } = await generateTTSAudio(text, voiceName, lang);
    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(buffer);
  } catch (error: any) {
    console.error('Error in /api/tts/stream:', error?.message || error);
    res.status(500).send('TTS Generation Error');
  }
});

const DEFAULT_GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxiRmI-Y5RbWC_Bu-zUvoiIwIU7BqpSFbK01nbUpNrFh7DaOmDYZRtrKW0VLRMbOnhmpQ/exec';

// Endpoint proxy gửi kết quả đến Google Apps Script Web App (tránh lỗi CORS)
app.post('/api/submit-sheet', async (req, res) => {
  try {
    const { scriptUrl, hoVaTen, to, lop, thoiGian, diem } = req.body;
    const targetUrl = (scriptUrl || DEFAULT_GOOGLE_SCRIPT_URL).trim();

    if (!targetUrl) {
      res.status(400).json({
        error: 'Chưa cấu hình URL Google Apps Script Web App. Vui lòng triển khai script và dán URL vào hệ thống.',
      });
      return;
    }

    const payload = {
      hoVaTen: hoVaTen || 'Học sinh',
      to: to || 'Tổ 1',
      lop: lop || 'Lớp 6A1',
      thoiGian: thoiGian || new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
      diem: diem !== undefined ? diem : 100,
    };

    // Chuẩn bị URL kèm query parameters dự phòng (để nếu Google 302 chuyển thành GET thì vẫn nhận đủ tham số)
    let fetchUrl = targetUrl;
    try {
      const urlObj = new URL(targetUrl);
      urlObj.searchParams.set('hoVaTen', payload.hoVaTen);
      urlObj.searchParams.set('to', payload.to);
      urlObj.searchParams.set('lop', payload.lop);
      urlObj.searchParams.set('thoiGian', payload.thoiGian);
      urlObj.searchParams.set('diem', String(payload.diem));
      fetchUrl = urlObj.toString();
    } catch {
      fetchUrl = targetUrl;
    }

    let scriptResponse = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      redirect: 'manual',
      signal: AbortSignal.timeout(60000),
    });

    if (scriptResponse.status === 302 || scriptResponse.status === 301) {
      const redirectLocation = scriptResponse.headers.get('location');
      if (redirectLocation) {
        scriptResponse = await fetch(redirectLocation, {
          method: 'GET',
          signal: AbortSignal.timeout(60000),
        });
      }
    }

    const status = scriptResponse.status;
    const text = await scriptResponse.text();

    // Kiểm tra trường hợp Google trả về trang đăng nhập hoặc lỗi quyền truy cập 403
    if (
      status === 401 ||
      status === 403 ||
      text.includes('accounts.google.com') ||
      text.includes('unable to open the file') ||
      text.includes('Page not found')
    ) {
      res.status(403).json({
        status: 'error',
        isPermissionError: true,
        error: 'Chưa cấp quyền "Bất kỳ ai" (Anyone) cho Google Apps Script Web App',
        message: 'Google Apps Script trả về lỗi 403 (yêu cầu đăng nhập tài khoản tác giả). Vui lòng vào Apps Script: Triển khai (Deploy) ➔ Quản lý bản triển khai (Manage deployments) ➔ Chỉnh sửa ➔ mục "Ai có quyền truy cập" (Who has access) chọn "Bất kỳ ai" (Anyone) rồi Triển khai lại.',
      });
      return;
    }

    let jsonResult;
    try {
      jsonResult = JSON.parse(text);
    } catch {
      jsonResult = { status: 'success', message: 'Đã lưu kết quả thành công!', raw: text };
    }

    res.json(jsonResult);
  } catch (error: any) {
    console.error('Error submitting to Google Sheets:', error);
    res.status(500).json({
      error: 'Không thể kết nối đến Google Sheets Web App',
      details: error?.message || String(error),
    });
  }
});

// Endpoint kiểm tra kết nối Web App
app.get('/api/test-sheet', async (req, res) => {
  try {
    const scriptUrl = (req.query.url as string) || DEFAULT_GOOGLE_SCRIPT_URL;
    const urlObj = new URL(scriptUrl);
    urlObj.searchParams.set('test', '1');

    let response = await fetch(urlObj.toString(), {
      method: 'GET',
      redirect: 'manual',
      signal: AbortSignal.timeout(30000),
    });

    if (response.status === 302 || response.status === 301) {
      const redirectLocation = response.headers.get('location');
      if (redirectLocation) {
        response = await fetch(redirectLocation, {
          method: 'GET',
          signal: AbortSignal.timeout(30000),
        });
      }
    }

    const text = await response.text();
    if (response.status === 403 || text.includes('unable to open the file') || text.includes('accounts.google.com')) {
      res.json({
        connected: false,
        isPermissionError: true,
        message: 'Lỗi 403: Cần chuyển "Ai có quyền truy cập" sang "Bất kỳ ai" (Anyone) trong Apps Script.',
      });
      return;
    }

    res.json({
      connected: true,
      status: response.status,
      message: 'Kết nối đến Web App thành công! Trang tính "Mật mã" đã sẵn sàng nhận bài.',
    });
  } catch (error: any) {
    res.json({
      connected: false,
      message: error?.message || 'Không thể kết nối',
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    defaultVoice: 'Leda (Tiếng Việt miền Bắc)',
    sheetId: '12mRK7ZmxScrJwnBmFa-9gdmKSKtZtSfiIvNug9g3llM',
    sheetName: 'Mật mã',
  });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
    console.log(`Default voice: Leda (Tiếng Việt miền Bắc Việt Nam)`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
