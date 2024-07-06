<script setup>
// document.getElementById('viewButton').addEventListener('click', function() {
//   const canvas = document.getElementById('imageCanvas');
//   const ctx = canvas.getContext('2d');
//
//   const imageInput = document.getElementById('imageInput');
//   const textInput = document.getElementById('textInput').value.split('\n'); // Chia nhiều dòng text
//   const xCoord = parseInt(document.getElementById('xCoord').value, 10);
//   const yCoord = parseInt(document.getElementById('yCoord').value, 10);
//   const fontSize = parseInt(document.getElementById('fontSize').value, 10);
//   const fontColor = document.getElementById('fontColor').value;
//   const fontFamily = document.getElementById('fontFamily').value;
//
//   const image = new Image();
//   image.src = URL.createObjectURL(imageInput.files[0]);
//
//   image.onload = function() {
//     canvas.width = image.width;
//     canvas.height = image.height;
//     ctx.drawImage(image, 0, 0);
//     ctx.font = `${fontSize}px ${fontFamily}`;
//     ctx.fillStyle = fontColor;
//     ctx.fillText(textInput[0], xCoord, yCoord); // Chỉ hiển thị dòng đầu tiên
//   }
// });
//
// document.getElementById('downloadButton').addEventListener('click', function() {
//   const imageInput = document.getElementById('imageInput');
//   const textInput = document.getElementById('textInput').value.split('\n'); // Chia nhiều dòng text
//   const statusDiv = document.getElementById('status');
//
//   statusDiv.innerHTML = `Đang tải 0 / ${textInput.length} ảnh...`;
//
//   const image = new Image();
//   image.src = URL.createObjectURL(imageInput.files[0]);
//
//   image.onload = function() {
//     let downloadCount = 0;
//
//     const downloadImage = (text, index) => {
//       // Tạo một canvas tạm thời với kích thước gốc của ảnh
//       const tempCanvas = document.createElement('canvas');
//       const tempCtx = tempCanvas.getContext('2d');
//
//       tempCanvas.width = image.width;
//       tempCanvas.height = image.height;
//       tempCtx.drawImage(image, 0, 0);
//
//       // Lấy lại các giá trị để chèn chữ
//       const xCoord = parseInt(document.getElementById('xCoord').value, 10);
//       const yCoord = parseInt(document.getElementById('yCoord').value, 10);
//       const fontSize = parseInt(document.getElementById('fontSize').value, 10);
//       const fontColor = document.getElementById('fontColor').value;
//       const fontFamily = document.getElementById('fontFamily').value;
//
//       tempCtx.font = `${fontSize}px ${fontFamily}`;
//       tempCtx.fillStyle = fontColor;
//       tempCtx.fillText(text, xCoord, yCoord);
//
//       // Tải ảnh với tên file theo text nhập
//       const link = document.createElement('a');
//       link.href = tempCanvas.toDataURL();
//       link.download = `${text}.png`;
//       link.click();
//
//       // Cập nhật bộ đếm
//       downloadCount++;
//       statusDiv.innerHTML = `Đang tải ${downloadCount} / ${textInput.length} ảnh...`;
//
//       // Thông báo khi hoàn tất
//       if (downloadCount === textInput.length) {
//         statusDiv.innerHTML = `Đã tải xong ${downloadCount} ảnh.`;
//       } else {
//         // Đợi một khoảng thời gian ngắn trước khi tải ảnh tiếp theo
//         setTimeout(() => downloadImage(textInput[downloadCount], downloadCount), 500);
//       }
//     };
//
//     // Bắt đầu tải ảnh đầu tiên
//     downloadImage(textInput[0], 0);
//   };
// });
</script>

<template>
  <div class="container mt-5">
    <div class="form-container">
      <h2 class="text-center">Chèn chữ vào ảnh</h2>
      <p>
        Vui lòng nhập các thông tin tọa độ x (lề trái), y (lề trên), size ( kích thước chữ), màu
        sắc, font chữ, file ảnh. Và ấn xem ảnh để điều chỉnh lại các thông số cho phù hợp nhé. Muốn
        thêm font cá nhân nào thì liên hệ 0987454321 để mình hỗ trợ thêm nhé ! Happy Day !
      </p>
      <form>
        <!-- Tọa độ X, Y và kích thước chữ trên cùng một hàng -->
        <div class="form-row">
          <div class="form-group col-4">
            <input
              type="number"
              class="form-control"
              id="xCoord"
              placeholder="Lề Trái - Tọa độ X"
            />
          </div>
          <div class="form-group col-4">
            <input
              type="number"
              class="form-control"
              id="yCoord"
              placeholder="Lề Trên - Tọa độ Y"
            />
          </div>
          <div class="form-group col-4">
            <input
              type="number"
              class="form-control"
              id="fontSize"
              placeholder="Size - Kích thước chữ (px)"
            />
          </div>
        </div>
        <!-- Màu và font chữ trên cùng một hàng -->
        <div class="form-row">
          <div class="form-group col-2">
            <input type="color" class="form-control" id="fontColor" value="#000000" />
          </div>
          <div class="form-group col-10">
            <select class="form-control" id="fontFamily">
              <option value="DFVNHelloHoney">DFVNHelloHoney</option>
              <option value="UVF-WazaLTPro">UVF-WazaLTPro</option>
              <option value="LNTH-HotelLorint">LNTH-HotelLorint</option>
              <option value="Arial">Arial</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Verdana">Verdana</option>
              <option value="DFVNHelloHoney">DFVNHelloHoney</option>
            </select>
          </div>
        </div>
        <!-- Ô nhập file -->
        <div class="form-row">
          <div class="form-group col-12">
            <input type="file" class="form-control-file" id="imageInput" accept="image/*" />
          </div>
        </div>
        <!-- Ô nhập text -->
        <div class="form-row">
          <div class="form-group col-12">
            <textarea
              class="form-control"
              id="textInput"
              placeholder="Muốn làm nhiều ảnh thì mỗi text 1 dòng là dc. Ví dụ:
      anh A 
      chị B
      p/s: để mượt nhất nên để list max khoảng 20 người / 1 lần"
              rows="5"
              style="white-space: pre-line"
            ></textarea>
          </div>
        </div>
        <!-- Nút xem và tải -->
        <div class="form-group text-center">
          <button type="button" class="btn btn-primary" id="viewButton">Xem</button>
          <button type="button" class="btn btn-success" id="downloadButton">Tải ảnh</button>
        </div>
        <!-- Trạng thái -->
        <div class="form-group text-center">
          <div id="status"></div>
        </div>
      </form>
    </div>
    <!-- Canvas -->
    <div class="canvas-container text-center mt-4">
      <canvas id="imageCanvas" class="border"></canvas>
    </div>
  </div>
</template>

<style scoped></style>
