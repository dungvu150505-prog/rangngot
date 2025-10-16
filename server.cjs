// server.cjs
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();

// Bật CORS để Render hoặc domain khác truy cập được
app.use(cors());

// Phục vụ file tĩnh trong thư mục "public"
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Cấu hình nơi lưu file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// API upload
app.post('/upload', upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.json({ success: false, message: 'Không có file nào được tải lên.' });
  }

  // 🧭 Lấy domain gốc tự động từ Render hoặc local
  const baseUrl = req.protocol + '://' + req.get('host');

  // 🪄 Tạo URL tuyệt đối tới file đã upload
  const audioUrl = `${baseUrl}/uploads/${req.file.filename}`;

  // 🕊️ Tạo link tới trang người nhận
  const receiverUrl = `${baseUrl}/receiver.html?audio=${encodeURIComponent(audioUrl)}`;

  res.json({
    success: true,
    audioUrl,
    receiverUrl
  });
});

// ✅ Server chạy
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
