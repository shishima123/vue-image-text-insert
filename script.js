document.getElementById('viewButton').addEventListener('click', function() {
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');

    const imageInput = document.getElementById('imageInput');
    const textInput = document.getElementById('textInput').value.split('\n'); // Chia nhiều dòng text
    const xCoord = parseInt(document.getElementById('xCoord').value, 10);
    const yCoord = parseInt(document.getElementById('yCoord').value, 10);
    const fontSize = parseInt(document.getElementById('fontSize').value, 10);
    const fontColor = document.getElementById('fontColor').value;
    const fontFamily = document.getElementById('fontFamily').value;

    const image = new Image();
    image.src = URL.createObjectURL(imageInput.files[0]);

    image.onload = function() {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = fontColor;
        ctx.fillText(textInput[0], xCoord, yCoord); // Chỉ hiển thị dòng đầu tiên
    }
});

document.getElementById('downloadButton').addEventListener('click', function() {
    const imageInput = document.getElementById('imageInput');
    const textInput = document.getElementById('textInput').value.split('\n'); // Chia nhiều dòng text
    const statusDiv = document.getElementById('status');

    statusDiv.innerHTML = `Đang tải 0 / ${textInput.length} ảnh...`;

    const image = new Image();
    image.src = URL.createObjectURL(imageInput.files[0]);

    image.onload = function() {
        let downloadCount = 0;

        const downloadImage = (text, index) => {
            // Tạo một canvas tạm thời với kích thước gốc của ảnh
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');

            tempCanvas.width = image.width;
            tempCanvas.height = image.height;
            tempCtx.drawImage(image, 0, 0);

            // Lấy lại các giá trị để chèn chữ
            const xCoord = parseInt(document.getElementById('xCoord').value, 10);
            const yCoord = parseInt(document.getElementById('yCoord').value, 10);
            const fontSize = parseInt(document.getElementById('fontSize').value, 10);
            const fontColor = document.getElementById('fontColor').value;
            const fontFamily = document.getElementById('fontFamily').value;

            tempCtx.font = `${fontSize}px ${fontFamily}`;
            tempCtx.fillStyle = fontColor;
            tempCtx.fillText(text, xCoord, yCoord);

            // Tải ảnh với tên file theo text nhập
            const link = document.createElement('a');
            link.href = tempCanvas.toDataURL();
            link.download = `${text}.png`;
            link.click();

            // Cập nhật bộ đếm
            downloadCount++;
            statusDiv.innerHTML = `Đang tải ${downloadCount} / ${textInput.length} ảnh...`;

            // Thông báo khi hoàn tất
            if (downloadCount === textInput.length) {
                statusDiv.innerHTML = `Đã tải xong ${downloadCount} ảnh.`;
            } else {
                // Đợi một khoảng thời gian ngắn trước khi tải ảnh tiếp theo
                setTimeout(() => downloadImage(textInput[downloadCount], downloadCount), 500);
            }
        };

        // Bắt đầu tải ảnh đầu tiên
        downloadImage(textInput[0], 0);
    };
});
