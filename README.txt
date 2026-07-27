B1 SPEAKING LAB v4
==================

Bản v4 bổ sung hướng dẫn song ngữ, màn hướng dẫn lần đầu, giao diện thích ứng laptop/điện thoại và cấu trúc Node.js sẵn sàng deploy lên Render.

1. CÁCH CHẠY TRÊN MÁY
---------------------
Windows:
- Giải nén thư mục.
- Nhấp đúp start.bat.
- Trình duyệt mở tại http://localhost:8080.

macOS / Linux:
- Mở Terminal tại thư mục dự án.
- Chạy: ./start.sh
- Hoặc chạy: npm start
- Truy cập: http://localhost:8080.

Nếu máy không có Node.js, start.bat sẽ thử dùng Python để mở web tĩnh.

2. CÁCH DEPLOY LÊN RENDER
-------------------------
Cách 1 - Dùng render.yaml (khuyến nghị):
1. Tạo một repository GitHub mới.
2. Đưa TOÀN BỘ các file trong thư mục này lên thư mục gốc của repository.
3. Trong Render, chọn New > Blueprint.
4. Kết nối repository GitHub.
5. Render đọc file render.yaml và tạo Web Service.
6. Chờ deploy xong rồi mở địa chỉ có dạng https://ten-web.onrender.com.

Cách 2 - Tạo Web Service thủ công:
- Runtime/Language: Node
- Build Command: npm install
- Start Command: npm start
- Health Check Path: /health

Máy chủ đọc cổng từ biến môi trường PORT nên chạy được trên Render và vẫn chạy ở cổng 8080 khi mở cục bộ.

3. LƯU Ý QUAN TRỌNG VỀ TÀI KHOẢN
--------------------------------
- Đăng ký, đăng nhập và tiến độ hiện được lưu bằng localStorage của trình duyệt.
- Mỗi tài khoản có câu đã thuộc, câu sai, câu chưa chắc và thống kê riêng.
- Dữ liệu trên điện thoại và laptop KHÔNG tự đồng bộ.
- Đổi trình duyệt, xóa dữ liệu trang web hoặc dùng thiết bị khác sẽ không thấy tiến độ cũ.
- Render chỉ dùng để đưa web lên Internet; bản v4 chưa dùng cơ sở dữ liệu trực tuyến.
- Muốn đồng bộ thật giữa nhiều thiết bị cần tích hợp thêm một dịch vụ cơ sở dữ liệu và xác thực như Supabase/PostgreSQL.

4. HƯỚNG DẪN LẦN ĐẦU
--------------------
Sau lần đăng nhập đầu tiên, web hiển thị hướng dẫn 5 bước:
- Cách học theo khung thay vì học thuộc nguyên bài.
- Lộ trình học thông minh 20 phút mỗi ngày.
- Cách đánh dấu Nhớ rõ / Chưa chắc / Cần học lại.
- Cách dùng trên laptop và điện thoại.
- Thứ tự học được đề xuất.

Có thể mở lại hướng dẫn từ nút tài khoản ở góc trên bên phải > Xem hướng dẫn sử dụng.

5. GIAO DIỆN THÍCH ỨNG THIẾT BỊ
-------------------------------
Laptop:
- Thanh điều hướng cố định bên trái.
- Có tìm kiếm nhanh bằng phím /.
- Flashcard hỗ trợ Space và phím mũi tên.

Máy tính bảng:
- Thanh bên chuyển thành menu trượt.
- Các khối tự giảm số cột.

Điện thoại:
- Có thanh điều hướng phía dưới.
- Nội dung chuyển thành một cột.
- Nút bấm và ô nhập lớn hơn để dễ chạm.
- Hỗ trợ vùng an toàn của màn hình và chiều cao động.

6. PHẦN SONG NGỮ ĐÃ BỔ SUNG
---------------------------
- DREAM: mỗi bước có câu tiếng Anh, mục đích và nghĩa tiếng Việt.
- Các dạng câu hỏi Yes/No, What, Why, How often, Past, Future, Opinion, Compare đều có ví dụ dịch Việt.
- Khung 8 ô mô tả tranh có bản tiếng Anh và cách hiểu tiếng Việt.
- Cụm cứu nguy có nghĩa Việt.
- Hướng dẫn ghép câu, ghép đoạn và email có ghi chú Việt ngay dưới mẫu tiếng Anh.
- Khung email chỉ cần thay các phần được đánh dấu để đổi sang chủ đề mới.

7. HỆ THỐNG ÔN LẠI
------------------
- Sai: ưu tiên cao nhất.
- Chưa chắc: ưu tiên thứ hai.
- Đúng một lần: Đang tiến bộ.
- Đúng hai lần liên tiếp: hoàn tất và rời danh sách ôn.

Kết quả được ghi nhận từ Flashcard, trắc nghiệm, điền từ và tự gõ câu trả lời.

8. CẤU TRÚC DỰ ÁN
-----------------
index.html              Giao diện chính
styles.css              Toàn bộ giao diện responsive
app.js                  Logic tài khoản, học tập và ôn sai
data.js                 Dữ liệu B1 từ các file đã cung cấp
assets/                  Hình ảnh
server.js               Máy chủ Node.js dùng cho Render/local
package.json            Lệnh npm start
render.yaml              Cấu hình deploy Render Blueprint
service-worker.js        Bộ nhớ đệm giúp web tiếp tục mở khi mạng chập chờn
manifest.webmanifest     Cấu hình web app
start.bat / start.sh     Chạy nhanh trên máy

9. DỮ LIỆU NGUỒN
----------------
- Cấu trúc trả lời Tranh.docx
- Cấu trúc cuộc đối thoại.docx
- phan noi them.docx

Web giữ Bản gốc để đối chiếu và Bản dễ nói đã sửa ngữ pháp để học.
