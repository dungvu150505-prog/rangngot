// server.cjs
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();

// Bật CORS (nếu cần)
app.use(cors({
  origin: '*', // hoặc giới hạn domain frontend của bạn
}));

// Đảm bảo thư mục uploads tồn tại
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Cấu hình lưu file
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// Phục vụ static
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// API upload audio
app.post('/upload', upload.single('audio'), (req, res) => {
  if (!req.file) return res.json({ success: false });
  const receiverUrl = `/receiver.html?audio=${encodeURIComponent('/uploads/' + req.file.filename)}`;
  res.json({ success: true, receiverUrl });
});

// Render port
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
