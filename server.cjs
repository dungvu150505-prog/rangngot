// server.cjs
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Cấu hình lưu file
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// Phục vụ public folder
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// API upload audio
app.post('/upload', upload.single('audio'), (req, res) => {
  if (!req.file) return res.json({ success: false });
  const receiverUrl = `/receiver.html?audio=${encodeURIComponent('/uploads/' + req.file.filename)}`;
  res.json({ success: true, receiverUrl });
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
