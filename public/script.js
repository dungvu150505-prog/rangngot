document.getElementById('uploadForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const fileInput = document.getElementById('audioFile');
  if (!fileInput.files.length) {
    alert('Vui lòng chọn một file âm thanh!');
    return;
  }

  const formData = new FormData();
  formData.append('audio', fileInput.files[0]);

  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    if (data.success) {
      // Hiển thị link
      const linkElement = document.getElementById('receiverLink');
      linkElement.textContent = `http://localhost:3000${data.receiverUrl}`;
      linkElement.href = data.receiverUrl;

      // Tạo QR Code
      const urlFull = `http://localhost:3000${data.receiverUrl}`;
      QRCode.toCanvas(document.getElementById('qrCanvas'), urlFull, function (error) {
        if (error) console.error(error);
      });

      document.getElementById('result').style.display = 'block';
    } else {
      alert('Lỗi khi upload file.');
    }

  } catch (err) {
    console.error(err);
    alert('Đã xảy ra lỗi khi kết nối máy chủ.');
  }
});
