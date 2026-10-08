/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Award,
  Clock,
  Heart,
  BookOpen,
  Lightbulb,
  Maximize2,
  Minimize2,
  Download,
  Settings,
  ChevronRight,
  Send,
  CheckCircle,
  HelpCircle,
  Flame,
  ArrowRight,
  Smile,
  ShieldAlert,
  Play,
  Pause,
  Square,
  FileText,
  Users,
  GraduationCap,
  Printer,
  Copy,
  Check,
  FileSpreadsheet,
  Database,
  ExternalLink
} from 'lucide-react';

interface Team {
  groupName: string;
  name: string;
  leader: string;
  score: number;
  icon: string;
  color: string;
  taskNote?: string;
}

interface QuestionOption {
  text: string;
  correct: boolean;
  explain?: string;
  feedback?: string;
}

interface R1Task {
  id: string;
  teamId: number;
  title: string;
  context: string;
  quote?: string;
  question?: string;
  options?: QuestionOption[];
  tasksOrder?: { id: number; text: string }[];
}

interface R2Task {
  id: string;
  team: number;
  title: string;
  prompt: string;
  options: { text: string; correct: boolean }[];
  note: string;
}

interface R3Choice {
  btn: string;
  impact: string;
  score: number;
  sharing: number;
  feedback: string;
}

interface R3Scenario {
  id: string;
  teamId: number;
  situationTitle: string;
  desc: string;
  choices: R3Choice[];
}

interface ChoreItem {
  id: string;
  name: string;
  category: 'Bep' | 'Nha' | 'Hoc';
  team: number;
  tip: string;
}

const LESSON_BANK: {
  round1: R1Task[];
  round2: R2Task[];
  round3_scenarios: R3Scenario[];
  round4_chores: ChoreItem[];
} = {
  round1: [
    {
      id: 'r1_q1',
      teamId: 0,
      title: 'Nhiệm vụ 1: Giải mã hình ảnh ẩn dụ đầu ngày',
      context: 'Khi chuẩn bị bữa sáng và đánh thức con, mẹ ngắm nhìn con ngủ say và nhớ tới hai câu thơ của nhà thơ Nguyễn Khoa Điềm:',
      quote: '"Mặt trời của bắp thì nằm trên đồi\nMặt trời của mẹ, em nằm trên lưng."',
      question: 'Từ "mặt trời" thứ hai trong câu thơ trên được dùng theo biện pháp tu từ nào và mang ý nghĩa gì?',
      options: [
        { text: 'A. So sánh - Ví đứa con to lớn như mặt trời tự nhiên.', correct: false, explain: 'Ở đây không có từ so sánh trực tiếp "như, là", mà là gọi tên sự vật này bằng tên sự vật khác.' },
        { text: 'B. Ẩn dụ - Đứa con là nguồn sống, niềm vui và tình yêu thương tha thiết vô bờ của mẹ.', correct: true, explain: 'Chính xác! Mặt trời của bắp đem lại ánh sáng cho vạn vật, còn "em bé" là mặt trời sưởi ấm tâm hồn và hy vọng của mẹ.' },
        { text: 'C. Hoán dụ - Chỉ chiếc lưng mẹ vất vả khi địu con lên rẫy.', correct: false, explain: 'Chưa chính xác. Đứa con được coi là mặt trời của mẹ dựa trên nét tương đồng về tình cảm thiêng liêng.' },
        { text: 'D. Điệp từ - Lặp lại từ mặt trời để nhấn mạnh thời gian ban mai.', correct: false, explain: 'Từ "mặt trời" được dùng với hai nghĩa khác nhau, trong đó nghĩa thứ hai là biện pháp ẩn dụ sâu sắc.' }
      ]
    },
    {
      id: 'r1_q2',
      teamId: 1,
      title: 'Nhiệm vụ 2: Cảm nhận vẻ đẹp ban mai rực rỡ',
      context: 'Khi mở cửa sổ đón ánh nắng sáng rọi vào góc bếp, An chợt nhớ câu thơ của Hoàng Trung Thông trong SGK:',
      quote: '"Cha lại dắt con đi trên cát mịn\nÁnh nắng chảy đầy vai."',
      question: 'Từ "chảy" trong câu thơ "Ánh nắng chảy đầy vai" là nét độc đáo của biện pháp tu từ nào?',
      options: [
        { text: 'A. Nhân hóa ánh nắng biết cử động như con người.', correct: false, explain: 'Từ "chảy" không phải là hành động riêng của con người mà vốn là trạng thái vận động của chất lỏng.' },
        { text: 'B. Ẩn dụ chuyển đổi cảm giác - Cảm nhận ánh nắng thị giác như dòng chất lỏng vàng ấm tràn trề.', correct: true, explain: 'Rất xuất sắc! Vốn dĩ mắt thấy ánh nắng, nhưng tác giả dùng từ "chảy" khiến người đọc như cảm nhận được ánh nắng hữu hình, ấm áp đọng trên vai.' },
        { text: 'C. So sánh ngầm giữa bờ cát mịn và ánh nắng.', correct: false, explain: 'Không có mối liên hệ so sánh giữa cát mịn và ánh nắng ở từ "chảy".' },
        { text: 'D. Nói quá để phóng đại sự gay gắt của ánh nắng mặt trời.', correct: false, explain: 'Từ "chảy" đem lại cảm giác êm đềm, thi vị, không phải nói quá phóng đại.' }
      ]
    },
    {
      id: 'r1_q3',
      teamId: 2,
      title: 'Nhiệm vụ 3: Sắp xếp thứ tự ưu tiên buổi sáng của mẹ',
      context: 'Đồng hồ điểm 6:30. Mẹ phải làm rất nhiều việc trong vòng 45 phút. Nếu là mẹ, con sẽ lựa chọn thứ tự xử lý nào thông minh và an toàn nhất?',
      tasksOrder: [
        { id: 1, text: 'Chuẩn bị bữa sáng dinh dưỡng & kiểm tra bình nước ấm' },
        { id: 2, text: 'Đánh thức con dậy nhẹ nhàng, nhắc con vệ sinh cá nhân' },
        { id: 3, text: 'Kiểm tra túi thuốc nhỏ, đồ dùng học tập trước khi đưa con đến trường' },
        { id: 4, text: 'Tắt các thiết bị điện không dùng trong nhà để đảm bảo an toàn' }
      ]
    },
    {
      id: 'r1_q4',
      teamId: 3,
      title: 'Nhiệm vụ 4: Xử lý tình huống bé biếng ăn sáng',
      context: 'Bé út sáng nay phụng phịu không chịu ăn bánh bao mẹ vừa hấp nóng, bảo rằng muốn ăn kẹo ngọt.',
      question: 'Nếu là một người mẹ thấu hiểu và khéo léo, con sẽ nói gì với bé?',
      options: [
        { text: 'A. Mắng bé ngay để kịp giờ đi làm, bắt ép bé ăn thật nhanh.', correct: false, feedback: 'Mắng mỏ khiến bé buồn và không khí buổi sáng căng thẳng.' },
        { text: 'B. Chiều ý cho bé ăn kẹo thay bữa sáng để đi học cho đúng giờ.', correct: false, feedback: 'Ăn kẹo sáng sớm có hại cho dạ dày và sức khỏe của bé.' },
        { text: 'C. Ôm bé nhẹ nhàng: "Bánh bao nóng giúp bụng ấm và nhiều năng lượng để con vui chơi ở lớp. Chiều về mẹ con mình cùng thưởng thức hoa quả ngon nhé!"', correct: true, feedback: 'Lời nói dịu dàng, kiên định và thấu hiểu giúp bé vui vẻ hợp tác!' },
        { text: 'D. Mặc kệ bé nhịn đói đến trường.', correct: false, feedback: 'Bé đói sẽ không đủ năng lượng học tập và mệt mỏi.' }
      ]
    }
  ],

  round2: [
    {
      id: 'r2_q1',
      team: 0,
      title: 'Ghi chú 1: Nhận diện hình ảnh trong "Mây và sóng"',
      prompt: 'Trong bài thơ "Mây và sóng" của R. Ta-go, hai hình ảnh "mây" và "sóng" là những ẩn dụ tượng trưng cho điều gì?',
      options: [
        { text: 'A. Những hiện tượng thời tiết bão giông nguy hiểm cần tránh xa.', correct: false },
        { text: 'B. Thế giới bên ngoài với những thú vui hấp dẫn, cám dỗ rực rỡ nhưng con đã từ chối để ở bên mẹ.', correct: true },
        { text: 'C. Đồ chơi đắt tiền trong các cửa hàng bách hóa.', correct: false },
        { text: 'D. Ước mơ trở thành nhà khoa học khám phá bầu trời và đại dương.', correct: false }
      ],
      note: 'Mây và sóng mời gọi em bé đến chốn xa xôi rực rỡ, nhưng tình yêu mẹ đã giúp em tìm thấy trò chơi tuyệt vời hơn ngay bên mẹ.'
    },
    {
      id: 'r2_q2',
      team: 1,
      title: 'Ghi chú 2: Biện pháp tu từ "Bình minh vàng" & "Vầng trăng bạc"',
      prompt: 'Trong câu thơ: "Con hỏi: Nhưng làm thế nào mình lên đó được? / Họ đáp: Hãy đến nơi tận cùng trái đất... / Con sẽ được nhấc bổng lên tận tầng mây. / Nhưng con nhớ đến mẹ đang đợi ở nhà...". Hình ảnh "bình minh vàng" và "vầng trăng bạc" thể hiện nét đẹp gì?',
      options: [
        { text: 'A. Sự giàu có về tiền bạc, châu báu vật chất.', correct: false },
        { text: 'B. Vẻ đẹp lộng lẫy, kỳ ảo, quyến rũ của vũ trụ bao la và thời gian tuần hoàn.', correct: true },
        { text: 'C. Màu sắc của các loài hoa quả trong vườn nhà mẹ.', correct: false }
      ],
      note: 'Hai hình ảnh ẩn dụ/ước lệ vẽ nên thế giới lung linh tuyệt mỹ mà tuổi thơ luôn khao khát phiêu lưu.'
    },
    {
      id: 'r2_q3',
      team: 2,
      title: 'Ghi chú 3: Dấu câu đánh dấu lời thoại trực tiếp',
      prompt: 'Trong văn bản "Mây và sóng", dấu câu nào được tác giả/dịch giả sử dụng để đánh dấu những lời nói trực tiếp của các nhân vật (em bé, người trên mây, người trong sóng)?',
      options: [
        { text: 'A. Dấu ngoặc đơn ( )', correct: false },
        { text: 'B. Dấu chấm lửng (...)', correct: false },
        { text: 'C. Dấu hai chấm kết hợp dấu ngoặc kép (" ")', correct: true },
        { text: 'D. Dấu chấm hỏi (?)', correct: false }
      ],
      note: 'Dấu ngoặc kép dẫn nguyên văn lời đối đáp giữa em bé và các nhân vật tưởng tượng.'
    },
    {
      id: 'r2_q4',
      team: 3,
      title: 'Ghi chú 4: Đại từ nhân xưng ngôi thứ nhất số nhiều',
      prompt: 'Từ "bọn tớ" trong lời gọi mời ở bài thơ Mây và sóng thuộc loại từ nào và chỉ những ai?',
      options: [
        { text: 'A. Là danh từ riêng chỉ tên một hòn đảo xa.', correct: false },
        { text: 'B. Là đại từ nhân xưng ngôi thứ nhất số nhiều, dùng để chỉ những người sống trên mây và trong sóng.', correct: true },
        { text: 'C. Là thán từ bộc lộ cảm xúc vui vẻ ngạc nhiên.', correct: false },
        { text: 'D. Là tính từ miêu tả tính cách thân thiện của các bạn nhỏ.', correct: false }
      ],
      note: '"Bọn tớ" thể hiện sự gần gũi, mời gọi rủ rỉ như những người bạn cùng trang lứa.'
    }
  ],

  round3_scenarios: [
    {
      id: 'r3_s1',
      teamId: 0,
      situationTitle: 'Tình huống 1: Mẹ tan ca muộn & Cơn mưa bất chợt',
      desc: '17:15 chiều, trời đổ cơn mưa rào lớn. Xe của mẹ bị hỏng lốp trên đường đi đón con. Con đứng đợi dưới mái hiên trường học.',
      choices: [
        {
          btn: 'Phương án A: Hờn dỗi, trách móc khi mẹ đến vì để mình đợi ướt lạnh.',
          impact: 'Mẹ vừa dầm mưa lạnh vừa buồn lòng, khoảng cách mẹ con trở nên xa xôi.',
          score: 0,
          sharing: -5,
          feedback: 'Mẹ đã vất vả vượt mưa gió, sự hờn dỗi khiến mẹ càng thêm kiệt sức.'
        },
        {
          btn: 'Phương án B: Kiên nhẫn trú mưa an toàn, khi thấy mẹ liền chạy lại lau nước mưa trên mặt mẹ và nói: "Con biết mẹ đã vội lắm, mẹ có bị lạnh không?"',
          impact: 'Nụ cười ấm áp nở trên môi mẹ, bao mệt nhọc tan biến trong tình yêu thương!',
          score: 20,
          sharing: 20,
          feedback: 'Hành động ấm áp như "mặt trời của mẹ"! Con đã thấu hiểu nỗi vất vả của mẹ.'
        },
        {
          btn: 'Phương án C: Tự ý chạy dưới mưa đi tìm mẹ giữa đường lớn.',
          impact: 'Cực kỳ nguy hiểm khi giao thông trơn trượt và sấm sét.',
          score: 0,
          sharing: 0,
          feedback: 'Tuyệt đối không chạy ra đường mưa gió một mình, cần ở nơi an toàn có thầy cô bảo vệ.'
        }
      ]
    },
    {
      id: 'r3_s2',
      teamId: 1,
      situationTitle: 'Tình huống 2: Sức mạnh của biện pháp Điệp Ngữ trong lời an ủi',
      desc: 'Về đến nhà, mẹ ôm đầu vì cơn sốt nhẹ sau cả ngày làm việc căng thẳng. Nhớ lại đoạn thơ chứa biện pháp điệp từ trong bài "Mây và sóng":\n"Con lăn, lăn, lăn mãi rồi sẽ cười vang vỡ tan vào lòng mẹ..."',
      choices: [
        {
          btn: 'Phương án A: Bật nhạc tivi thật to để át tiếng mệt mỏi.',
          impact: 'Tiếng ồn làm cơn đau đầu của mẹ tăng thêm.',
          score: 0,
          sharing: 0,
          feedback: 'Người ốm cần không gian yên tĩnh nghỉ ngơi.'
        },
        {
          btn: 'Phương án B: Rót một cốc nước ấm, lấy khăn mát đắp trán mẹ, nhẹ nhàng ôm mẹ và thủ thỉ: "Mẹ nghỉ một chút, con sẽ trông nhà cho mẹ nhé!"',
          impact: 'Biện pháp điệp ngữ yêu thương hóa thành hành động dịu dàng bên bến bờ mẹ hiền.',
          score: 20,
          sharing: 20,
          feedback: 'Con chính là bến đỗ bình yên, ấm áp che chở cho tâm hồn mẹ như bài thơ Mây và sóng!'
        },
        {
          btn: 'Phương án C: Đòi mẹ nấu ngay món ngon vì đã đến giờ ăn.',
          impact: 'Mẹ gắng gượng và bệnh trở nặng hơn.',
          score: 0,
          sharing: -5,
          feedback: 'Khi mẹ ốm, con cần biết sẻ chia thay vì đòi hỏi.'
        }
      ]
    },
    {
      id: 'r3_s3',
      teamId: 2,
      situationTitle: 'Tình huống 3: Lời nói dối vô hại hay sự sẻ chia thật lòng?',
      desc: 'Bé An phát hiện một chiếc áo khoác của mẹ đã sờn chỉ ở cổ tay, nhưng mẹ luôn nói: "Mẹ thích chiếc áo này lắm, chưa cần mua áo mới đâu, để tiền mua sách truyện cho con."',
      choices: [
        {
          btn: 'Phương án A: Đồng ý ngay và đòi mẹ mua thêm bộ đồ chơi đắt tiền mới ra mắt.',
          impact: 'Mẹ càng thêm gánh nặng chi tiêu gia đình.',
          score: 0,
          sharing: -5,
          feedback: 'Mẹ luôn nhường nhịn cho con, nhưng con cũng cần biết trân quý và tiết kiệm cùng mẹ.'
        },
        {
          btn: 'Phương án B: Nhận ra sự hy sinh thầm lặng của mẹ; dùng tiền tiết kiệm nuôi heo đất cùng bố chọn tặng mẹ một chiếc khăn ấm nhân dịp 20/10.',
          impact: 'Một sự thấu hiểu trưởng thành khiến mẹ rơi nước mắt vì hạnh phúc!',
          score: 20,
          sharing: 20,
          feedback: 'Tấm lòng tri ân và thấu hiểu là món quà quý giá nhất con dành tặng người chăm sóc mình.'
        },
        {
          btn: 'Phương án C: Chê chiếc áo của mẹ cũ kỹ trước mặt bạn bè.',
          impact: 'Làm tổn thương lòng tự trọng và tình cảm của mẹ.',
          score: 0,
          sharing: -10,
          feedback: 'Mọi thứ mẹ dành cho con đều là tình yêu vĩ đại, không bao giờ được so sánh phán xét.'
        }
      ]
    },
    {
      id: 'r3_s4',
      teamId: 3,
      situationTitle: 'Tình huống 4: Ai là người làm việc nhà trong gia đình?',
      desc: 'Bữa cơm chiều xong, em trai bảo: "Việc rửa bát quét nhà là việc của phụ nữ, chúng con là con trai không phải làm đâu ạ!".',
      choices: [
        {
          btn: 'Phương án A: Đồng ý với em và để mẹ một mình dọn dẹp toàn bộ bãi chiến trường gian bếp.',
          impact: 'Mẹ tiếp tục làm việc một mình tới đêm khuya mệt lử.',
          score: 0,
          sharing: -5,
          feedback: 'Định kiến sai lầm khiến gánh nặng dồn lên vai một người.'
        },
        {
          btn: 'Phương án B: Nhẹ nhàng giải thích: "Gia đình là tổ ấm chung của mọi thành viên. Bất kể là ai, cùng nhau san sẻ việc nhà chính là cách bày tỏ yêu thương thiết thực nhất!"',
          impact: 'Cả nhà cùng nhau rửa bát, lau bàn, tiếng cười rộn rã khắp gian bếp ấm!',
          score: 20,
          sharing: 20,
          feedback: 'Bài học bình đẳng và sẻ chia sâu sắc: Yêu thương không chỉ bằng lời nói mà bằng hành động mỗi ngày!'
        },
        {
          btn: 'Phương án C: Quát mắng em gay gắt làm không khí gia đình mất vui.',
          impact: 'Gây bất hòa trong gia đình.',
          score: 0,
          sharing: 0,
          feedback: 'Hãy dùng sự giải thích dịu dàng, thuyết phục và làm gương trước cho em noi theo.'
        }
      ]
    }
  ],

  round4_chores: [
    { id: 'c1', name: 'Nhặt rau & Rửa củ quả', category: 'Bep', team: 0, tip: 'Giúp mẹ chuẩn bị thực phẩm tươi sạch' },
    { id: 'c2', name: 'Phân tích ẩn dụ "Ánh nắng chảy"', category: 'Hoc', team: 0, tip: 'Kiến thức Ngữ văn 6 - Cảm giác thị giác thành xúc giác' },
    { id: 'c3', name: 'Quét dọn phòng khách & Lau bàn', category: 'Nha', team: 1, tip: 'Giữ không gian nhà cửa ngăn nắp thoáng đãng' },
    { id: 'c4', name: 'Xác định điệp từ "Lăn, lăn, lăn"', category: 'Hoc', team: 1, tip: 'Tác dụng diễn tả niềm vui nũng nịu quấn quýt bên mẹ' },
    { id: 'c5', name: 'Gấp quần áo khô bỏ vào tủ', category: 'Nha', team: 2, tip: 'Việc nhỏ vừa sức mọi học sinh đều làm được' },
    { id: 'c6', name: 'Giải thích đại từ "Bọn tớ"', category: 'Hoc', team: 2, tip: 'Chỉ các nhân vật trên mây và trong sóng' },
    { id: 'c7', name: 'Rửa bát đĩa & Lau khô thìa đũa', category: 'Bep', team: 3, tip: 'Sẻ chia sau bữa tối ấm cúng cùng cả nhà' },
    { id: 'c8', name: 'Đặt dấu ngoặc kép lời thoại', category: 'Hoc', team: 3, tip: 'Dấu câu đánh dấu lời nói trực tiếp' }
  ] as ChoreItem[]
};

