/**
 * =========================================================================
 * GOOGLE APPS SCRIPT: TỰ ĐỘNG LƯU KẾT QUẢ HỌC TẬP VÀO GOOGLE SHEETS
 * =========================================================================
 * - Google Sheet ID: 12mRK7ZmxScrJwnBmFa-9gdmKSKtZtSfiIvNug9g3llM
 * - Tên Sheet: Mật mã
 * - Cấu trúc các cột từ A đến F:
 *   [Cột A] STT
 *   [Cột B] Họ và tên
 *   [Cột C] Tổ
 *   [Cột D] Lớp
 *   [Cột E] Thời gian nộp bài
 *   [Cột F] Điểm
 * =========================================================================
 * HƯỚNG DẪN TRIỂN KHAI NHANH:
 * 1. Mở trang tính Google Sheets của bạn (hoặc vào extensions.google.com)
 * 2. Vào menu: Tiện ích mở rộng (Extensions) -> Apps Script
 * 3. Xóa hết mã cũ trong tệp Code.gs và dán toàn bộ đoạn mã này vào.
 * 4. Bấm nút "Lưu" (biểu tượng đĩa mềm 💾).
 * 5. Bấm nút "Triển khai" (Deploy) màu xanh góc trên bên phải -> "Tùy chọn triển khai mới" (New deployment).
 * 6. Chọn loại: "Ứng dụng web" (Web app).
 *    - Mô tả: "Lưu điểm học sinh"
 *    - Thực thi dưới dạng (Execute as): "Tôi" (Me)
 *    - Ai có quyền truy cập (Who has access): "Bất kỳ ai" (Anyone).
 * 7. Bấm "Triển khai" (Deploy) -> Cấp quyền truy cập nếu Google hỏi.
 * 8. Sao chép "URL ứng dụng web" (Web App URL) và dán vào ứng dụng web để nộp điểm tự động!
 * =========================================================================
 */

// Cấu hình ID Bảng tính và Tên Trang tính
const SPREADSHEET_ID = "12mRK7ZmxScrJwnBmFa-9gdmKSKtZtSfiIvNug9g3llM";
const SHEET_NAME = "Mật mã";

/**
 * Xử lý yêu cầu POST gửi dữ liệu lên Google Sheets
 */
function doPost(e) {
  return handleRequest(e);
}

/**
 * Xử lý yêu cầu GET (hỗ trợ kiểm tra kết nối hoặc gửi qua URL parameter)
 */
function doGet(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    const lock = LockService.getScriptLock();
    // Chờ tối đa 30 giây để tránh xung đột ghi dữ liệu đồng thời khi nhiều học sinh nộp cùng lúc
    lock.waitLock(30000);

    // 1. Mở Bảng tính bằng Spreadsheet ID
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Nếu chưa có trang tính "Mật mã", tự động tạo mới
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // 2. Kiểm tra và khởi tạo tiêu đề cột nếu sheet còn trống
    if (sheet.getLastRow() === 0) {
      const headers = ["STT", "Họ và tên", "Tổ", "Lớp", "Thời gian nộp bài", "Điểm"];
      sheet.appendRow(headers);
      
      // Định dạng dòng tiêu đề đẹp mắt (màu hồng phong cách 20/10)
      const headerRange = sheet.getRange(1, 1, 1, 6);
      headerRange.setBackground("#E11D48") // Rose-600
                 .setFontColor("#FFFFFF")
                 .setFontWeight("bold")
                 .setHorizontalAlignment("center")
                 .setVerticalAlignment("middle");
      sheet.setRowHeight(1, 35);
      sheet.setColumnWidth(1, 60);  // A: STT
      sheet.setColumnWidth(2, 220); // B: Họ và tên
      sheet.setColumnWidth(3, 100); // C: Tổ
      sheet.setColumnWidth(4, 100); // D: Lớp
      sheet.setColumnWidth(5, 190); // E: Thời gian nộp bài
      sheet.setColumnWidth(6, 90);  // F: Điểm
    }

    // 3. Đọc dữ liệu gửi lên (Hỗ trợ JSON body, URL-encoded hoặc query parameters)
    let data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // Trích xuất các trường thông tin theo đúng yêu cầu
    const hoVaTen = data.hoVaTen || data.name || data.fullname || data["Họ và tên"] || "Học sinh";
    const to = data.to || data.group || data.team || data["Tổ"] || data["tổ"] || "Tổ 1";
    const lop = data.lop || data.className || data.class || data["Lớp"] || data["lớp"] || "Lớp 6A1";
    const diem = data.diem !== undefined ? data.diem : (data.score !== undefined ? data.score : 100);
    
    // Thời gian nộp bài: lấy từ client hoặc sinh tự động theo giờ Việt Nam (GMT+7)
    let thoiGian = data.thoiGian || data.time || data.timestamp || data["Thời gian nộp bài"];
    if (!thoiGian) {
      const now = new Date();
      thoiGian = Utilities.formatDate(now, "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
    }

    // 4. Tính toán Số thứ tự (STT) tự động
    const nextRow = sheet.getLastRow() + 1;
    const stt = nextRow - 1; // Hàng 1 là tiêu đề, hàng 2 là STT 1

    // 5. Thêm dòng dữ liệu mới theo đúng thứ tự cột từ A đến F:
    // Cột A: STT | Cột B: Họ và tên | Cột C: Tổ | Cột D: Lớp | Cột E: Thời gian nộp bài | Cột F: Điểm
    const newRowData = [stt, hoVaTen, to, lop, thoiGian, diem];
    sheet.appendRow(newRowData);

    // Căn lề và định dạng ô dữ liệu
    const addedRange = sheet.getRange(nextRow, 1, 1, 6);
    addedRange.setVerticalAlignment("middle");
    sheet.getRange(nextRow, 1).setHorizontalAlignment("center"); // STT
    sheet.getRange(nextRow, 2).setHorizontalAlignment("left");   // Họ và tên
    sheet.getRange(nextRow, 3).setHorizontalAlignment("center"); // Tổ
    sheet.getRange(nextRow, 4).setHorizontalAlignment("center"); // Lớp
    sheet.getRange(nextRow, 5).setHorizontalAlignment("center"); // Thời gian
    sheet.getRange(nextRow, 6).setHorizontalAlignment("center").setFontWeight("bold"); // Điểm

    // Giải phóng lock
    lock.releaseLock();

    // 6. Trả về phản hồi thành công JSON
    const response = {
      status: "success",
      message: "Đã lưu kết quả vào trang tính 'Mật mã' thành công!",
      data: {
        stt: stt,
        hoVaTen: hoVaTen,
        to: to,
        lop: lop,
        thoiGian: thoiGian,
        diem: diem
      }
    };

    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    const errorResponse = {
      status: "error",
      message: "Lỗi ghi dữ liệu: " + error.toString()
    };
    return ContentService.createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