// Web Audio synthesizer for instant effects
class SoundFX {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq: number, type: OscillatorType = 'sine', duration = 0.2, gainVal = 0.15) {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {}
  }

  playTing() {
    this.playTone(880, 'sine', 0.25, 0.2);
    setTimeout(() => this.playTone(1320, 'sine', 0.35, 0.25), 100);
  }

  playFanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.4, 0.25), idx * 130);
    });
  }

  playWrong() {
    this.playTone(260, 'sawtooth', 0.2, 0.15);
    setTimeout(() => this.playTone(200, 'sawtooth', 0.3, 0.15), 140);
  }

  playShard() {
    const arpeggio = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    arpeggio.forEach((n, i) => {
      setTimeout(() => this.playTone(n, 'sine', 0.35, 0.2), i * 110);
    });
  }
}

const sfx = new SoundFX();

export default function App() {
  // Classroom and School Information
  const [classInfo, setClassInfo] = useState({
    className: 'Lớp 6A1',
    schoolName: 'THCS Lê Quý Đôn',
    teacherName: 'Cô Nguyễn Ly',
    assignmentNote: 'Thực hành bài học Ngữ văn 6 và giúp đỡ mẹ các công việc nhà nhân ngày 20/10.',
  });

  // 4 Teams corresponding to 4 Tổ thi đua (100 points scale total)
  const [teams, setTeams] = useState<Team[]>([
    { groupName: 'Tổ 1', name: 'HOA HỒNG', leader: 'Thu Hà', score: 0, icon: '🌹', color: 'rose', taskNote: 'Nhiệm vụ 1: Ẩn dụ Mặt trời của mẹ & Nhặt rau giúp mẹ' },
    { groupName: 'Tổ 2', name: 'ÁNH DƯƠNG', leader: 'Minh Đức', score: 0, icon: '☀️', color: 'amber', taskNote: 'Nhiệm vụ 2: Ẩn dụ Ánh nắng chảy & Quét dọn nhà cửa' },
    { groupName: 'Tổ 3', name: 'NGÔI SAO', leader: 'Lan Anh', score: 0, icon: '⭐', color: 'indigo', taskNote: 'Nhiệm vụ 3: Tác phẩm Mây và sóng & Gấp quần áo' },
    { groupName: 'Tổ 4', name: 'TRÁI TIM', leader: 'Quang Hải', score: 0, icon: '💖', color: 'emerald', taskNote: 'Nhiệm vụ 4: Điệp từ tình mẫu tử & Rửa bát đĩa' }
  ]);

  // Game stage: 0: Welcome, 1: Morning, 2: Noon, 3: Afternoon, 4: Evening, 5: Night Reflection, 6: Grand Finale
  const [round, setRound] = useState<number>(0);
  const [subStep, setSubStep] = useState<number>(0);
  const [activeTeamIdx, setActiveTeamIdx] = useState<number>(0);

  const [metrics, setMetrics] = useState({
    knowledge: 0,
    sharing: 0,
    problem: 0
  });

  const [shards, setShards] = useState<boolean[]>([false, false, false, false, false]);

  // Voice Narrator State
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);
  const [selectedVoice, setSelectedVoice] = useState<string>('Leda'); // Requested Leda
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentSpeakingText, setCurrentSpeakingText] = useState<string>('');
  const [narrativeSpeaker, setNarrativeSpeaker] = useState<{ title: string; avatar: string }>({
    title: 'Cô Tiên Thời Gian',
    avatar: '🧚‍♀️'
  });
  const [narrativeText, setNarrativeText] = useState<string>(
    'Chào mừng các con đến với chuyến du hành đặc biệt: "Nếu Con Là Mẹ Trong Một Ngày"! Tôi là giọng đọc Leda từ nền tảng Google AI Studio, sẽ đồng hành cùng các con trong ngày 20 tháng 10 này.'
  );

  // Timer state
  const [timerLimit, setTimerLimit] = useState<number>(30);
  const [timerRemaining, setTimerRemaining] = useState<number>(30);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Modals & UI
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);
  const DEFAULT_SHEET_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxiRmI-Y5RbWC_Bu-zUvoiIwIU7BqpSFbK01nbUpNrFh7DaOmDYZRtrKW0VLRMbOnhmpQ/exec';

  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState<boolean>(false);
  const [copiedAssignment, setCopiedAssignment] = useState<boolean>(false);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState<boolean>(false);
  const [sheetScriptUrl, setSheetScriptUrl] = useState<string>(() => {
    const saved = localStorage.getItem('applet_sheet_script_url');
    return saved && saved.trim().length > 0 ? saved : DEFAULT_SHEET_SCRIPT_URL;
  });
  const [isTestingSheet, setIsTestingSheet] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string; isPerm?: boolean } | null>(null);
  const [studentSubmitForm, setStudentSubmitForm] = useState({
    hoVaTen: '',
    to: 'Tổ 1',
    lop: 'Lớp 6A1',
    diem: 100,
  });
  const [isSubmittingSheet, setIsSubmittingSheet] = useState<boolean>(false);
  const [showScriptCode, setShowScriptCode] = useState<boolean>(false);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ title: string; message: string; icon: string } | null>(null);

  // Round 1 state
  const [r1Feedback, setR1Feedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [r1DisabledOptions, setR1DisabledOptions] = useState<boolean>(false);

  // Round 2 state
  const [r2Feedback, setR2Feedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [r2DisabledOptions, setR2DisabledOptions] = useState<boolean>(false);

  // Round 3 state
  const [r3Feedback, setR3Feedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [r3DisabledOptions, setR3DisabledOptions] = useState<boolean>(false);

  // Round 4 chores completed
  const [completedChores, setCompletedChores] = useState<Record<string, boolean>>({});

  // Round 5 Greeting Card
  const [cardRecipient, setCardRecipient] = useState<string>('Mẹ kính yêu');
  const [cardMessage, setCardMessage] = useState<string>(
    'Nhân ngày 20/10, con chúc mẹ luôn mạnh khỏe, nở nụ cười tươi trên môi. Hôm nay trải nghiệm làm mẹ, con mới hiểu mẹ đã vất vả thế nào. Con hứa sẽ luôn chăm chỉ và sẻ chia việc nhà cùng mẹ mỗi ngày!'
  );
  const [cardSender, setCardSender] = useState<string>('Con bé An & Các bạn học sinh');
  const [cardBg, setCardBg] = useState<string>('#FFF0F5');
  const [cardColor, setCardColor] = useState<string>('#F43F5E');

  // Round 6 Finale Countdown
  const [finaleCountdown, setFinaleCountdown] = useState<number>(5);

  // Robust Audio refs to completely eliminate audio overlap
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentAbortControllerRef = useRef<AbortController | null>(null);
  const currentRequestIdRef = useRef<number>(0);

  // Toast Helper
  const showToast = (title: string, message: string, icon = '💡') => {
    setToast({ title, message, icon });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  /**
   * Completely stops any ongoing audio playback and aborts pending fetch requests.
   */
  const stopCurrentAudio = () => {
    currentRequestIdRef.current++;
    if (currentAbortControllerRef.current) {
      currentAbortControllerRef.current.abort();
      currentAbortControllerRef.current = null;
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current.src = '';
      currentAudioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setCurrentSpeakingText('');
  };

  const getVoiceLabel = (v: string) => {
    if (v === 'Leda') return 'Leda (VN Bắc Bộ)';
    if (v === 'Aoede_VI') return 'Aoede (VN Bắc Bộ)';
    if (v === 'Puck') return 'Puck (US English)';
    if (v === 'Kore_EN' || v === 'Kore') return 'Kore (US English)';
    if (v === 'Charon') return 'Charon (US English)';
    if (v === 'Fenrir') return 'Fenrir (US English)';
    if (v === 'Zephyr_EN') return 'Zephyr (US English)';
    return v;
  };

  const copyAssignmentsToClipboard = () => {
    const text = `📋 KẾ HOẠCH GIAO BÀI TẬP & THI ĐUA (THANG 100 ĐIỂM)
🏫 Trường: ${classInfo.schoolName} - Lớp: ${classInfo.className}
👩‍🏫 Giáo viên: ${classInfo.teacherName} - Môn: Ngữ Văn 6
🌸 Chủ đề 20/10: Nếu Con Là Mẹ Trong Một Ngày

📌 NHIỆM VỤ CHUNG CHO CẢ LỚP:
${classInfo.assignmentNote}

🎯 NHIỆM VỤ PHÂN CÔNG CHO 4 TỔ THI ĐUA (THANG 100 ĐIỂM):
${teams
  .map(
    (t) =>
      `• ${t.groupName} (${t.name}) - Tổ trưởng: ${t.leader}
  Điểm thi đua hiện tại: ${t.score}/100đ
  Nhiệm vụ: ${t.taskNote || 'Hoàn thành bài tập Ngữ văn 6 và giúp việc nhà'}`
  )
  .join('\n\n')}

Ngày giao: ${new Date().toLocaleDateString('vi-VN')}
Chúc các bạn học tập tốt và sẻ chia yêu thương cùng mẹ!`;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedAssignment(true);
        showToast('ĐÃ SAO CHÉP', 'Đã lưu danh sách giao bài vào bộ nhớ tạm để gửi Zalo!', '📋');
        setTimeout(() => setCopiedAssignment(false), 3000);
      })
      .catch(() => {
        showToast('THÔNG BÁO', 'Vui lòng sao chép thủ công nội dung', '⚠️');
      });
  };

  const GOOGLE_APPS_SCRIPT_SAMPLE = `/**
 * GOOGLE APPS SCRIPT TỰ ĐỘNG GHI KẾT QUẢ VÀO GOOGLE SHEETS
 * Bảng tính ID: 12mRK7ZmxScrJwnBmFa-9gdmKSKtZtSfiIvNug9g3llM
 * Tên trang tính: Mật mã
 * Cột A-F: STT | Họ và tên | Tổ | Lớp | Thời gian nộp bài | Điểm
 */
const SPREADSHEET_ID = "12mRK7ZmxScrJwnBmFa-9gdmKSKtZtSfiIvNug9g3llM";
const SHEET_NAME = "Mật mã";

function doPost(e) { return handleRequest(e); }
function doGet(e) { return handleRequest(e); }

function handleRequest(e) {
  try {
    const lock = LockService.getScriptLock();
    lock.waitLock(30000);

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) { sheet = ss.insertSheet(SHEET_NAME); }

    if (sheet.getLastRow() === 0) {
      const headers = ["STT", "Họ và tên", "Tổ", "Lớp", "Thời gian nộp bài", "Điểm"];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, 6).setBackground("#E11D48").setFontColor("#FFFFFF").setFontWeight("bold").setHorizontalAlignment("center");
      sheet.setRowHeight(1, 35);
      sheet.setColumnWidth(1, 60);
      sheet.setColumnWidth(2, 220);
      sheet.setColumnWidth(3, 100);
      sheet.setColumnWidth(4, 100);
      sheet.setColumnWidth(5, 190);
      sheet.setColumnWidth(6, 90);
    }

    let data = {};
    if (e && e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); } catch (err) { data = e.parameter || {}; }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    const hoVaTen = data.hoVaTen || data.name || "Học sinh";
    const to = data.to || "Tổ 1";
    const lop = data.lop || "Lớp 6A1";
    const diem = data.diem !== undefined ? data.diem : 100;
    let thoiGian = data.thoiGian || Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");

    const nextRow = sheet.getLastRow() + 1;
    const stt = nextRow - 1;

    sheet.appendRow([stt, hoVaTen, to, lop, thoiGian, diem]);
    sheet.getRange(nextRow, 1).setHorizontalAlignment("center");
    sheet.getRange(nextRow, 3).setHorizontalAlignment("center");
    sheet.getRange(nextRow, 4).setHorizontalAlignment("center");
    sheet.getRange(nextRow, 5).setHorizontalAlignment("center");
    sheet.getRange(nextRow, 6).setHorizontalAlignment("center").setFontWeight("bold");

    lock.releaseLock();

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Đã lưu kết quả thành công!",
      data: { stt, hoVaTen, to, lop, thoiGian, diem }
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const handleTestSheetConnection = async () => {
    setIsTestingSheet(true);
    setTestResult(null);
    try {
      const urlToTest = (sheetScriptUrl || DEFAULT_SHEET_SCRIPT_URL).trim();
      const res = await fetch(`/api/test-sheet?url=${encodeURIComponent(urlToTest)}`);
      const data = await res.json();
      if (data.connected) {
        setTestResult({ ok: true, msg: 'Kết nối thành công! Web App sẵn sàng ghi điểm.' });
        showToast('KẾT NỐI THÀNH CÔNG', 'Google Sheets Web App sẵn sàng nhận dữ liệu!', '✅');
      } else {
        setTestResult({
          ok: false,
          msg: data.message || 'Không thể kết nối đến Web App',
          isPerm: data.isPermissionError,
        });
        showToast('LƯU Ý QUYỀN TRUY CẬP', data.message || 'Vui lòng kiểm tra quyền truy cập Apps Script', '⚠️');
      }
    } catch (e: any) {
      setTestResult({ ok: false, msg: e?.message || 'Lỗi mạng khi kiểm tra kết nối' });
    } finally {
      setIsTestingSheet(false);
    }
  };

  const handleSubmitToGoogleSheet = async () => {
    if (!studentSubmitForm.hoVaTen.trim()) {
      showToast('THIẾU THÔNG TIN', 'Vui lòng nhập Họ và tên học sinh!', '⚠️');
      return;
    }
    const finalUrl = (sheetScriptUrl || DEFAULT_SHEET_SCRIPT_URL).trim();
    if (!finalUrl) {
      showToast('CHƯA CÓ URL SCRIPT', 'Vui lòng dán URL Google Apps Script Web App để gửi!', '⚠️');
      setShowScriptCode(true);
      return;
    }

    setIsSubmittingSheet(true);
    try {
      const payload = {
        scriptUrl: finalUrl,
        hoVaTen: studentSubmitForm.hoVaTen.trim(),
        to: studentSubmitForm.to,
        lop: studentSubmitForm.lop || classInfo.className,
        thoiGian: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
        diem: studentSubmitForm.diem,
      };

      localStorage.setItem('applet_sheet_script_url', finalUrl);

      const res = await fetch('/api/submit-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.status !== 'error') {
        showToast('NỘP BÀI THÀNH CÔNG', `Đã lưu kết quả của ${studentSubmitForm.hoVaTen} vào Google Sheets 'Mật mã'!`, '✅');
        sfx.playFanfare();
        setIsSheetModalOpen(false);
      } else if (data.isPermissionError) {
        setTestResult({
          ok: false,
          msg: data.message || 'Lỗi 403: Google Apps Script yêu cầu quyền "Bất kỳ ai" (Anyone).',
          isPerm: true,
        });
        showToast('LỖI QUYỀN TRUY CẬP 403', 'Cần chọn "Ai có quyền truy cập: Bất kỳ ai" trong Apps Script Deploy!', '⚠️');
      } else {
        showToast('LỖI GỬI DỮ LIỆU', data.error || data.message || 'Không thể lưu vào Google Sheets', '❌');
      }
    } catch (err: any) {
      showToast('LỖI KẾT NỐI', err?.message || 'Lỗi kết nối máy chủ', '❌');
    } finally {
      setIsSubmittingSheet(false);
    }
  };

  const copyScriptCodeToClipboard = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_SAMPLE).then(() => {
      setCopiedScript(true);
      showToast('ĐÃ SAO CHÉP MÃ SCRIPT', 'Đã lưu mã Google Apps Script vào bộ nhớ tạm!', '📋');
      setTimeout(() => setCopiedScript(false), 3000);
    });
  };

  /**
   * Speaks the provided text using Leda AI or American English native voice.
   */
  const speakNarrative = async (textToSpeak: string) => {
    if (!isVoiceEnabled || !textToSpeak?.trim()) return;

    // 1. Immediately kill any playing or pending audio
    stopCurrentAudio();

    const thisRequestId = ++currentRequestIdRef.current;
    const abortController = new AbortController();
    currentAbortControllerRef.current = abortController;

    setIsSpeaking(true);
    setCurrentSpeakingText(textToSpeak.trim());

    const isEnglish = selectedVoice.endsWith('_EN') || ['Puck', 'Charon', 'Fenrir', 'Kore'].includes(selectedVoice);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSpeak,
          voiceName: selectedVoice,
          lang: isEnglish ? 'en' : 'vi',
        }),
        signal: abortController.signal,
      });

      if (thisRequestId !== currentRequestIdRef.current) {
        return;
      }

      if (response.ok) {
        const data = await response.json();
        if (thisRequestId !== currentRequestIdRef.current) return;

        if (data.audio) {
          const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
          currentAudioRef.current = audio;

          audio.onended = () => {
            if (thisRequestId === currentRequestIdRef.current) {
              setIsSpeaking(false);
              setCurrentSpeakingText('');
              currentAudioRef.current = null;
            }
          };

          audio.onerror = () => {
            if (thisRequestId === currentRequestIdRef.current) {
              setIsSpeaking(false);
              setCurrentSpeakingText('');
              currentAudioRef.current = null;
            }
          };

          await audio.play();
          return;
        }
      }
    } catch (e: any) {
      if (e?.name === 'AbortError') return;
      console.warn('Gemini TTS fetch error, fallback:', e);
    }

    if (thisRequestId !== currentRequestIdRef.current) return;

    // Graceful fallback to browser speech synthesis
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = isEnglish ? 'en-US' : 'vi-VN';
      utterance.rate = 0.93;
      utterance.pitch = 1.05;
      utterance.onend = () => {
        if (thisRequestId === currentRequestIdRef.current) {
          setIsSpeaking(false);
          setCurrentSpeakingText('');
        }
      };
      utterance.onerror = () => {
        if (thisRequestId === currentRequestIdRef.current) {
          setIsSpeaking(false);
          setCurrentSpeakingText('');
        }
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
      setCurrentSpeakingText('');
    }
  };

  /**
   * Updates narrator title and text.
   */
  const updateNarrative = (title: string, avatar: string, text: string, autoSpeak = false) => {
    setNarrativeSpeaker({ title, avatar });
    setNarrativeText(text);
    if (autoSpeak) {
      speakNarrative(text);
    }
  };

  // Timer controller
  const startChallengeTimer = (seconds?: number) => {
    stopChallengeTimer();
    const initial = seconds !== undefined ? seconds : (timerRemaining > 0 ? timerRemaining : timerLimit);
    if (!initial || initial <= 0) return;

    setTimerRemaining(initial);
    setIsTimerRunning(true);

    timerRef.current = setInterval(() => {
      setTimerRemaining((prev) => {
        if (prev <= 1) {
          stopChallengeTimer();
          sfx.playWrong();
          showToast('HẾT GIỜ THẢO LUẬN!', 'Đội hãy nhanh chóng chọn đáp án nhé!', '⏱️');
          return 0;
        }
        if (prev <= 5) {
          sfx.playTone(600, 'sine', 0.1, 0.08);
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseChallengeTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTimerRunning(false);
  };

  const stopChallengeTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTimerRunning(false);
  };

  const resetChallengeTimer = (customSeconds?: number) => {
    stopChallengeTimer();
    const secs = customSeconds !== undefined ? customSeconds : timerLimit;
    setTimerRemaining(secs);
  };

  // Add Score
  const addScore = (teamIdx: number, points: number, metricType: 'knowledge' | 'sharing' | 'problem') => {
    setTeams((prev) => {
      const copy = [...prev];
      copy[teamIdx] = { ...copy[teamIdx], score: copy[teamIdx].score + points };
      return copy;
    });

    setMetrics((prev) => ({
      ...prev,
      [metricType]: prev[metricType] + points,
    }));

    sfx.playTing();
  };

  // Unlock Magic Clock Shard
  const unlockClockShard = (shardIndex: number) => {
    setShards((prev) => {
      const copy = [...prev];
      if (!copy[shardIndex]) {
        copy[shardIndex] = true;
        sfx.playShard();
        showToast(
          'ĐỒNG HỒ PHÉP THUẬT PHÁT SÁNG!',
          `Chúc mừng cả lớp đã thu thập thành công Mảnh Ghép Thời Gian thứ ${shardIndex + 1}!`,
          '💎'
        );
      }
      return copy;
    });
  };

  // Change turns
  const nextTeamTurn = () => {
    setActiveTeamIdx((prev) => (prev + 1) % 4);
  };

  // Handlers for Round 1 (Each task = 20 points)
  const initRound1Task = (index: number) => {
    setRound(1);
    setSubStep(index);
    setActiveTeamIdx(index % 4);
    setR1Feedback(null);
    setR1DisabledOptions(false);

    const task = LESSON_BANK.round1[index];
    const team = teams[index % 4];

    // DO NOT auto-speak the question! Wait for the teacher/student to click the speaker button.
    updateNarrative(
      'Bé An (Thử làm mẹ)',
      '👧',
      `06:30 sáng! Đã đến lượt ${team.groupName} (${team.name} - Tổ trưởng: ${team.leader}) giải quyết ${task.title}. Các con hãy nghe đọc câu hỏi và bắt đầu tính giờ thảo luận nhé!`,
      false
    );

    // DO NOT start timer automatically! Wait for teacher/student to click play.
    resetChallengeTimer(timerLimit);
  };

  const handleR1Answer = (choiceIdx: number) => {
    stopChallengeTimer();
    stopCurrentAudio(); // Cut any ongoing question playback immediately
    const task = LESSON_BANK.round1[subStep];
    if (!task.options) return;
    const chosen = task.options[choiceIdx];

    setR1DisabledOptions(true);

    if (chosen.correct) {
      addScore(activeTeamIdx, 20, 'knowledge'); // +20 points towards 100
      const feedbackMsg = `Tuyệt vời lắm! ${chosen.explain || chosen.feedback || 'Chúc mừng con đã trả lời chính xác!'}`;
      setR1Feedback({
        type: 'success',
        msg: `🎉 CHÍNH XÁC! (+20 ĐIỂM cho ${teams[activeTeamIdx].groupName} - ${teams[activeTeamIdx].name})\n${chosen.explain || chosen.feedback}`,
      });

      // SPEAK ENCOURAGEMENT IMMEDIATELY!
      updateNarrative('Cô Tiên Thời Gian', '🧚‍♀️', feedbackMsg, true);

      setTimeout(() => {
        if (subStep < 3) {
          initRound1Task(subStep + 1);
        } else {
          unlockClockShard(0);
          updateNarrative(
            'Cô Tiên Thời Gian',
            '🧚‍♀️',
            'Đồng hồ phép thuật đã phát sáng mảnh ghép đầu tiên! Chúng mình cùng bước vào buổi trưa nhé!',
            false
          );
          setSubStep(4);
        }
      }, 3000);
    } else {
      sfx.playWrong();
      const feedbackMsg = `Chưa đúng rồi! Gợi ý: ${chosen.explain || chosen.feedback || 'Hãy cùng suy nghĩ lại nhé!'}`;
      setR1Feedback({
        type: 'error',
        msg: `💡 GỢI Ý: ${chosen.explain || chosen.feedback}\nCác con hãy thảo luận lại để đưa ra câu trả lời đúng nhé!`,
      });

      // SPEAK ENCOURAGEMENT IMMEDIATELY!
      updateNarrative('Cô Tiên Thời Gian', '🧚‍♀️', feedbackMsg, true);

      setTimeout(() => {
        setR1DisabledOptions(false);
      }, 1800);
    }
  };

  const handleR1OrderSubmit = () => {
    stopChallengeTimer();
    stopCurrentAudio();
    addScore(activeTeamIdx, 20, 'problem'); // +20 points
    const praise = `Kế hoạch hoàn hảo! ${teams[activeTeamIdx].groupName} (${teams[activeTeamIdx].name}) đã sắp xếp các công việc buổi sáng vô cùng khoa học và an toàn!`;
    setR1Feedback({
      type: 'success',
      msg: `⭐ ${praise} (+20 điểm thi đua)`,
    });

    // SPEAK ENCOURAGEMENT IMMEDIATELY!
    updateNarrative('Cô Tiên Thời Gian', '🧚‍♀️', praise, true);

    setTimeout(() => {
      if (subStep < 3) {
        initRound1Task(subStep + 1);
      } else {
        unlockClockShard(0);
        setSubStep(4);
      }
    }, 3000);
  };

  // Handlers for Round 2 (Each task = 20 points)
  const initRound2Task = (index: number) => {
    setRound(2);
    setSubStep(index);
    setActiveTeamIdx(index % 4);
    setR2Feedback(null);
    setR2DisabledOptions(false);

    const task = LESSON_BANK.round2[index];
    const team = teams[index % 4];

    // DO NOT auto-speak the question! Wait for user to click speaker.
    updateNarrative(
      'Bé An (Thử làm mẹ)',
      '👧',
      `11:45 trưa rồi! Mẹ để lại một ghi chú cần giải mã. Mời ${team.groupName} (${team.name}) cùng tham gia giải đáp: ${task.title}. Bấm vào loa để nghe đọc câu hỏi nhé!`,
      false
    );

    // DO NOT start timer automatically! Wait for user to click play.
    resetChallengeTimer(timerLimit);
  };

  const handleR2Answer = (choiceIdx: number) => {
    stopChallengeTimer();
    stopCurrentAudio();
    const task = LESSON_BANK.round2[subStep];
    const chosen = task.options[choiceIdx];

    setR2DisabledOptions(true);

    if (chosen.correct) {
      addScore(activeTeamIdx, 20, 'knowledge'); // +20 points
      const praise = `Rất giỏi! ${task.note}`;
      setR2Feedback({
        type: 'success',
        msg: `🎉 CHÍNH XÁC! (+20 ĐIỂM cho ${teams[activeTeamIdx].groupName} - ${teams[activeTeamIdx].name})\n💡 Bài học: ${task.note}`,
      });

      // SPEAK ENCOURAGEMENT IMMEDIATELY!
      updateNarrative('Cô Tiên Thời Gian', '🧚‍♀️', praise, true);

      setTimeout(() => {
        if (subStep < 3) {
          initRound2Task(subStep + 1);
        } else {
          unlockClockShard(1);
          updateNarrative(
            'Cô Tiên Thời Gian',
            '🧚‍♀️',
            'Mảnh ghép thứ hai đã về tay các con! Giờ là buổi chiều với những tình huống bất ngờ cần sự thấu hiểu.',
            false
          );
          setSubStep(4);
        }
      }, 3000);
    } else {
      sfx.playWrong();
      const feedbackMsg = 'Chưa đúng rồi! Các con hãy nhớ lại bài thơ Mây và sóng trong sách giáo khoa để chọn lại nhé!';
      setR2Feedback({
        type: 'error',
        msg: `💡 Gợi ý: Hãy nhớ lại chi tiết trong văn bản Mây và sóng SGK Ngữ văn 6 để chọn lại nhé!`,
      });

      // SPEAK ENCOURAGEMENT IMMEDIATELY!
      updateNarrative('Cô Tiên Thời Gian', '🧚‍♀️', feedbackMsg, true);

      setTimeout(() => {
        setR2DisabledOptions(false);
      }, 1800);
    }
  };

  // Handlers for Round 3 (Each task = 20 points)
  const initRound3Task = (index: number) => {
    setRound(3);
    setSubStep(index);
    setActiveTeamIdx(index % 4);
    setR3Feedback(null);
    setR3DisabledOptions(false);

    const item = LESSON_BANK.round3_scenarios[index];
    const team = teams[index % 4];

    // DO NOT auto-speak! Wait for user to click speaker.
    updateNarrative(
      'Bé An (Nhập vai mẹ)',
      '👧',
      `17:15 chiều rồi! Có một tình huống bất ngờ xảy ra. Mời ${team.groupName} (${team.name}) hãy bấm vào biểu tượng loa để nghe tình huống và chọn cách ứng xử nhân ái nhất!`,
      false
    );

    // DO NOT start timer automatically! Wait for user to click play.
    resetChallengeTimer(timerLimit);
  };

  const handleR3Choice = (choiceIdx: number) => {
    stopChallengeTimer();
    stopCurrentAudio();
    const item = LESSON_BANK.round3_scenarios[subStep];
    const choice = item.choices[choiceIdx];

    setR3DisabledOptions(true);

    if (choice.score > 0) {
      addScore(activeTeamIdx, choice.score, 'sharing'); // +20 points
      setMetrics((prev) => ({ ...prev, problem: prev.problem + 20 }));
      const praise = `Lựa chọn tuyệt vời! ${choice.feedback}`;
      setR3Feedback({
        type: 'success',
        msg: `❤️ LỰA CHỌN TUYỆT VỜI! (+20 ĐIỂM SẺ CHIA cho ${teams[activeTeamIdx].groupName} - ${teams[activeTeamIdx].name})\n🌿 Diễn biến: ${choice.impact}\n💬 Ý nghĩa: ${choice.feedback}`,
      });

      // SPEAK ENCOURAGEMENT IMMEDIATELY!
      updateNarrative('Cô Tiên Thời Gian', '🧚‍♀️', praise, true);

      setTimeout(() => {
        if (subStep < 3) {
          initRound3Task(subStep + 1);
        } else {
          unlockClockShard(2);
          updateNarrative(
            'Cô Tiên Thời Gian',
            '🧚‍♀️',
            'Mảnh ghép thứ ba đã thuộc về các con! Bây giờ cả nhà cùng quây quần bên mâm cơm tối ấm áp.',
            false
          );
          setSubStep(4);
        }
      }, 3200);
    } else {
      sfx.playWrong();
      const advice = `Chưa phù hợp rồi! Lời khuyên: ${choice.feedback}`;
      setR3Feedback({
        type: 'error',
        msg: `⚠️ HỆ QUẢ: ${choice.impact}\n💡 Lời khuyên: ${choice.feedback}\nCác con cùng suy nghĩ để chọn lại cách ứng xử đúng nhé!`,
      });

      // SPEAK ENCOURAGEMENT IMMEDIATELY!
      updateNarrative('Cô Tiên Thời Gian', '🧚‍♀️', advice, true);

      setTimeout(() => {
        setR3DisabledOptions(false);
      }, 2000);
    }
  };

  // Handlers for Round 4 (8 tasks, 2 for each team, 10 points each = 20 points per team)
  const initRound4 = () => {
    setRound(4);
    setSubStep(0);
    stopCurrentAudio();
    updateNarrative(
      'Bé An (Yêu thương là sẻ chia)',
      '👧',
      '19:00 tối! Gian bếp sáng đèn. Chúng mình có 8 thẻ nhiệm vụ việc nhà và kiến thức Ngữ văn 6, mỗi tổ phụ trách 2 thẻ (mỗi thẻ 10 điểm = 20 điểm/tổ). Các đội hãy nhấp chọn thẻ phân công cho đội mình nhé!',
      false
    );
  };

  const handleChoreClick = (chore: ChoreItem) => {
    if (completedChores[chore.id]) return;
    stopCurrentAudio();

    setCompletedChores((prev) => {
      const updated = { ...prev, [chore.id]: true };
      addScore(chore.team, 10, chore.category === 'Hoc' ? 'knowledge' : 'sharing');
      showToast('ĐÃ SẺ CHIA!', `${teams[chore.team].groupName} (${teams[chore.team].name}) đã hoàn thành: "${chore.name}" (+10đ)`, '💖');

      // Speak praise immediately!
      const praise = `Cảm ơn ${teams[chore.team].groupName} đã hoàn thành nhiệm vụ: ${chore.name}! Cộng 10 điểm thi đua!`;
      updateNarrative('Bé An', '👧', praise, true);

      const count = Object.keys(updated).length;
      if (count === 8) {
        setTimeout(() => {
          unlockClockShard(3);
          updateNarrative(
            'Cô Tiên Thời Gian',
            '🧚‍♀️',
            'Tuyệt vời lắm! Căn nhà đã sáng ấm và thơm phức mùi cơm tối. Bây giờ chúng ta sẽ đến với vòng viết nhật ký và thiệp 20/10.',
            false
          );
          setSubStep(1);
        }, 1200);
      }
      return updated;
    });
  };

  // Handlers for Round 5 (Writing Card = +20 points for all teams)
  const initRound5 = () => {
    setRound(5);
    setSubStep(0);
    stopCurrentAudio();
    updateNarrative(
      'Bé An (Viết nhật ký yêu thương)',
      '👧',
      '20:30 tối! An ngồi vào bàn viết nhật ký. Các con hãy cùng viết vài dòng tri ân và tạo một tấm thiệp 20/10 thật đẹp để gửi tặng mẹ, bà, hoặc cô giáo nhé! Vòng này mang lại 20 điểm thi đua cuối cùng.',
      false
    );
  };

  const handleFinishCard = () => {
    stopCurrentAudio();
    for (let i = 0; i < 4; i++) {
      addScore(i, 20, 'sharing'); // +20 points
    }
    unlockClockShard(4);
    updateNarrative(
      'Cô Tiên Thời Gian',
      '🧚‍♀️',
      'Chúc mừng cả 4 tổ! Mỗi tổ đã nhận thêm 20 điểm thi đua trọn vẹn. 5 mảnh ghép đồng hồ đã hội tụ. Nút Hoàn thành một ngày yêu thương đã phát sáng rực rỡ!',
      true
    );
    setSubStep(1);
  };

  // Download Greeting Card as PNG Canvas
  const handleDownloadCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = cardBg;
    ctx.fillRect(0, 0, 800, 500);

    // Border
    ctx.strokeStyle = cardColor;
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, 760, 460);

    // Inner dashed border
    ctx.strokeStyle = '#FDA4AF';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.strokeRect(30, 30, 740, 440);
    ctx.setLineDash([]);

    // Top Title
    ctx.fillStyle = cardColor;
    ctx.font = 'bold 22px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🌸 CHÚC MỪNG NGÀY PHỤ NỮ VIỆT NAM 20/10 🌸', 400, 75);

    // Recipient
    ctx.font = 'bold 32px Comfortaa, cursive';
    ctx.fillStyle = '#831843';
    ctx.fillText(`Kính gửi ${cardRecipient}!`, 400, 135);

    // Message Lines wrap
    ctx.font = '20px Nunito, sans-serif';
    ctx.fillStyle = '#374151';
    const words = `"${cardMessage || 'Chúc mừng ngày 20/10!'}"`.split(' ');
    let line = '';
    let y = 210;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 650 && n > 0) {
        ctx.fillText(line, 400, y);
        line = words[n] + ' ';
        y += 32;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 400, y);

    // Heart icons
    ctx.font = '28px serif';
    ctx.fillStyle = '#F43F5E';
    ctx.fillText('❤️ 🌹 ✨ 💖', 400, 390);

    // Sender
    ctx.font = 'italic bold 20px Nunito, sans-serif';
    ctx.fillStyle = '#6B21A8';
    ctx.textAlign = 'right';
    ctx.fillText(`Yêu thương: ${cardSender} (${classInfo.className})`, 720, 440);

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Thiep_20-10_${classInfo.className}_${cardRecipient.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
      showToast('ĐÃ TẢI THIỆP PNG!', 'Tấm thiệp đã được lưu với phông chữ tiếng Việt sắc nét!', '🎨');
    } catch {
      showToast('LỖI XUẤT ẢNH', 'Không thể tạo file ảnh trực tiếp.', '⚠️');
    }
  };

  // Grand Finale
  const startGrandFinale = () => {
    stopCurrentAudio();
    setRound(6);
    setFinaleCountdown(5);
    sfx.playTone(440, 'triangle', 0.2);

    let current = 5;
    const interval = setInterval(() => {
      current--;
      setFinaleCountdown(current);
      if (current > 0) {
        sfx.playTone(440 + (5 - current) * 80, 'triangle', 0.2);
      } else {
        clearInterval(interval);
        sfx.playFanfare();
        updateNarrative(
          'Cô Tiên Thời Gian & Mẹ',
          '🧚‍♀️👩‍🦰',
          'Các con thân yêu! Một ngày kỳ diệu đã khép lại. Hôm nay, chúng mình không chỉ khám phá kiến thức Ngữ văn mà còn học cách nhìn cuộc sống bằng sự quan tâm và thấu hiểu. Những việc làm nhỏ, những lời cảm ơn và sự sẻ chia mỗi ngày có thể mang đến niềm vui rất lớn. Nhân ngày Phụ nữ Việt Nam 20 tháng 10, hãy dành những lời chúc chân thành đến mẹ, bà, cô giáo và những người phụ nữ thân yêu. Và hãy nhớ: yêu thương không chỉ để nói, mà còn để thực hiện mỗi ngày!',
          true
        );
      }
    }, 1000);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Get current scene visual tags
  const getSceneHeader = () => {
    switch (round) {
      case 1:
        return { time: '06:30 BUỔI SÁNG TẤT BẬT', place: 'Phòng bếp ấm áp & Nắng sớm', bg: 'from-amber-100/70 via-rose-50/60 to-purple-100/50' };
      case 2:
        return { time: '11:45 NHỮNG ĐIỀU MẸ NHỚ', place: 'Bàn làm việc & Bảng ghi chú', bg: 'from-indigo-100/70 via-purple-50/60 to-pink-100/50' };
      case 3:
        return { time: '17:15 KHI MỌI VIỆC BẤT NGỜ', place: 'Cơn mưa chiều & Thử thách nhập vai', bg: 'from-rose-100/70 via-amber-50/60 to-purple-100/50' };
      case 4:
        return { time: '19:00 GIA ĐÌNH SẺ CHIA', place: 'Gian bếp sáng đèn vàng', bg: 'from-emerald-100/70 via-teal-50/60 to-purple-100/50' };
      case 5:
        return { time: '20:30 YÊU THƯƠNG ĐONG ĐẦY', place: 'Trang nhật ký & Thiệp 20/10', bg: 'from-pink-100/70 via-purple-50/60 to-amber-100/50' };
      case 6:
        return { time: 'KHOẢNH KHẮC HOÀN THÀNH', place: 'Hội tụ 5 Mảnh Ghép Phép Thuật', bg: 'from-rose-200/80 via-pink-100/70 to-amber-100/70' };
      default:
        return { time: 'BẮT ĐẦU CHUYẾN ĐI', place: 'Căn phòng nhỏ bé của bé An', bg: 'from-pink-100/60 via-purple-100/60 to-amber-100/50' };
    }
  };

  const sceneInfo = getSceneHeader();

  return (
    <div className="min-h-screen flex flex-col justify-between items-center text-slate-800 p-2 md:p-4 select-none">
      {/* HEADER */}
      <header className="w-full max-w-7xl px-2 py-2.5 flex flex-wrap items-center justify-between gap-3 z-30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-pink-300 floating-anim">
            <Heart className="w-7 h-7 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-xl font-extrabold text-pink-700 tracking-tight font-display">
                NẾU CON LÀ MẸ TRONG MỘT NGÀY
              </h1>
              {/* Class & School Badge */}
              <button
                onClick={() => setIsTeacherModalOpen(true)}
                className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-pink-100 hover:bg-pink-200 text-pink-800 border border-pink-300 transition cursor-pointer"
                title="Bấm để chỉnh sửa thông tin lớp và giao bài"
              >
                <GraduationCap className="w-3.5 h-3.5 text-pink-700" />
                <span>{classInfo.className} • {classInfo.schoolName}</span>
              </button>
            </div>
            <p className="text-xs text-purple-700 font-semibold flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Chào mừng ngày Phụ nữ Việt Nam 20/10 • Ngữ Văn 6 • </span>
              <span className="font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                🎯 Thang điểm thi đua: 100 điểm
              </span>
            </p>
          </div>
        </div>

        {/* 5 Magic Shards Clock Display */}
        <div className="flex items-center gap-3 bg-white/95 px-4 py-2 rounded-2xl border border-pink-200 shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mảnh Ghép:</span>
            <div className="flex gap-1.5">
              {shards.map((unlocked, idx) => (
                <div
                  key={idx}
                  title={unlocked ? `Mảnh ghép ${idx + 1} đã thu thập!` : `Mảnh ghép ${idx + 1} (Chưa mở)`}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black transition-all duration-500 ${
                    unlocked
                      ? 'bg-gradient-to-tr from-amber-400 to-rose-400 text-white shadow-md shadow-pink-300 scale-110 pulse-glow-rose'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {unlocked ? '💎' : idx + 1}
                </div>
              ))}
            </div>
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          <div className="text-xs font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
            {sceneInfo.time}
          </div>
        </div>

        {/* Action Controls: Voice, Report, Teacher Mode, Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Voice Status Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black shadow-sm ${
              isSpeaking
                ? 'bg-gradient-to-r from-rose-100 to-pink-100 border-rose-300 text-rose-800 animate-pulse'
                : 'bg-purple-50 border-purple-200 text-purple-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            <span>
              {isSpeaking
                ? `🎙️ ${selectedVoice.replace('_EN', '').replace('_VI', '')} đang nói...`
                : (selectedVoice.endsWith('_EN') || ['Puck', 'Charon', 'Fenrir'].includes(selectedVoice))
                  ? `🇺🇸 Giọng Mỹ: ${selectedVoice.replace('_EN', '')}`
                  : `🇻🇳 Giọng Leda (Bắc Bộ)`}
            </span>
          </div>

          {/* Voice Selector */}
          <select
            value={selectedVoice}
            onChange={(e) => {
              setSelectedVoice(e.target.value);
              const isEn = e.target.value.endsWith('_EN') || ['Puck', 'Charon', 'Fenrir'].includes(e.target.value);
              showToast(
                'ĐÃ ĐỔI GIỌNG AI',
                isEn ? `Đã chọn giọng Anh Mỹ bản ngữ (${e.target.value.replace('_EN', '')})` : `Đã chọn giọng tiếng Việt (${e.target.value.replace('_VI', '')})`,
                '✨'
              );
            }}
            title="Chọn giọng đọc AI Studio"
            className="text-xs font-bold px-2.5 py-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer max-w-[210px] truncate"
          >
            <optgroup label="🇻🇳 Tiếng Việt (Miền Bắc)">
              <option value="Leda">Leda - Nữ Bắc Bộ ấm áp (Mặc định)</option>
              <option value="Aoede_VI">Aoede - Nữ Bắc Bộ truyền cảm</option>
            </optgroup>
            <optgroup label="🇺🇸 Tiếng Anh Mỹ bản ngữ (US English)">
              <option value="Kore_EN">Kore (US) - Nữ Mỹ ấm áp, truyền cảm</option>
              <option value="Puck">Puck (US) - Nam Mỹ năng động, tươi vui</option>
              <option value="Zephyr_EN">Zephyr (US) - Nữ Mỹ tươi sáng, rõ ràng</option>
              <option value="Charon">Charon (US) - Nam Mỹ trầm ấm, điềm đạm</option>
              <option value="Fenrir">Fenrir (US) - Nam Mỹ dõng dạc, mạnh mẽ</option>
            </optgroup>
          </select>

          {/* Report Modal Button */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            title="Xem bảng điểm thi đua 100đ và xuất kết quả cho lớp"
            className="p-2.5 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
          >
            <FileText className="w-4 h-4 text-indigo-700" />
            <span className="hidden sm:inline">Bảng Điểm</span>
          </button>

          {/* Audio Mute/Unmute */}
          <button
            onClick={() => {
              const nextVal = !isVoiceEnabled;
              setIsVoiceEnabled(nextVal);
              if (!nextVal) {
                stopCurrentAudio();
                showToast('ÂM THANH', 'Đã tắt giọng đọc dẫn truyện', '🔇');
              } else {
                showToast('ÂM THANH', 'Đã bật giọng đọc Leda AI', '✨');
              }
            }}
            title={isVoiceEnabled ? 'Tắt giọng đọc' : 'Bật giọng đọc'}
            className={`p-2.5 rounded-xl transition cursor-pointer ${
              isVoiceEnabled ? 'bg-purple-100 hover:bg-purple-200 text-purple-700' : 'bg-slate-200 text-slate-500'
            }`}
          >
            {isVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Stop / Replay Narration */}
          {isSpeaking ? (
            <button
              onClick={stopCurrentAudio}
              title="Dừng âm thanh đang phát"
              className="p-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 transition cursor-pointer flex items-center gap-1 font-bold text-xs"
            >
              <Square className="w-4 h-4 fill-rose-600 text-rose-600" />
              <span>Dừng</span>
            </button>
          ) : (
            <button
              onClick={() => speakNarrative(narrativeText)}
              title="Nghe lại lời dẫn bằng giọng AI"
              className="p-2.5 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-700 transition cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}

          {/* Teacher Admin Modal Button */}
          <button
            onClick={() => setIsTeacherModalOpen(true)}
            title="Bảng điều khiển của Giáo viên"
            className="p-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">GV</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title="Toàn màn hình trình chiếu"
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* 4 TEAMS / 4 TỔ SCOREBOARD (100 POINTS SCALE) */}
      <section className="w-full max-w-7xl px-2 mb-2">
        {/* Class Competition Header Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white/95 backdrop-blur-sm p-3 rounded-2xl border-2 border-pink-200/90 shadow-sm mb-2.5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center text-lg font-black shadow-sm">
                🏫
              </span>
              <div>
                <div className="font-black text-sm text-slate-800 flex items-center gap-2">
                  <span className="text-purple-800 font-extrabold">{classInfo.className}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-700">{classInfo.schoolName}</span>
                </div>
                <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                  <span>GV: <strong className="text-slate-800">{classInfo.teacherName}</strong></span>
                  <span>•</span>
                  <span>Môn: <strong className="text-slate-800">Ngữ Văn 6</strong></span>
                </div>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

            <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-xl">
              <Award className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-extrabold text-amber-900">Thi đua chuẩn: </span>
                <span className="font-black text-rose-600 font-mono">100 điểm</span>
                <span className="text-slate-500 text-[11px] font-semibold"> (5 Vòng x 20đ/vòng)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAssignmentModalOpen(true)}
              className="btn-3d px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Phân công nhiệm vụ cụ thể cho từng tổ và cả lớp"
            >
              <Users className="w-3.5 h-3.5" />
              <span>📋 Giao bài cho 4 Tổ</span>
            </button>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="btn-3d px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-extrabold text-xs flex items-center gap-1.5 border border-indigo-200 shadow-sm cursor-pointer"
              title="Xem bảng xếp hạng thi đua 100 điểm và in kết quả"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-700" />
              <span>📊 Bảng điểm 100đ</span>
            </button>
            <button
              onClick={() => {
                setStudentSubmitForm({
                  hoVaTen: teams[activeTeamIdx].leader || 'Học sinh',
                  to: teams[activeTeamIdx].groupName,
                  lop: classInfo.className,
                  diem: teams[activeTeamIdx].score,
                });
                setIsSheetModalOpen(true);
              }}
              className="btn-3d px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Lưu kết quả học sinh vào Google Sheets bảng Mật mã"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>📤 Nộp Google Sheets</span>
            </button>
            <button
              onClick={() => setIsTeacherModalOpen(true)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
              title="Cài đặt giáo viên"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GV</span>
            </button>
          </div>
        </div>

        {/* 4 Teams Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {teams.map((team, idx) => {
            const isActive = idx === activeTeamIdx;
            const percentage = Math.min(100, Math.max(0, (team.score / 100) * 100));
            return (
              <div
                key={idx}
                className={`p-3 rounded-2xl bg-white/95 border-2 shadow-sm flex flex-col justify-between transition-all duration-300 ${
                  isActive
                    ? 'ring-4 ring-pink-400 scale-102 bg-pink-50/70 border-rose-300 shadow-md'
                    : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{team.icon}</span>
                      <div>
                        <div className="font-extrabold text-xs text-slate-800 flex items-center gap-1">
                          <span className="text-purple-700 font-black">{team.groupName}:</span>
                          <span>{team.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold truncate max-w-[120px]">
                          Tổ trưởng: <span className="font-bold text-slate-700">{team.leader}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base md:text-lg font-black text-rose-600 font-mono">
                        {team.score}<span className="text-xs text-slate-400 font-semibold">/100đ</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold">
                        {isActive ? '🔥 Lượt chơi' : 'Chờ lượt'}
                      </div>
                    </div>
                  </div>

                  {/* Team Task Note preview */}
                  {team.taskNote && (
                    <div
                      onClick={() => setIsAssignmentModalOpen(true)}
                      className="mt-2 px-2 py-1 bg-purple-50/90 hover:bg-purple-100 rounded-lg text-[10px] text-purple-900 font-semibold truncate border border-purple-100 cursor-pointer transition"
                      title={`Nhiệm vụ: ${team.taskNote} (Bấm để xem/sửa)`}
                    >
                      📌 {team.taskNote}
                    </div>
                  )}
                </div>

                {/* Progress bar towards 100 points */}
                <div className="mt-2.5">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-1">
                    <span>Tiến độ thi đua:</span>
                    <span className="font-mono text-purple-700">{team.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                    <div
                      className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MAIN ARENA STORYBOOK CARD */}
      <main className="w-full max-w-7xl px-2 flex-1 flex flex-col justify-center items-center py-1 relative">
        <div className={`w-full aspect-[16/9] min-h-[520px] max-h-[760px] storybook-card relative overflow-hidden flex flex-col justify-between p-4 md:p-7 bg-gradient-to-br ${sceneInfo.bg}`}>
          {/* Animated decorative scene SVG */}
          <div className="absolute inset-0 pointer-events-none opacity-30 flex items-center justify-center">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
              <circle cx="150" cy="120" r="140" fill="#f472b6" opacity="0.3" />
              <circle cx="680" cy="380" r="180" fill="#c084fc" opacity="0.25" />
            </svg>
          </div>

          {/* Character Stage (Floating Avatars) */}
          <div className="absolute bottom-4 right-4 z-10 flex items-end gap-2 pointer-events-none">
            {round === 0 && (
              <div className="flex flex-col items-center floating-anim">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 flex items-center justify-center text-4xl shadow-xl border-4 border-white">
                  🧚‍♀️
                </div>
                <span className="text-xs font-black bg-purple-700 text-white px-2 py-0.5 rounded-full mt-1">
                  Cô Tiên Thời Gian
                </span>
              </div>
            )}
            {(round === 1 || round === 2) && (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-300 to-rose-300 flex items-center justify-center text-4xl shadow-xl border-4 border-white">
                  👧
                </div>
                <span className="text-xs font-black bg-rose-600 text-white px-2 py-0.5 rounded-full mt-1">
                  Bé An (Thử làm Mẹ)
                </span>
              </div>
            )}
            {round >= 3 && (
              <div className="flex items-end gap-1.5 floating-anim">
                <div className="w-14 h-14 rounded-full bg-rose-200 flex items-center justify-center text-2xl shadow border-2 border-white">
                  👩‍🦰
                </div>
                <div className="w-16 h-16 rounded-full bg-amber-200 flex items-center justify-center text-3xl shadow border-2 border-white">
                  👧
                </div>
                <div className="w-14 h-14 rounded-full bg-purple-200 flex items-center justify-center text-2xl shadow border-2 border-white">
                  🧚‍♀️
                </div>
              </div>
            )}
          </div>

          {/* Speech Bubble / Teacher Narration with dedicated Speaker Button */}
          <div className="relative z-20 w-full max-w-3xl mx-auto bg-white/95 rounded-2xl p-4 shadow-lg border border-purple-200 flex items-start gap-3 transition-all">
            <div
              className={`w-12 h-12 flex-shrink-0 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-2xl shadow ${
                isSpeaking ? 'animate-bounce' : ''
              }`}
            >
              {narrativeSpeaker.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-700 uppercase tracking-wider">
                  {narrativeSpeaker.title}:
                </span>
                <div className="flex items-center gap-2">
                  {round >= 1 && round <= 3 && timerLimit > 0 && (
                    <button
                      onClick={() => {
                        if (isTimerRunning) {
                          pauseChallengeTimer();
                        } else {
                          startChallengeTimer(timerRemaining > 0 ? timerRemaining : timerLimit);
                        }
                      }}
                      title={isTimerRunning ? 'Bấm để tạm dừng đếm ngược' : 'Bấm để bắt đầu tính giờ thảo luận'}
                      className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition ${
                        isTimerRunning
                          ? 'text-rose-700 bg-rose-100 border border-rose-300 animate-pulse'
                          : 'text-slate-600 bg-slate-100 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>⏱️ {timerRemaining}s {isTimerRunning ? '(Đang đếm)' : '(Chờ bấm giờ)'}</span>
                    </button>
                  )}
                  {/* Speaker Button to read speech bubble */}
                  <button
                    onClick={() => {
                      if (isSpeaking) {
                        stopCurrentAudio();
                      } else {
                        speakNarrative(narrativeText);
                      }
                    }}
                    title={isSpeaking ? 'Bấm để dừng âm thanh' : 'Bấm để nghe Leda đọc'}
                    className={`p-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm ${
                      isSpeaking
                        ? 'bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-300 animate-pulse'
                        : 'bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-200'
                    }`}
                  >
                    {isSpeaking ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                        <span>Dừng đọc</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-purple-700" />
                        <span>Nghe Leda đọc</span>
                      </>
                    )}
                  </button>
                  <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">{sceneInfo.place}</span>
                </div>
              </div>
              <p className="text-slate-800 text-xs md:text-sm font-semibold mt-1 leading-relaxed">
                {narrativeText}
              </p>
            </div>
          </div>

          {/* DYNAMIC CONTENT VIEWPORT */}
          <div className="relative z-20 flex-1 my-3 flex flex-col justify-center items-center overflow-y-auto px-2">
            {/* STAGE 0: WELCOME & CLASSROOM CONFIGURATION */}
            {round === 0 && (
              <div className="max-w-3xl w-full text-center space-y-3.5 animate-in fade-in zoom-in-95">
                <div className="inline-block p-1.5 px-6 rounded-full badge-shimmer text-white text-xs font-black tracking-widest uppercase shadow-md">
                  🌸 CHÀO MỪNG NGÀY PHỤ NỮ VIỆT NAM 20/10 🌸
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-rose-600 font-display tracking-tight leading-tight">
                  NẾU CON LÀ MẸ TRONG MỘT NGÀY
                </h2>
                <div className="text-xs md:text-sm text-purple-900 font-bold max-w-xl mx-auto">
                  <span className="text-rose-700 font-black">🎯 HỆ THỐNG THI ĐUA 100 ĐIỂM (5 VÒNG x 20 ĐIỂM)</span><br />
                  <span className="text-slate-600 font-normal">
                    Áp dụng SGK Ngữ văn 6: Biện pháp Ẩn dụ, Điệp từ, Đại từ và thực hành chia sẻ công việc nhà yêu thương.
                  </span>
                </div>

                {/* Class & 4 Groups Configuration Box */}
                <div className="bg-white/95 p-4 rounded-2xl border border-pink-200 shadow-sm max-w-2xl mx-auto text-left space-y-3">
                  {/* Classroom metadata */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pb-2 border-b border-slate-100 text-xs">
                    <div>
                      <label className="block font-black text-slate-600 mb-0.5">🏫 Tên Lớp:</label>
                      <input
                        value={classInfo.className}
                        onChange={(e) => setClassInfo({ ...classInfo, className: e.target.value })}
                        className="w-full p-1.5 rounded-lg border border-pink-200 font-bold text-pink-900 bg-pink-50/50"
                        placeholder="VD: Lớp 6A1"
                      />
                    </div>
                    <div>
                      <label className="block font-black text-slate-600 mb-0.5">🏛️ Tên Trường:</label>
                      <input
                        value={classInfo.schoolName}
                        onChange={(e) => setClassInfo({ ...classInfo, schoolName: e.target.value })}
                        className="w-full p-1.5 rounded-lg border border-pink-200 font-bold text-slate-800 bg-slate-50"
                        placeholder="VD: THCS Lê Quý Đôn"
                      />
                    </div>
                    <div>
                      <label className="block font-black text-slate-600 mb-0.5">👩‍🏫 Giáo viên:</label>
                      <input
                        value={classInfo.teacherName}
                        onChange={(e) => setClassInfo({ ...classInfo, teacherName: e.target.value })}
                        className="w-full p-1.5 rounded-lg border border-pink-200 font-bold text-slate-800 bg-slate-50"
                        placeholder="VD: Cô Nguyễn Ly"
                      />
                    </div>
                  </div>

                  {/* 4 Groups / Tổ inputs */}
                  <div>
                    <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Danh sách 4 Tổ thi đua (Thang điểm 100):</span>
                      <span className="text-emerald-700 font-black text-[11px]">Được phép đổi tên tổ & tổ trưởng</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {teams.map((t, idx) => (
                        <div key={idx} className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5 font-bold">
                            <span className="text-base">{t.icon}</span>
                            <input
                              value={t.groupName}
                              onChange={(e) => {
                                const newGroupName = e.target.value;
                                setTeams((prev) => {
                                  const c = [...prev];
                                  c[idx] = { ...c[idx], groupName: newGroupName };
                                  return c;
                                });
                              }}
                              className="w-14 p-1 rounded bg-white border border-slate-200 font-black text-purple-800"
                              title="Tên tổ"
                            />
                            <input
                              value={t.name}
                              onChange={(e) => {
                                const newName = e.target.value;
                                setTeams((prev) => {
                                  const c = [...prev];
                                  c[idx] = { ...c[idx], name: newName };
                                  return c;
                                });
                              }}
                              className="flex-1 p-1 rounded bg-white border border-slate-200 font-black text-slate-800"
                              title="Tên đội"
                            />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">Tổ trưởng:</span>
                            <input
                              value={t.leader}
                              onChange={(e) => {
                                const newLeader = e.target.value;
                                setTeams((prev) => {
                                  const c = [...prev];
                                  c[idx] = { ...c[idx], leader: newLeader };
                                  return c;
                                });
                              }}
                              className="flex-1 p-1 rounded bg-white border border-slate-200 font-bold text-pink-700 text-xs"
                              placeholder="Họ tên tổ trưởng"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3 pt-1">
                  <button
                    onClick={() => initRound1Task(0)}
                    className="btn-3d px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-extrabold text-base shadow-xl shadow-rose-300 hover:from-rose-600 hover:to-pink-600 flex items-center gap-2 cursor-pointer"
                  >
                    <span>🚀 BẮT ĐẦU THI ĐUA (100 ĐIỂM)</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (isSpeaking) {
                        stopCurrentAudio();
                      } else {
                        speakNarrative(narrativeText);
                      }
                    }}
                    className="btn-3d px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-pink-700 font-extrabold text-sm border-2 border-pink-200 shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <Volume2 className="w-4 h-4 text-pink-600" />
                    <span>{isSpeaking ? '⏹️ Dừng đọc' : '🔊 Nghe Leda đọc lời chào'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 1: MORNING 06:30 */}
            {round === 1 && subStep < 4 && (
              <div className="w-full max-w-3xl bg-white/95 rounded-2xl p-5 shadow-md border-2 border-amber-200 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                    Vòng 1 (20đ) • Nhiệm Vụ {subStep + 1}/4 • Lượt: {teams[activeTeamIdx].groupName} ({teams[activeTeamIdx].name})
                  </span>
                  <span className="text-xs font-bold text-rose-600">Kiến thức Ngữ văn 6: Biện pháp Tu từ</span>
                </div>

                {/* Dedicated Question Speaker & Manual Countdown Timer Bar */}
                <div className="flex flex-col gap-2 bg-amber-50/90 p-3 rounded-2xl border-2 border-amber-200">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {/* Step 1: Speaker Button */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const task = LESSON_BANK.round1[subStep];
                          const qText = `${task.title}. ${task.context}. ${task.quote ? 'Trích dẫn thơ: ' + task.quote : ''}. ${task.question ? task.question : ''}`;
                          if (isSpeaking) {
                            stopCurrentAudio();
                          } else {
                            speakNarrative(qText);
                          }
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 shadow-sm transition cursor-pointer ${
                          isSpeaking
                            ? 'bg-rose-200 hover:bg-rose-300 text-rose-900 animate-pulse'
                            : 'bg-amber-200 hover:bg-amber-300 text-amber-950'
                        }`}
                        title={isSpeaking ? 'Dừng đọc âm thanh' : 'Bước 1: Nghe đọc câu hỏi'}
                      >
                        {isSpeaking ? (
                          <>
                            <Square className="w-3.5 h-3.5 fill-rose-800 text-rose-800" />
                            <span>⏹️ Dừng đọc</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>🔊 Bước 1: Bấm để {getVoiceLabel(selectedVoice)} đọc câu hỏi</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Step 2: Timer Button (Manual trigger only) */}
                    {timerLimit > 0 && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (isTimerRunning) {
                              pauseChallengeTimer();
                            } else {
                              startChallengeTimer(timerRemaining > 0 ? timerRemaining : timerLimit);
                            }
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 shadow-md transition cursor-pointer ${
                            isTimerRunning
                              ? 'bg-rose-100 hover:bg-rose-200 text-rose-800 border-2 border-rose-300 animate-pulse'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                          title={isTimerRunning ? 'Bấm để tạm dừng đếm ngược' : 'Bước 2: Bấm để bắt đầu tính giờ thảo luận sau khi đọc xong'}
                        >
                          {isTimerRunning ? (
                            <>
                              <Pause className="w-3.5 h-3.5 fill-rose-700 text-rose-700" />
                              <span>⏸️ Tạm dừng giờ (⏱️ {timerRemaining}s)</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-white text-white" />
                              <span>
                                {timerRemaining === timerLimit
                                  ? `▶️ Bước 2: Bắt đầu tính giờ (${timerLimit}s)`
                                  : `▶️ Tiếp tục tính giờ (${timerRemaining}s)`}
                              </span>
                            </>
                          )}
                        </button>
                        {timerRemaining < timerLimit && (
                          <button
                            onClick={() => resetChallengeTimer(timerLimit)}
                            title="Đặt lại đồng hồ về ban đầu"
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Teacher Guidance Hint */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-900/80 px-1 pt-1 border-t border-amber-200/60">
                    <span className="flex items-center gap-1">
                      <span>💡</span>
                      <span>{isTimerRunning ? '⏳ Đang đếm ngược thời gian thảo luận...' : 'Đồng hồ KHÔNG tự chạy. Thầy/cô bấm nút xanh khi đọc xong câu hỏi để học sinh thảo luận.'}</span>
                    </span>
                    <span className="text-amber-800 font-mono font-black">
                      {isTimerRunning ? `⏱️ Còn ${timerRemaining}s` : `⏱️ Chuẩn bị: ${timerLimit}s`}
                    </span>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-slate-600 font-semibold">{LESSON_BANK.round1[subStep].context}</p>

                {LESSON_BANK.round1[subStep].quote && (
                  <div className="bg-amber-50/80 p-3 rounded-xl border-l-4 border-amber-500 font-serif italic text-amber-950 text-xs md:text-sm leading-relaxed">
                    {LESSON_BANK.round1[subStep].quote}
                  </div>
                )}

                {LESSON_BANK.round1[subStep].question && (
                  <h4 className="font-extrabold text-xs md:text-sm text-slate-800">
                    {LESSON_BANK.round1[subStep].question}
                  </h4>
                )}

                {/* Multiple choice options */}
                {LESSON_BANK.round1[subStep].options && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                    {LESSON_BANK.round1[subStep].options.map((opt, i) => (
                      <button
                        key={i}
                        disabled={r1DisabledOptions}
                        onClick={() => handleR1Answer(i)}
                        className="btn-3d text-left p-3 rounded-xl bg-slate-50 hover:bg-pink-50 border border-slate-200 hover:border-pink-300 font-bold text-xs md:text-sm transition flex items-start gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <span className="text-pink-600 flex-shrink-0 font-mono font-black">
                          {['A', 'B', 'C', 'D'][i]}
                        </span>
                        <span>{opt.text.replace(/^[A-D]\.\s*/, '')}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Order Tasks view */}
                {LESSON_BANK.round1[subStep].tasksOrder && (
                  <div className="space-y-2">
                    {LESSON_BANK.round1[subStep].tasksOrder.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl flex items-center justify-between gap-3 text-xs md:text-sm font-bold text-purple-900"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                            {idx + 1}
                          </span>
                          <span>{item.text}</span>
                        </div>
                        <span className="text-emerald-600 font-black text-xs">✓ Hợp lý</span>
                      </div>
                    ))}
                    <button
                      onClick={handleR1OrderSubmit}
                      className="btn-3d w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black rounded-xl shadow-lg text-xs md:text-sm cursor-pointer mt-2"
                    >
                      XÁC NHẬN THỨ TỰ THÔNG MINH (+20 ĐIỂM)
                    </button>
                  </div>
                )}

                {r1Feedback && (
                  <div
                    className={`p-3 rounded-xl text-xs font-bold border ${
                      r1Feedback.type === 'success'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-rose-50 border-rose-300 text-rose-900'
                    }`}
                  >
                    {r1Feedback.msg}
                  </div>
                )}
              </div>
            )}

            {/* STAGE 1: COMPLETED */}
            {round === 1 && subStep === 4 && (
              <div className="text-center p-6 bg-white/95 rounded-3xl shadow-xl border-2 border-emerald-300 max-w-lg space-y-4 animate-in zoom-in-90">
                <div className="text-5xl floating-anim">💎</div>
                <h3 className="text-xl md:text-2xl font-black text-emerald-700">
                  HOÀN THÀNH VÒNG 1: BUỔI SÁNG TẤT BẬT!
                </h3>
                <p className="text-xs md:text-sm text-slate-700 font-semibold leading-relaxed">
                  Bé An đã cùng 4 tổ vượt qua bữa sáng, thấu hiểu tình mẫu tử qua ẩn dụ "Mặt trời của mẹ" và cảm nhận vẻ đẹp của "Ánh nắng chảy đầy vai". Mảnh ghép số 1 đã mở!
                </p>
                <button
                  onClick={() => initRound2Task(0)}
                  className="btn-3d px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-extrabold rounded-2xl shadow-lg cursor-pointer"
                >
                  TIẾN VÀO BUỔI TRƯA: VÒNG 2 ➡️
                </button>
              </div>
            )}

            {/* STAGE 2: NOON 11:45 */}
            {round === 2 && subStep < 4 && (
              <div className="w-full max-w-3xl bg-white/95 rounded-2xl p-5 shadow-md border-2 border-indigo-200 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
                    Vòng 2 (20đ) • Ghi Chú Trưa {subStep + 1}/4 • Lượt: {teams[activeTeamIdx].groupName} ({teams[activeTeamIdx].name})
                  </span>
                  <span className="text-xs font-bold text-purple-600">Đọc hiểu văn bản: Mây và Sóng (R. Ta-go)</span>
                </div>

                {/* Dedicated Question Speaker & Manual Countdown Timer Bar */}
                <div className="flex flex-col gap-2 bg-indigo-50/90 p-3 rounded-2xl border-2 border-indigo-200">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {/* Step 1: Speaker Button */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const task = LESSON_BANK.round2[subStep];
                          const qText = `${task.title}. ${task.prompt}`;
                          if (isSpeaking) {
                            stopCurrentAudio();
                          } else {
                            speakNarrative(qText);
                          }
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 shadow-sm transition cursor-pointer ${
                          isSpeaking
                            ? 'bg-rose-200 hover:bg-rose-300 text-rose-900 animate-pulse'
                            : 'bg-indigo-200 hover:bg-indigo-300 text-indigo-950'
                        }`}
                        title={isSpeaking ? 'Dừng đọc âm thanh' : 'Bước 1: Nghe đọc ghi chú'}
                      >
                        {isSpeaking ? (
                          <>
                            <Square className="w-3.5 h-3.5 fill-rose-800 text-rose-800" />
                            <span>⏹️ Dừng đọc</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>🔊 Bước 1: Bấm để {getVoiceLabel(selectedVoice)} đọc ghi chú</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Step 2: Timer Button (Manual trigger only) */}
                    {timerLimit > 0 && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (isTimerRunning) {
                              pauseChallengeTimer();
                            } else {
                              startChallengeTimer(timerRemaining > 0 ? timerRemaining : timerLimit);
                            }
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 shadow-md transition cursor-pointer ${
                            isTimerRunning
                              ? 'bg-rose-100 hover:bg-rose-200 text-rose-800 border-2 border-rose-300 animate-pulse'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                          title={isTimerRunning ? 'Bấm để tạm dừng đếm ngược' : 'Bước 2: Bấm để bắt đầu tính giờ thảo luận sau khi đọc xong'}
                        >
                          {isTimerRunning ? (
                            <>
                              <Pause className="w-3.5 h-3.5 fill-rose-700 text-rose-700" />
                              <span>⏸️ Tạm dừng giờ (⏱️ {timerRemaining}s)</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-white text-white" />
                              <span>
                                {timerRemaining === timerLimit
                                  ? `▶️ Bước 2: Bắt đầu tính giờ (${timerLimit}s)`
                                  : `▶️ Tiếp tục tính giờ (${timerRemaining}s)`}
                              </span>
                            </>
                          )}
                        </button>
                        {timerRemaining < timerLimit && (
                          <button
                            onClick={() => resetChallengeTimer(timerLimit)}
                            title="Đặt lại đồng hồ về ban đầu"
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Teacher Guidance Hint */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-indigo-900/80 px-1 pt-1 border-t border-indigo-200/60">
                    <span className="flex items-center gap-1">
                      <span>💡</span>
                      <span>{isTimerRunning ? '⏳ Đang đếm ngược thời gian thảo luận...' : 'Đồng hồ KHÔNG tự chạy. Thầy/cô bấm nút xanh khi đọc xong câu hỏi để học sinh thảo luận.'}</span>
                    </span>
                    <span className="text-indigo-800 font-mono font-black">
                      {isTimerRunning ? `⏱️ Còn ${timerRemaining}s` : `⏱️ Chuẩn bị: ${timerLimit}s`}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200">
                  <h4 className="font-extrabold text-xs md:text-sm text-indigo-950">
                    {LESSON_BANK.round2[subStep].prompt}
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                  {LESSON_BANK.round2[subStep].options.map((opt, i) => (
                    <button
                      key={i}
                      disabled={r2DisabledOptions}
                      onClick={() => handleR2Answer(i)}
                      className="btn-3d text-left p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 font-bold text-xs md:text-sm transition flex items-start gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <span className="text-indigo-600 font-mono font-black">{['A', 'B', 'C', 'D'][i]}</span>
                      <span>{opt.text.replace(/^[A-D]\.\s*/, '')}</span>
                    </button>
                  ))}
                </div>

                {r2Feedback && (
                  <div
                    className={`p-3 rounded-xl text-xs font-bold border ${
                      r2Feedback.type === 'success'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-rose-50 border-rose-300 text-rose-900'
                    }`}
                  >
                    {r2Feedback.msg}
                  </div>
                )}
              </div>
            )}

            {/* STAGE 2: COMPLETED */}
            {round === 2 && subStep === 4 && (
              <div className="text-center p-6 bg-white/95 rounded-3xl shadow-xl border-2 border-indigo-300 max-w-lg space-y-4 animate-in zoom-in-90">
                <div className="text-5xl floating-anim">💎</div>
                <h3 className="text-xl md:text-2xl font-black text-indigo-700">
                  HOÀN THÀNH VÒNG 2: BẢNG GHI NHỚ BUỔI TRƯA!
                </h3>
                <p className="text-xs md:text-sm text-slate-700 font-semibold leading-relaxed">
                  Cả 4 tổ đã xuất sắc giải mã các câu hỏi Ngữ văn 6 về ẩn dụ, điệp từ, dấu ngoặc kép và đại từ nhân xưng trong "Mây và sóng"! Mảnh ghép thứ 2 đã thu thập.
                </p>
                <button
                  onClick={() => initRound3Task(0)}
                  className="btn-3d px-8 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-extrabold rounded-2xl shadow-lg cursor-pointer"
                >
                  TIẾN VÀO BUỔI CHIỀU: VÒNG 3 (QUAN TRỌNG NHẤT) ➡️
                </button>
              </div>
            )}

            {/* STAGE 3: AFTERNOON 17:15 */}
            {round === 3 && subStep < 4 && (
              <div className="w-full max-w-3xl bg-white/95 rounded-2xl p-5 shadow-md border-2 border-rose-300 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-rose-100 text-rose-800">
                    Vòng 3 (20đ) • Tình Huống {subStep + 1}/4 • Lượt: {teams[activeTeamIdx].groupName} ({teams[activeTeamIdx].name})
                  </span>
                  <span className="text-xs font-bold text-amber-600">Thấu hiểu & Giải quyết vấn đề</span>
                </div>

                {/* Dedicated Scenario Speaker & Manual Countdown Timer Bar */}
                <div className="flex flex-col gap-2 bg-rose-50/90 p-3 rounded-2xl border-2 border-rose-200">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {/* Step 1: Speaker Button */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const item = LESSON_BANK.round3_scenarios[subStep];
                          const qText = `${item.situationTitle}. ${item.desc}`;
                          if (isSpeaking) {
                            stopCurrentAudio();
                          } else {
                            speakNarrative(qText);
                          }
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 shadow-sm transition cursor-pointer ${
                          isSpeaking
                            ? 'bg-rose-200 hover:bg-rose-300 text-rose-900 animate-pulse'
                            : 'bg-rose-200 hover:bg-rose-300 text-rose-950'
                        }`}
                        title={isSpeaking ? 'Dừng đọc âm thanh' : 'Bước 1: Nghe đọc tình huống'}
                      >
                        {isSpeaking ? (
                          <>
                            <Square className="w-3.5 h-3.5 fill-rose-800 text-rose-800" />
                            <span>⏹️ Dừng đọc</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>🔊 Bước 1: Bấm để {getVoiceLabel(selectedVoice)} đọc tình huống</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Step 2: Timer Button (Manual trigger only) */}
                    {timerLimit > 0 && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (isTimerRunning) {
                              pauseChallengeTimer();
                            } else {
                              startChallengeTimer(timerRemaining > 0 ? timerRemaining : timerLimit);
                            }
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 shadow-md transition cursor-pointer ${
                            isTimerRunning
                              ? 'bg-rose-100 hover:bg-rose-200 text-rose-800 border-2 border-rose-300 animate-pulse'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                          title={isTimerRunning ? 'Bấm để tạm dừng đếm ngược' : 'Bước 2: Bấm để bắt đầu tính giờ thảo luận sau khi đọc xong'}
                        >
                          {isTimerRunning ? (
                            <>
                              <Pause className="w-3.5 h-3.5 fill-rose-700 text-rose-700" />
                              <span>⏸️ Tạm dừng giờ (⏱️ {timerRemaining}s)</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-white text-white" />
                              <span>
                                {timerRemaining === timerLimit
                                  ? `▶️ Bước 2: Bắt đầu tính giờ (${timerLimit}s)`
                                  : `▶️ Tiếp tục tính giờ (${timerRemaining}s)`}
                              </span>
                            </>
                          )}
                        </button>
                        {timerRemaining < timerLimit && (
                          <button
                            onClick={() => resetChallengeTimer(timerLimit)}
                            title="Đặt lại đồng hồ về ban đầu"
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Teacher Guidance Hint */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-rose-900/80 px-1 pt-1 border-t border-rose-200/60">
                    <span className="flex items-center gap-1">
                      <span>💡</span>
                      <span>{isTimerRunning ? '⏳ Đang đếm ngược thời gian thảo luận...' : 'Đồng hồ KHÔNG tự chạy. Thầy/cô bấm nút xanh khi đọc xong câu hỏi để học sinh thảo luận.'}</span>
                    </span>
                    <span className="text-rose-800 font-mono font-black">
                      {isTimerRunning ? `⏱️ Còn ${timerRemaining}s` : `⏱️ Chuẩn bị: ${timerLimit}s`}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200">
                  <h4 className="font-black text-sm md:text-base text-rose-950 mb-1">
                    {LESSON_BANK.round3_scenarios[subStep].situationTitle}
                  </h4>
                  <p className="text-xs md:text-sm text-slate-700 whitespace-pre-line leading-relaxed font-semibold">
                    {LESSON_BANK.round3_scenarios[subStep].desc}
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  {LESSON_BANK.round3_scenarios[subStep].choices.map((choice, i) => (
                    <button
                      key={i}
                      disabled={r3DisabledOptions}
                      onClick={() => handleR3Choice(i)}
                      className="btn-3d w-full text-left p-3.5 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 font-bold text-xs md:text-sm transition cursor-pointer disabled:opacity-50"
                    >
                      {choice.btn}
                    </button>
                  ))}
                </div>

                {r3Feedback && (
                  <div
                    className={`p-3.5 rounded-xl text-xs font-bold border ${
                      r3Feedback.type === 'success'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-amber-50 border-amber-300 text-amber-900'
                    }`}
                  >
                    {r3Feedback.msg}
                  </div>
                )}
              </div>
            )}

            {/* STAGE 3: COMPLETED */}
            {round === 3 && subStep === 4 && (
              <div className="text-center p-6 bg-white/95 rounded-3xl shadow-xl border-2 border-rose-300 max-w-lg space-y-4 animate-in zoom-in-90">
                <div className="text-5xl floating-anim">💎</div>
                <h3 className="text-xl md:text-2xl font-black text-rose-700">
                  HOÀN THÀNH VÒNG 3: VƯỢT QUA TÌNH HUỐNG BẤT NGỜ!
                </h3>
                <p className="text-xs md:text-sm text-slate-700 font-semibold leading-relaxed">
                  Các con đã học được cách lắng nghe, biết ơn sự hy sinh của mẹ và nhận thức rằng việc nhà là trách nhiệm chung của cả gia đình! Mảnh ghép thứ 3 đã sáng ngời.
                </p>
                <button
                  onClick={initRound4}
                  className="btn-3d px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold rounded-2xl shadow-lg cursor-pointer"
                >
                  TIẾN VÀO BUỔI TỐI: VÒNG 4 ➡️
                </button>
              </div>
            )}

            {/* STAGE 4: EVENING 19:00 */}
            {round === 4 && subStep === 0 && (
              <div className="w-full max-w-4xl bg-white/95 rounded-2xl p-4 md:p-5 shadow-md border-2 border-emerald-200 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    Vòng 4 (20đ): 8 Thẻ Thử Thách Sẻ Chia Gia Đình (Mỗi tổ 2 thẻ x 10đ = 20đ)
                  </span>
                  <button
                    onClick={() => {
                      const txt = '19:00 tối! Gian bếp sáng đèn. Chúng mình có 8 thẻ nhiệm vụ việc nhà và kiến thức Ngữ văn 6, mỗi tổ phụ trách 2 thẻ. Các đội hãy nhấp chọn thẻ phân công cho đội mình nhé!';
                      if (isSpeaking) {
                        stopCurrentAudio();
                      } else {
                        speakNarrative(txt);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition cursor-pointer ${
                      isSpeaking
                        ? 'bg-rose-200 hover:bg-rose-300 text-rose-900 animate-pulse'
                        : 'bg-emerald-200 hover:bg-emerald-300 text-emerald-950'
                    }`}
                  >
                    {isSpeaking ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-rose-800 text-rose-800" />
                        <span>⏹️ Dừng đọc</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>🔊 Nghe hướng dẫn phân công</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  {LESSON_BANK.round4_chores.map((card) => {
                    const isDone = completedChores[card.id];
                    const team = teams[card.team];
                    return (
                      <div
                        key={card.id}
                        onClick={() => handleChoreClick(card)}
                        className={`btn-3d p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between h-32 ${
                          isDone
                            ? 'bg-emerald-100/80 border-emerald-400 text-emerald-900 opacity-90'
                            : 'bg-white hover:bg-emerald-50/60 border-slate-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-black text-slate-400">
                            <span>
                              {card.category === 'Bep' ? '🍳 Bếp' : card.category === 'Nha' ? '🧹 Nhà' : '📖 Ngữ văn'}
                            </span>
                            <span className="text-pink-600 font-bold">
                              {team.icon} {team.groupName}
                            </span>
                          </div>
                          <div className="font-extrabold text-xs md:text-sm text-slate-800 mt-1 line-clamp-2">
                            {card.name}
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold italic truncate">
                          {isDone ? '✨ Đã hoàn thành (+10đ)!' : card.tip}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-bold flex items-center justify-between">
                  <span>
                    Tiến độ hoàn thành: {Object.keys(completedChores).length}/8 thẻ việc nhà & bài tập
                  </span>
                  <span>Mỗi thẻ hoàn thành: +10 điểm thi đua cho tổ phụ trách!</span>
                </div>
              </div>
            )}

            {/* STAGE 4: COMPLETED */}
            {round === 4 && subStep === 1 && (
              <div className="text-center p-6 bg-white/95 rounded-3xl shadow-xl border-2 border-emerald-300 max-w-lg space-y-4 animate-in zoom-in-90">
                <div className="text-5xl floating-anim">💎</div>
                <h3 className="text-xl md:text-2xl font-black text-emerald-700">
                  HOÀN THÀNH VÒNG 4: YÊU THƯƠNG LÀ SẺ CHIA!
                </h3>
                <p className="text-xs md:text-sm text-slate-700 font-semibold leading-relaxed">
                  Cả 4 tổ đã cùng chung tay làm việc nhà và ôn tập nhuần nhuyễn kiến thức SGK Ngữ văn 6! Mảnh ghép thứ 4 đã xuất hiện.
                </p>
                <button
                  onClick={initRound5}
                  className="btn-3d px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold rounded-2xl shadow-lg cursor-pointer"
                >
                  TIẾN VÀO VÒNG 5: TRANG NHẬT KÝ THẤU HIỂU ➡️
                </button>
              </div>
            )}

            {/* STAGE 5: DIARY & GREETING CARD */}
            {round === 5 && subStep === 0 && (
              <div className="w-full max-w-4xl bg-white/95 rounded-2xl p-4 md:p-6 shadow-md border-2 border-pink-300 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-pink-100 text-pink-800">
                    Vòng 5 (20đ): Viết Nhật Ký & Sáng Tạo Thiệp Tri Ân 20/10 ({classInfo.className})
                  </span>
                  <button
                    onClick={() => {
                      const txt = '20:30 tối! An ngồi vào bàn viết nhật ký. Các con hãy cùng viết vài dòng tri ân và tạo một tấm thiệp 20/10 thật đẹp để gửi tặng mẹ, bà, hoặc cô giáo nhé! Hoàn thành thiệp sẽ mang về 20 điểm thi đua trọn vẹn.';
                      if (isSpeaking) {
                        stopCurrentAudio();
                      } else {
                        speakNarrative(txt);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition cursor-pointer ${
                      isSpeaking
                        ? 'bg-rose-200 hover:bg-rose-300 text-rose-900 animate-pulse'
                        : 'bg-pink-200 hover:bg-pink-300 text-pink-950'
                    }`}
                  >
                    {isSpeaking ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-rose-800 text-rose-800" />
                        <span>⏹️ Dừng đọc</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>🔊 Nghe hướng dẫn viết thiệp</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Controls */}
                  <div className="space-y-2.5 text-xs font-bold text-left">
                    <div>
                      <label className="block text-slate-700 mb-1">Người con muốn gửi gắm yêu thương:</label>
                      <select
                        value={cardRecipient}
                        onChange={(e) => setCardRecipient(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-pink-200 bg-pink-50/50 font-bold text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
                      >
                        <option value="Mẹ kính yêu">Mẹ kính yêu</option>
                        <option value="Bà kính yêu">Bà kính yêu</option>
                        <option value="Cô giáo kính mến">Cô giáo kính mến</option>
                        <option value="Người chăm sóc thân thương">Người chăm sóc thân thương</option>
                        <option value="Chị gái thân thương">Chị gái thân thương</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Lời nhắn từ trái tim (2-4 câu):</label>
                      <textarea
                        rows={3}
                        value={cardMessage}
                        onChange={(e) => setCardMessage(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-pink-200 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        placeholder="Con chúc Mẹ/Bà/Cô luôn vui vẻ, hạnh phúc..."
                      />
                      <div className="flex gap-1.5 mt-1">
                        <button
                          onClick={() =>
                            setCardMessage(
                              'Nhân ngày 20/10, con chúc mẹ luôn mạnh khỏe, nở nụ cười tươi trên môi. Hôm nay trải nghiệm làm mẹ, con mới hiểu mẹ đã vất vả thế nào. Con hứa sẽ luôn chăm chỉ và sẻ chia việc nhà cùng mẹ mỗi ngày!'
                            )
                          }
                          className="px-2 py-1 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-lg text-[10px] cursor-pointer"
                        >
                          Mẫu 1
                        </button>
                        <button
                          onClick={() =>
                            setCardMessage(
                              'Mẹ là bến bờ kỳ lạ đón nhận con như con sóng nhỏ lăn mãi vào lòng. Con cảm ơn mẹ vì tình yêu thương bao la sưởi ấm cuộc đời con!'
                            )
                          }
                          className="px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-[10px] cursor-pointer"
                        >
                          Mẫu 2 (Thơ Mây và sóng)
                        </button>
                        <button
                          onClick={() =>
                            setCardMessage(
                              'Kính chúc cô giáo ngày 20/10 ngập tràn niềm vui và hạnh phúc! Cảm ơn cô đã dạy dỗ chúng con những bài học văn học và tình cảm gia đình ấm áp!'
                            )
                          }
                          className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-[10px] cursor-pointer"
                        >
                          Mẫu 3 (Tri ân cô)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Tên người gửi (Con/Học sinh/Tổ):</label>
                      <input
                        value={cardSender}
                        onChange={(e) => setCardSender(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-pink-200 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Tông màu chủ đạo của thiệp:</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setCardBg('#FFF0F5');
                            setCardColor('#F43F5E');
                          }}
                          className="w-7 h-7 rounded-full bg-pink-200 border-2 border-pink-500 cursor-pointer"
                        />
                        <button
                          onClick={() => {
                            setCardBg('#F3E8FF');
                            setCardColor('#9333EA');
                          }}
                          className="w-7 h-7 rounded-full bg-purple-200 border-2 border-purple-500 cursor-pointer"
                        />
                        <button
                          onClick={() => {
                            setCardBg('#FEF3C7');
                            setCardColor('#D97706');
                          }}
                          className="w-7 h-7 rounded-full bg-amber-200 border-2 border-amber-500 cursor-pointer"
                        />
                        <button
                          onClick={() => {
                            setCardBg('#E0F2FE');
                            setCardColor('#0284C7');
                          }}
                          className="w-7 h-7 rounded-full bg-sky-200 border-2 border-sky-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Preview */}
                  <div className="flex flex-col items-center justify-between">
                    <div
                      className="w-full aspect-[16/10] rounded-2xl shadow-lg border-2 border-pink-300 p-4 flex flex-col justify-between text-center relative overflow-hidden transition-all"
                      style={{ background: cardBg, color: cardColor }}
                    >
                      <div className="text-[10px] font-black uppercase tracking-widest">
                        🌸 CHÚC MỪNG NGÀY PHỤ NỮ VIỆT NAM 20/10 🌸
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-display font-extrabold text-base md:text-lg">Kính gửi {cardRecipient}!</h4>
                        <p className="text-xs font-semibold leading-relaxed px-2 text-slate-700 italic">
                          "{cardMessage || 'Chúc mừng ngày 20/10!'}"
                        </p>
                      </div>
                      <div className="text-[11px] font-bold text-right text-purple-900">
                        Yêu thương: {cardSender} ({classInfo.className})
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3 w-full">
                      <button
                        onClick={handleDownloadCard}
                        className="btn-3d flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>TẢI THIỆP PNG</span>
                      </button>
                      <button
                        onClick={handleFinishCard}
                        className="btn-3d flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer"
                      >
                        <span>💎 NHẬN +20Đ (MẢNH THỨ 5)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 5: ALL 5 SHARDS GATHERED */}
            {round === 5 && subStep === 1 && (
              <div className="text-center p-6 bg-white/95 rounded-3xl shadow-2xl border-4 border-rose-400 max-w-lg space-y-4 animate-in zoom-in-95">
                <div className="text-6xl floating-anim">💖</div>
                <h3 className="text-xl md:text-3xl font-black text-rose-600 font-display">
                  ĐÃ THU THẬP ĐỦ 5 MẢNH GHÉP!
                </h3>
                <p className="text-xs md:text-sm text-slate-700 font-semibold leading-relaxed">
                  Chiếc Đồng Hồ Thời Gian Phép Thuật đang rung lên những ánh hào quang kỳ diệu. Cả lớp {classInfo.className} hãy cùng đếm ngược để đón chào khoảnh khắc tổng kết thi đua nhé!
                </p>
                <button
                  onClick={startGrandFinale}
                  className="btn-3d px-8 py-3.5 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white font-black text-base rounded-2xl shadow-xl pulse-glow-rose cursor-pointer"
                >
                  ✨ HOÀN THÀNH MỘT NGÀY YÊU THƯƠNG ✨
                </button>
              </div>
            )}

            {/* STAGE 6: FINALE COUNTDOWN OR CELEBRATION */}
            {round === 6 && finaleCountdown > 0 && (
              <div className="text-center space-y-4 animate-in zoom-in duration-300">
                <div className="text-xs font-black text-purple-600 uppercase tracking-widest">
                  ĐỒNG HỒ PHÉP THUẬT HỘI TỤ
                </div>
                <div className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-rose-500 to-amber-500 font-mono pulse-glow-rose">
                  {finaleCountdown}
                </div>
                <p className="text-sm font-bold text-slate-600">
                  5 mảnh ghép đang bay lên hợp nhất thành Trái Tim Yêu Thương của {classInfo.className}...
                </p>
              </div>
            )}

            {round === 6 && finaleCountdown === 0 && (
              <div className="w-full max-w-4xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-700">
                <div className="inline-block p-2 px-6 rounded-full badge-shimmer text-white text-xs font-black tracking-widest uppercase shadow-lg">
                  💖 ĐIỀU KỲ DIỆU TỪ TRÁI TIM – {classInfo.className.toUpperCase()} 💖
                </div>

                <h2 className="text-xl md:text-3xl font-black text-rose-600 font-display">
                  NẾU CON LÀ MẸ TRONG MỘT NGÀY – CON HIỂU RẰNG YÊU THƯƠNG CẦN ĐƯỢC SẺ CHIA!
                </h2>

                <p className="text-base md:text-xl font-extrabold text-purple-800">
                  CHÚC MỪNG NGÀY PHỤ NỮ VIỆT NAM 20/10! 🌸
                </p>

                {/* 4 Team Awards & Trophies with /100 score */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-2 text-left">
                  {teams.map((t, idx) => (
                    <div key={idx} className="p-3 bg-white/95 rounded-2xl border-2 border-rose-300 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="text-2xl mb-1">{t.icon}</div>
                        <div className="font-extrabold text-xs text-rose-800">{t.groupName}: {t.name}</div>
                        <div className="text-[10px] text-slate-500">Tổ trưởng: {t.leader}</div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-100">
                        <div className="text-xl font-black text-rose-600 font-mono">{t.score}<span className="text-xs text-slate-400 font-bold">/100đ</span></div>
                        <div className="text-[10px] font-bold text-emerald-700 mt-0.5">
                          {t.score >= 90 ? '🏆 Xuất sắc' : t.score >= 80 ? '🥇 Giỏi' : '🥈 Khá'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="btn-3d px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>📊 Xuất Phiếu Điểm Thi Đua 100đ</span>
                  </button>
                  <button
                    onClick={() => {
                      if (isSpeaking) {
                        stopCurrentAudio();
                      } else {
                        speakNarrative(narrativeText);
                      }
                    }}
                    className={`btn-3d px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 shadow cursor-pointer ${
                      isSpeaking
                        ? 'bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300'
                        : 'bg-purple-100 hover:bg-purple-200 text-purple-800'
                    }`}
                  >
                    {isSpeaking ? (
                      <>
                        <Square className="w-4 h-4 fill-rose-600 text-rose-600" />
                        <span>Dừng đọc</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        <span>Nghe Lời Kết (Leda AI)</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setStudentSubmitForm({
                        hoVaTen: teams[0].leader || 'Cả lớp',
                        to: 'Tổ 1',
                        lop: classInfo.className,
                        diem: 100,
                      });
                      setIsSheetModalOpen(true);
                    }}
                    className="btn-3d px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                    title="Lưu kết quả học tập vào trang tính Mật mã"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>📤 Lưu Vào Google Sheets</span>
                  </button>
                  <button
                    onClick={initRound5}
                    className="btn-3d px-5 py-2.5 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-800 font-extrabold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    <span>💌 Tạo Thêm Thiệp 20/10</span>
                  </button>
                  <button
                    onClick={() => {
                      stopCurrentAudio();
                      setRound(0);
                      setSubStep(0);
                      setShards([false, false, false, false, false]);
                      setCompletedChores({});
                    }}
                    className="btn-3d px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-extrabold text-xs shadow-md cursor-pointer"
                  >
                    🔄 Chơi Lại Từ Đầu
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* FOOTER BAR INSIDE ARENA */}
          <div className="relative z-20 w-full flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-purple-100/80">
            {/* 3 Pedagogical Behavior Metrics */}
            <div className="flex items-center gap-4 text-xs font-bold bg-white/80 px-3.5 py-1.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1 text-purple-700" title="Chỉ số Kiến thức Ngữ Văn đã vận dụng">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Kiến thức:</span>
                <span className="font-black text-purple-900">{metrics.knowledge}</span>
              </div>
              <div className="flex items-center gap-1 text-rose-600" title="Chỉ số Cảm thông & Chia sẻ">
                <Heart className="w-3.5 h-3.5" />
                <span>Sẻ chia:</span>
                <span className="font-black text-rose-800">{metrics.sharing}</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-700" title="Chỉ số Xử lý tình huống">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Giải quyết:</span>
                <span className="font-black text-emerald-800">{metrics.problem}</span>
              </div>
            </div>

            {/* Turn Switcher & Next buttons */}
            <div className="flex items-center gap-2">
              {round > 0 && round < 6 && (
                <button
                  onClick={nextTeamTurn}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Đổi lượt tổ ➡️
                </button>
              )}
              {round > 0 && (
                <button
                  onClick={() => {
                    stopCurrentAudio();
                    setRound(0);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs cursor-pointer"
                >
                  Trang chủ 🏠
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* GOOGLE SHEETS SUBMISSION & APPS SCRIPT SETUP MODAL */}
      {isSheetModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-3 md:p-5 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-5 md:p-7 shadow-2xl border-4 border-emerald-300 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-3 border-b-2 border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-black">
                  📊
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-black text-slate-900 font-display flex items-center gap-2">
                    <span>LƯU KẾT QUẢ VÀO GOOGLE SHEETS</span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono font-bold">
                      Trang tính: Mật mã
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold truncate max-w-md">
                    Google Sheet ID: <span className="font-mono text-purple-700 font-bold">12mRK7ZmxScrJwnBmFa-9gdmKSKtZtSfiIvNug9g3llM</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSheetModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            {/* Columns Schema Banner (Columns A to F) */}
            <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-[11px] font-black text-slate-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Cấu trúc 6 cột lưu trữ từ Cột A đến Cột F:</span>
                <span className="text-emerald-700 font-bold">Tự động tăng STT & tính thời gian</span>
              </div>
              <div className="grid grid-cols-6 gap-1 text-center font-mono text-xs">
                <div className="p-1.5 bg-rose-50 border border-rose-200 rounded-lg">
                  <div className="text-[10px] text-rose-500 font-bold">Cột A</div>
                  <div className="font-black text-rose-900">STT</div>
                </div>
                <div className="p-1.5 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="text-[10px] text-purple-500 font-bold">Cột B</div>
                  <div className="font-black text-purple-900 truncate">Họ và tên</div>
                </div>
                <div className="p-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="text-[10px] text-amber-500 font-bold">Cột C</div>
                  <div className="font-black text-amber-900">Tổ</div>
                </div>
                <div className="p-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-[10px] text-blue-500 font-bold">Cột D</div>
                  <div className="font-black text-blue-900">Lớp</div>
                </div>
                <div className="p-1.5 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <div className="text-[10px] text-indigo-500 font-bold">Cột E</div>
                  <div className="font-black text-indigo-900 text-[11px] truncate">Thời gian</div>
                </div>
                <div className="p-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="text-[10px] text-emerald-500 font-bold">Cột F</div>
                  <div className="font-black text-emerald-900">Điểm</div>
                </div>
              </div>
            </div>

            {/* Mode Switcher: Form vs Code Apps Script */}
            <div className="flex gap-2 mt-4 border-b border-slate-200 pb-2">
              <button
                onClick={() => setShowScriptCode(false)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                  !showScriptCode
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>📝 Form Nộp Điểm Học Sinh</span>
              </button>
              <button
                onClick={() => setShowScriptCode(true)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                  showScriptCode
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>⚙️ Mã Google Apps Script & Hướng Dẫn</span>
              </button>
            </div>

            {/* VIEW 1: FORM NỘP BÀI */}
            {!showScriptCode ? (
              <div className="mt-4 space-y-4">
                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm">
                  <div>
                    <label className="block font-black text-slate-700 mb-1">
                      👤 Họ và tên học sinh (hoặc Tổ trưởng đại diện):
                    </label>
                    <input
                      value={studentSubmitForm.hoVaTen}
                      onChange={(e) => setStudentSubmitForm({ ...studentSubmitForm, hoVaTen: e.target.value })}
                      placeholder="VD: Nguyễn Thu Hà"
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-400"
                    />
                    {/* Quick pick from team leaders */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      <span className="text-[10px] text-slate-400 font-bold self-center">Chọn nhanh:</span>
                      {teams.map((t, idx) => (
                        <button
                          key={idx}
                          onClick={() =>
                            setStudentSubmitForm({
                              ...studentSubmitForm,
                              hoVaTen: t.leader,
                              to: t.groupName,
                              diem: t.score,
                            })
                          }
                          className="px-2 py-0.5 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10px] font-bold border border-purple-200 cursor-pointer"
                        >
                          {t.leader} ({t.groupName})
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-black text-slate-700 mb-1">
                      🚩 Tổ thi đua:
                    </label>
                    <select
                      value={studentSubmitForm.to}
                      onChange={(e) => {
                        const chosenTo = e.target.value;
                        const matchTeam = teams.find((t) => t.groupName === chosenTo);
                        setStudentSubmitForm({
                          ...studentSubmitForm,
                          to: chosenTo,
                          diem: matchTeam ? matchTeam.score : studentSubmitForm.diem,
                        });
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-400"
                    >
                      {teams.map((t, idx) => (
                        <option key={idx} value={t.groupName}>
                          {t.groupName} - {t.name} (Điểm hiện tại: {t.score}đ)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-black text-slate-700 mb-1">
                      🏫 Lớp học:
                    </label>
                    <input
                      value={studentSubmitForm.lop}
                      onChange={(e) => setStudentSubmitForm({ ...studentSubmitForm, lop: e.target.value })}
                      placeholder="VD: Lớp 6A1"
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-slate-700 mb-1">
                      ⭐ Điểm số nộp bài (Thang 100đ):
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={studentSubmitForm.diem}
                      onChange={(e) => setStudentSubmitForm({ ...studentSubmitForm, diem: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-black text-rose-600 font-mono focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </div>

                {/* Google Apps Script Web App URL configuration */}
                <div className="p-3.5 bg-emerald-50/80 rounded-2xl border-2 border-emerald-200 space-y-2 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <label className="font-black text-emerald-950 flex items-center gap-1.5">
                      <span className="text-base">🔗</span>
                      <span>URL Google Apps Script Web App đã kết nối:</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSheetScriptUrl(DEFAULT_SHEET_SCRIPT_URL);
                          localStorage.setItem('applet_sheet_script_url', DEFAULT_SHEET_SCRIPT_URL);
                          showToast('ĐÃ KHÔI PHỤC', 'Đã đặt lại URL Web App mặc định!', '🔄');
                        }}
                        className="text-emerald-700 hover:text-emerald-900 font-bold text-[11px] hover:underline cursor-pointer"
                        title="Khôi phục URL gốc được cung cấp"
                      >
                        Khôi phục URL gốc
                      </button>
                      <button
                        onClick={() => setShowScriptCode(true)}
                        className="text-purple-700 font-bold text-[11px] hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        <span>Xem mã Code.gs</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      value={sheetScriptUrl}
                      onChange={(e) => {
                        setSheetScriptUrl(e.target.value);
                        localStorage.setItem('applet_sheet_script_url', e.target.value.trim());
                        setTestResult(null);
                      }}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="flex-1 p-2 rounded-xl bg-white border border-emerald-300 font-mono text-[11px] text-slate-800 focus:ring-2 focus:ring-emerald-400 select-all"
                    />
                    <button
                      onClick={handleTestSheetConnection}
                      disabled={isTestingSheet}
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-sm cursor-pointer whitespace-nowrap"
                    >
                      {isTestingSheet ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Đang thử...</span>
                        </>
                      ) : (
                        <>
                          <span>⚡ Thử kết nối</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Test Connection Result / Notice */}
                  {testResult && (
                    <div
                      className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                        testResult.ok
                          ? 'bg-emerald-100/90 text-emerald-900 border-emerald-300'
                          : 'bg-amber-100/90 text-amber-950 border-amber-300'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-sm">{testResult.ok ? '✅' : '⚠️'}</span>
                        <div className="flex-1">
                          <div>{testResult.msg}</div>
                          {testResult.isPerm && (
                            <div className="mt-1 text-[11px] text-amber-900 font-normal leading-relaxed">
                              👉 <strong>Cách xử lý trong 30 giây:</strong> Mở Google Apps Script ➔ Bấm nút{' '}
                              <strong>Triển khai (Deploy)</strong> màu xanh ➔ Chọn <strong>Quản lý bản triển khai (Manage deployments)</strong> ➔ Bấm icon cây bút <strong>Chỉnh sửa</strong> ➔ Tại dòng{' '}
                              <strong>Ai có quyền truy cập (Who has access)</strong>, chọn <strong>Bất kỳ ai (Anyone)</strong> ➔ Bấm <strong>Triển khai</strong>.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-[10px] text-slate-500 font-medium">
                    * URL của bạn đã được kết nối tự động. Khi học sinh nộp bài, điểm số sẽ được ghi thẳng vào bảng tính <strong>Mật mã</strong>.
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-slate-100">
                  <div className="text-xs text-slate-500 font-semibold">
                    Thời gian nộp: <strong className="text-slate-800">{new Date().toLocaleTimeString('vi-VN')} {new Date().toLocaleDateString('vi-VN')}</strong>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsSheetModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      disabled={isSubmittingSheet}
                      onClick={handleSubmitToGoogleSheet}
                      className="btn-3d px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isSubmittingSheet ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Đang ghi vào Sheets...</span>
                        </>
                      ) : (
                        <>
                          <span>🚀 GỬI KẾT QUẢ VÀO GOOGLE SHEETS</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* VIEW 2: MÃ GOOGLE APPS SCRIPT & HƯỚNG DẪN */
              <div className="mt-4 space-y-3 animate-in fade-in">
                {/* 3 Step Tutorial */}
                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 space-y-2 text-xs">
                  <div className="font-black text-purple-900 flex items-center gap-1.5">
                    <span>💡</span>
                    <span>3 BƯỚC ĐỂ BẬT TỰ ĐỘNG LƯU VÀO GOOGLE SHEETS:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-700 font-semibold leading-relaxed">
                    <li>
                      Mở Google Sheets có ID: <code className="bg-white px-1.5 py-0.5 rounded border font-mono text-purple-800 font-bold">12mRK7ZmxScrJwnBmFa-9gdmKSKtZtSfiIvNug9g3llM</code>
                    </li>
                    <li>
                      Trên thanh menu, chọn <strong>Tiện ích mở rộng (Extensions)</strong> ➔ <strong>Apps Script</strong>.
                    </li>
                    <li>
                      Xóa toàn bộ mã cũ trong file <code className="bg-white px-1 py-0.5 rounded font-mono">Code.gs</code>, dán toàn bộ đoạn mã bên dưới vào, rồi bấm nút <strong>Lưu (💾)</strong>.
                    </li>
                    <li>
                      Bấm nút <strong>Triển khai (Deploy)</strong> màu xanh góc phải ➔ <strong>Tùy chọn triển khai mới (New deployment)</strong> ➔ Chọn loại <strong>Ứng dụng web (Web app)</strong>.
                      <div className="text-[11px] text-rose-700 font-bold pl-5 mt-0.5">
                        * Quan trọng: Mục "Ai có quyền truy cập" (Who has access) chọn <strong>"Bất kỳ ai" (Anyone)</strong>.
                      </div>
                    </li>
                    <li>
                      Sao chép <strong>URL ứng dụng web</strong> nhận được và dán vào ô URL trong tab "Form Nộp Điểm".
                    </li>
                  </ol>
                </div>

                {/* Code block with copy button */}
                <div className="relative">
                  <div className="flex justify-between items-center bg-slate-800 text-slate-300 px-3 py-1.5 rounded-t-xl text-xs font-mono">
                    <span>Code.gs (Google Apps Script)</span>
                    <button
                      onClick={copyScriptCodeToClipboard}
                      className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition"
                    >
                      {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedScript ? 'Đã sao chép!' : 'Sao chép toàn bộ mã'}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-b-xl overflow-x-auto max-h-60 leading-relaxed border border-slate-800">
                    {GOOGLE_APPS_SCRIPT_SAMPLE}
                  </pre>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowScriptCode(false)}
                    className="btn-3d px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs cursor-pointer shadow"
                  >
                    ⬅️ Quay Lại Form Nộp Bài
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ASSIGNMENT & TEAM MANAGEMENT MODAL (100 POINTS COMPETITION) */}
      {isAssignmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-5 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-5 md:p-7 shadow-2xl border-4 border-purple-200 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-3 border-b-2 border-purple-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl font-black">
                  📋
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-black text-purple-950 font-display">
                    GIAO BÀI TẬP & PHÂN CÔNG 4 TỔ THI ĐUA (THANG 100 ĐIỂM)
                  </h3>
                  <p className="text-xs text-rose-600 font-bold">
                    Chào mừng 20/10: "Nếu Con Là Mẹ Trong Một Ngày" • Môn Ngữ Văn 6
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAssignmentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs md:text-sm">
              {/* Class & Teacher Information Box */}
              <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-2">
                <div className="font-black text-purple-900 flex items-center gap-1.5 text-xs">
                  <GraduationCap className="w-4 h-4 text-purple-700" />
                  <span>Thông tin Lớp học & Giáo viên phụ trách:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">🏫 Tên Lớp:</label>
                    <input
                      value={classInfo.className}
                      onChange={(e) => setClassInfo({ ...classInfo, className: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-purple-200 font-bold text-purple-950 text-xs focus:ring-2 focus:ring-purple-400"
                      placeholder="VD: Lớp 6A1"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">🏛️ Tên Trường:</label>
                    <input
                      value={classInfo.schoolName}
                      onChange={(e) => setClassInfo({ ...classInfo, schoolName: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-purple-200 font-bold text-slate-800 text-xs focus:ring-2 focus:ring-purple-400"
                      placeholder="VD: THCS Lê Quý Đôn"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">👩‍🏫 Giáo viên:</label>
                    <input
                      value={classInfo.teacherName}
                      onChange={(e) => setClassInfo({ ...classInfo, teacherName: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-purple-200 font-bold text-slate-800 text-xs focus:ring-2 focus:ring-purple-400"
                      placeholder="VD: Cô Nguyễn Ly"
                    />
                  </div>
                </div>
              </div>

              {/* General Classroom Assignment */}
              <div className="p-3 bg-pink-50/70 rounded-2xl border border-pink-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-black text-rose-900 text-xs flex items-center gap-1.5">
                    <span>📌</span>
                    <span>Nhiệm vụ chung giao bài tập cho cả lớp:</span>
                  </label>
                  <span className="text-[11px] text-slate-500 font-bold">Gợi ý nhanh bên dưới</span>
                </div>
                <textarea
                  rows={2}
                  value={classInfo.assignmentNote}
                  onChange={(e) => setClassInfo({ ...classInfo, assignmentNote: e.target.value })}
                  className="w-full p-2 rounded-xl bg-white border border-pink-200 font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-pink-400"
                  placeholder="Nhập nội dung bài tập chung cho cả lớp..."
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-500 self-center">Chọn nhanh:</span>
                  {[
                    'Viết đoạn văn ngắn 5-7 câu cảm nhận sau 1 ngày trải nghiệm làm mẹ',
                    'Thực hành 3 việc nhà chia sẻ cùng mẹ và viết vào nhật ký yêu thương',
                    'Học thuộc lòng bài thơ "Mây và sóng" và tìm các biện pháp ẩn dụ',
                  ].map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => setClassInfo({ ...classInfo, assignmentNote: preset })}
                      className="px-2 py-0.5 rounded-lg bg-white hover:bg-pink-100 text-pink-800 border border-pink-200 text-[10px] font-bold transition cursor-pointer"
                    >
                      + {preset.substring(0, 32)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* 4 Groups / Teams Assignments & 100 Points Scale */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-black text-slate-800 text-xs flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple-700" />
                    <span>Phân công nhiệm vụ cụ thể cho 4 Tổ thi đua (Thang điểm 100đ):</span>
                  </div>
                  <span className="text-rose-600 font-extrabold text-[11px]">5 Vòng x 20đ = 100đ tối đa</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {teams.map((t, idx) => {
                    const presetTasks = [
                      'Nhiệm vụ: Thuyết trình ẩn dụ "Mặt trời của mẹ" & Nhặt rau giúp mẹ',
                      'Nhiệm vụ: Phân tích nghệ thuật "Ánh nắng chảy" & Quét dọn nhà cửa',
                      'Nhiệm vụ: Đọc diễn cảm "Mây và sóng" & Gấp quần áo ngăn nắp',
                      'Nhiệm vụ: Phân tích điệp từ tình mẫu tử & Rửa bát đĩa phụ mẹ',
                    ];
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-slate-50 border-2 border-slate-200 hover:border-purple-300 transition flex flex-col justify-between gap-2 shadow-sm"
                      >
                        <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xl">{t.icon}</span>
                            <span className="font-black text-xs text-purple-900">{t.groupName}:</span>
                            <input
                              value={t.name}
                              onChange={(e) => {
                                const newName = e.target.value;
                                setTeams((prev) => {
                                  const c = [...prev];
                                  c[idx] = { ...c[idx], name: newName };
                                  return c;
                                });
                              }}
                              className="p-1 rounded-lg bg-white border border-slate-200 font-black text-slate-800 text-xs w-28"
                              title="Đổi tên đội"
                            />
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-black text-rose-600 text-sm">{t.score}</span>
                            <span className="text-slate-400 font-bold text-xs">/100đ</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-slate-500 font-bold whitespace-nowrap">Tổ trưởng:</span>
                          <input
                            value={t.leader}
                            onChange={(e) => {
                              const newLeader = e.target.value;
                              setTeams((prev) => {
                                const c = [...prev];
                                c[idx] = { ...c[idx], leader: newLeader };
                                return c;
                              });
                            }}
                            className="flex-1 p-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-pink-700"
                            placeholder="Họ tên tổ trưởng"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold mb-0.5">
                            <span>Nhiệm vụ riêng của tổ:</span>
                            <button
                              onClick={() => {
                                setTeams((prev) => {
                                  const c = [...prev];
                                  c[idx] = { ...c[idx], taskNote: presetTasks[idx] };
                                  return c;
                                });
                              }}
                              className="text-purple-600 hover:underline cursor-pointer"
                            >
                              Gợi ý chuẩn
                            </button>
                          </div>
                          <input
                            value={t.taskNote || ''}
                            onChange={(e) => {
                              const note = e.target.value;
                              setTeams((prev) => {
                                const c = [...prev];
                                c[idx] = { ...c[idx], taskNote: note };
                                return c;
                              });
                            }}
                            className="w-full p-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800"
                            placeholder="Nhập nhiệm vụ riêng cho tổ..."
                          />
                        </div>

                        {/* Quick scoring controls */}
                        <div className="flex items-center gap-1 pt-1 border-t border-slate-100">
                          <span className="text-[10px] text-slate-400 font-bold">Chấm điểm:</span>
                          <button
                            onClick={() => {
                              addScore(idx, 20, 'knowledge');
                              showToast('CỘNG ĐIỂM', `+20đ cho ${t.groupName}`, '🎉');
                            }}
                            className="flex-1 py-1 rounded-lg bg-pink-100 hover:bg-pink-200 text-pink-900 font-black text-[10px] cursor-pointer"
                          >
                            +20đ
                          </button>
                          <button
                            onClick={() => {
                              addScore(idx, 10, 'sharing');
                              showToast('CỘNG ĐIỂM', `+10đ cho ${t.groupName}`, '💖');
                            }}
                            className="flex-1 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-black text-[10px] cursor-pointer"
                          >
                            +10đ
                          </button>
                          <button
                            onClick={() => {
                              addScore(idx, -5, 'problem');
                              showToast('TRỪ ĐIỂM', `-5đ cho ${t.groupName}`, '⚠️');
                            }}
                            className="py-1 px-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-[10px] cursor-pointer"
                          >
                            -5đ
                          </button>
                          <button
                            onClick={() => {
                              setTeams((prev) => {
                                const c = [...prev];
                                c[idx] = { ...c[idx], score: 100 };
                                return c;
                              });
                              showToast('TỐI ĐA', `${t.groupName} đạt 100 điểm trọn vẹn!`, '⭐');
                            }}
                            className="py-1 px-2 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 font-black text-[10px] cursor-pointer"
                            title="Đặt 100 điểm"
                          >
                            100đ
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 flex flex-wrap justify-between items-center gap-2 border-t-2 border-slate-100">
                <button
                  onClick={copyAssignmentsToClipboard}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs flex items-center gap-1.5 shadow cursor-pointer transition"
                >
                  {copiedAssignment ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedAssignment ? 'Đã sao chép vào bộ nhớ!' : 'Sao chép danh sách giao bài (Gửi Zalo)'}</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsAssignmentModalOpen(false);
                      setIsReportModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-black text-xs flex items-center gap-1.5 border border-indigo-200 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-indigo-700" />
                    <span>Xem Bảng Điểm 100đ</span>
                  </button>
                  <button
                    onClick={() => setIsAssignmentModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer shadow"
                  >
                    Hoàn tất & Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TEACHER ADMIN DRAWER MODAL */}
      {isTeacherModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border-2 border-amber-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base md:text-lg font-black text-amber-800 flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-600" />
                <span>Bảng Điều Khiển Giáo Viên • Quản Lý Lớp & Giao Bài (Thang 100đ)</span>
              </h3>
              <button
                onClick={() => setIsTeacherModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs md:text-sm">
              {/* Class & Teacher Details */}
              <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
                <div className="font-black text-amber-900 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-amber-700" />
                  <span>Thông tin Lớp học & Giáo viên phụ trách:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Tên Lớp:</label>
                    <input
                      value={classInfo.className}
                      onChange={(e) => setClassInfo({ ...classInfo, className: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Tên Trường:</label>
                    <input
                      value={classInfo.schoolName}
                      onChange={(e) => setClassInfo({ ...classInfo, schoolName: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Giáo viên:</label>
                    <input
                      value={classInfo.teacherName}
                      onChange={(e) => setClassInfo({ ...classInfo, teacherName: e.target.value })}
                      className="w-full p-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Nhiệm vụ chung giao bài tập về nhà:</label>
                  <input
                    value={classInfo.assignmentNote}
                    onChange={(e) => setClassInfo({ ...classInfo, assignmentNote: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white border border-slate-200 font-semibold text-slate-800"
                    placeholder="VD: Cả lớp viết bài văn ngắn cảm nhận sau buổi học..."
                  />
                </div>
              </div>

              {/* 4 Groups Assignments & Direct Scoring */}
              <div className="space-y-2">
                <label className="block font-black text-slate-700">
                  Phân công nhiệm vụ & Cộng/Trừ điểm cho 4 Tổ (Thang 100đ):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {teams.map((t, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-pink-50/60 border border-pink-200 flex flex-col justify-between gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-rose-800">{t.icon} {t.groupName}: {t.name}</span>
                        <span className="font-black text-sm text-rose-600 font-mono">{t.score} / 100đ</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 font-bold whitespace-nowrap">Tổ trưởng:</span>
                        <input
                          value={t.leader}
                          onChange={(e) => {
                            const newLeader = e.target.value;
                            setTeams((prev) => {
                              const c = [...prev];
                              c[idx] = { ...c[idx], leader: newLeader };
                              return c;
                            });
                          }}
                          className="w-full p-1 rounded bg-white border border-slate-200 text-xs font-bold"
                          placeholder="Tổ trưởng"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 font-bold whitespace-nowrap">Giao bài:</span>
                        <input
                          value={t.taskNote || ''}
                          onChange={(e) => {
                            const note = e.target.value;
                            setTeams((prev) => {
                              const c = [...prev];
                              c[idx] = { ...c[idx], taskNote: note };
                              return c;
                            });
                          }}
                          className="w-full p-1 rounded bg-white border border-slate-200 text-[11px] font-semibold"
                          placeholder="Nhiệm vụ cụ thể giao cho tổ"
                        />
                      </div>
                      <div className="flex gap-1 pt-1">
                        <button
                          onClick={() => {
                            addScore(idx, 20, 'problem');
                            showToast('ĐÃ CẬP NHẬT', `+20đ cho ${t.groupName}`, '🎓');
                          }}
                          className="flex-1 py-1 rounded bg-pink-200 hover:bg-pink-300 font-black text-[10px] text-pink-900 cursor-pointer"
                        >
                          +20đ
                        </button>
                        <button
                          onClick={() => {
                            addScore(idx, 10, 'problem');
                            showToast('ĐÃ CẬP NHẬT', `+10đ cho ${t.groupName}`, '🎓');
                          }}
                          className="flex-1 py-1 rounded bg-emerald-100 hover:bg-emerald-200 font-black text-[10px] text-emerald-900 cursor-pointer"
                        >
                          +10đ
                        </button>
                        <button
                          onClick={() => {
                            addScore(idx, -10, 'problem');
                            showToast('ĐÃ CẬP NHẬT', `-10đ cho ${t.groupName}`, '⚠️');
                          }}
                          className="py-1 px-2 rounded bg-slate-200 hover:bg-slate-300 font-black text-[10px] text-slate-700 cursor-pointer"
                        >
                          -10đ
                        </button>
                        <button
                          onClick={() => {
                            setTeams((prev) => {
                              const c = [...prev];
                              c[idx] = { ...c[idx], score: 100 };
                              return c;
                            });
                            showToast('HOÀN THÀNH', `${t.groupName} đạt 100 điểm tối đa!`, '⭐');
                          }}
                          className="py-1 px-2 rounded bg-amber-200 hover:bg-amber-300 font-black text-[10px] text-amber-900 cursor-pointer"
                          title="Đặt tối đa 100 điểm"
                        >
                          100đ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Jump to stage */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Chuyển nhanh đến vòng trải nghiệm:
                </label>
                <div className="grid grid-cols-5 gap-1.5 font-bold text-xs">
                  <button
                    onClick={() => {
                      setIsTeacherModalOpen(false);
                      initRound1Task(0);
                    }}
                    className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg text-purple-800 cursor-pointer"
                  >
                    Vòng 1 (20đ)
                  </button>
                  <button
                    onClick={() => {
                      setIsTeacherModalOpen(false);
                      initRound2Task(0);
                    }}
                    className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg text-purple-800 cursor-pointer"
                  >
                    Vòng 2 (20đ)
                  </button>
                  <button
                    onClick={() => {
                      setIsTeacherModalOpen(false);
                      initRound3Task(0);
                    }}
                    className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg text-purple-800 cursor-pointer"
                  >
                    Vòng 3 (20đ)
                  </button>
                  <button
                    onClick={() => {
                      setIsTeacherModalOpen(false);
                      initRound4();
                    }}
                    className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg text-purple-800 cursor-pointer"
                  >
                    Vòng 4 (20đ)
                  </button>
                  <button
                    onClick={() => {
                      setIsTeacherModalOpen(false);
                      initRound5();
                    }}
                    className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg text-purple-800 cursor-pointer"
                  >
                    Vòng 5 (20đ)
                  </button>
                </div>
              </div>

              {/* Timer Limit Configuration */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Thời gian đếm ngược mỗi thử thách:
                </label>
                <select
                  value={timerLimit}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setTimerLimit(val);
                    resetChallengeTimer(val);
                    showToast('CÀI ĐẶT THỜI GIAN', `Đặt thành ${val === 0 ? 'Không giới hạn' : val + 's'}`, '⏱️');
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                >
                  <option value={0}>Không giới hạn thời gian (Thảo luận tự do)</option>
                  <option value={15}>15 Giây (Thử thách nhanh)</option>
                  <option value={20}>20 Giây</option>
                  <option value={30}>30 Giây (Chuẩn lớp học)</option>
                  <option value={45}>45 Giây</option>
                </select>
              </div>

              <div className="pt-3 flex flex-wrap justify-between gap-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setIsTeacherModalOpen(false);
                    setIsReportModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <FileText className="w-4 h-4" />
                  <span>Xem Bảng Điểm Lớp (100đ)</span>
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      stopCurrentAudio();
                      setIsTeacherModalOpen(false);
                      setRound(0);
                      setSubStep(0);
                      setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
                      setMetrics({ knowledge: 0, sharing: 0, problem: 0 });
                      setShards([false, false, false, false, false]);
                      setCompletedChores({});
                      showToast('ĐÃ ĐẶT LẠI', 'Bắt đầu lại cuộc chơi từ đầu!', '🔄');
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 font-bold hover:bg-rose-100 cursor-pointer"
                  >
                    🔄 Đặt lại từ đầu
                  </button>
                  <button
                    onClick={() => setIsTeacherModalOpen(false)}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold cursor-pointer"
                  >
                    Đóng bảng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CLASS COMPETITION REPORT MODAL (100 POINTS) */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl border-4 border-indigo-300 max-h-[92vh] overflow-y-auto print:p-0 print:border-none print:shadow-none">
            {/* Report Header */}
            <div className="border-b-2 border-indigo-200 pb-4 mb-4 text-center space-y-1">
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest">
                {classInfo.schoolName.toUpperCase()}
              </div>
              <h2 className="text-xl md:text-2xl font-black text-indigo-900 font-display">
                BẢNG ĐIỂM THI ĐUA HỌC TẬP VÀ GIAO BÀI (THANG 100 ĐIỂM)
              </h2>
              <p className="text-xs font-bold text-rose-600">
                Chủ đề Chào mừng 20/10: "Nếu Con Là Mẹ Trong Một Ngày" • Môn: Ngữ Văn 6
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-600 pt-1">
                <span>Lớp: <strong className="text-slate-900">{classInfo.className}</strong></span>
                <span>Giáo viên: <strong className="text-slate-900">{classInfo.teacherName}</strong></span>
                <span>Thang điểm chuẩn: <strong className="text-indigo-800">100 điểm</strong></span>
              </div>
            </div>

            {/* General Assignment */}
            <div className="bg-indigo-50/70 p-3 rounded-2xl border border-indigo-200 mb-4 text-xs">
              <span className="font-black text-indigo-900">📌 Nhiệm vụ giao bài chung cho cả lớp:</span>
              <p className="text-slate-700 font-medium mt-0.5">{classInfo.assignmentNote}</p>
            </div>

            {/* Score & Assignment Table for 4 Groups */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 mb-4">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-black border-b border-slate-200">
                    <th className="p-2.5">Tổ / Đội</th>
                    <th className="p-2.5">Tổ trưởng</th>
                    <th className="p-2.5 text-center">Điểm số</th>
                    <th className="p-2.5 text-center">Tỷ lệ</th>
                    <th className="p-2.5">Xếp loại</th>
                    <th className="p-2.5">Nhiệm vụ giao bài</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold">
                  {teams.map((t, idx) => {
                    const grade = t.score >= 90 ? 'Xuất sắc' : t.score >= 80 ? 'Giỏi' : t.score >= 70 ? 'Khá' : 'Đang phấn đấu';
                    const badgeColor = t.score >= 90 ? 'bg-emerald-100 text-emerald-800' : t.score >= 80 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800';
                    return (
                      <tr key={idx} className="hover:bg-slate-50/80">
                        <td className="p-2.5 font-bold text-slate-900">
                          {t.icon} {t.groupName}: {t.name}
                        </td>
                        <td className="p-2.5 text-slate-700">{t.leader}</td>
                        <td className="p-2.5 text-center font-black text-rose-600 font-mono text-sm">
                          {t.score} / 100
                        </td>
                        <td className="p-2.5 text-center font-bold text-slate-600">
                          {Math.round((t.score / 100) * 100)}%
                        </td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${badgeColor}`}>
                            {grade}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-600 text-[11px]">
                          {t.taskNote || 'Hoàn thành các câu hỏi trong ngày'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Signature Area */}
            <div className="flex justify-between items-end pt-4 border-t border-slate-200 text-xs">
              <div className="space-y-1 text-slate-500 font-semibold">
                <div>Ngày tổng kết: {new Date().toLocaleDateString('vi-VN')}</div>
                <div>Xác nhận bởi Ban Giám Khảo & Lớp Trưởng</div>
              </div>
              <div className="text-center font-bold space-y-8">
                <div className="text-slate-700">Giáo viên phụ trách môn Ngữ Văn</div>
                <div className="font-black text-indigo-900">{classInfo.teacherName}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-6 pt-3 border-t print:hidden">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Printer className="w-4 h-4" />
                <span>In Bảng Điểm</span>
              </button>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs cursor-pointer shadow"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST MESSAGE NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <span className="text-2xl">{toast.icon}</span>
          <div>
            <div className="font-bold text-xs md:text-sm text-pink-300">{toast.title}</div>
            <div className="text-[11px] md:text-xs text-slate-200">{toast.message}</div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="w-full text-center py-2 text-[11px] text-slate-500">
        Hành trình giáo dục chào mừng ngày Phụ nữ Việt Nam 20/10 • {classInfo.className} ({classInfo.schoolName}) • Thang điểm thi đua 100 điểm • Giọng đọc Leda AI
      </footer>
    </div>
  );
}
