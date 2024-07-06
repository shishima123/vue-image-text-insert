<script setup>
import { ref, computed, watch } from 'vue'

import { useToast } from 'primevue/usetoast'
const toast = useToast()

const xCoordRef = ref(1000)
const yCoordRef = ref(1000)
const fontSizeRef = ref(100)
const fontColorRef = ref('#000000')
const fontFamilyRef = ref('DFVNHelloHoney')
const textInputRef = ref()
const canvasRef = ref()
const downloadCountRef = ref(0)
const fileSelectedRef = ref()
const fonts = ref([
  'DFVNHelloHoney',
  'UVF-WazaLTPro',
  'LNTH-HotelLorint',
  'Arial',
  'Courier New',
  'Georgia',
  'Times New Roman',
  'Verdana'
])

const textInputComputed = computed(() => {
  if (textInputRef.value) {
    return textInputRef.value.split('\n').filter(Boolean)
  }
  return ''
})

watch(
  [xCoordRef, yCoordRef, fontSizeRef, fontColorRef, fontFamilyRef, textInputRef, fileSelectedRef],
  async () => {
    preview()
  }
)

function validate(checkTextInput = false) {
  if (!xCoordRef.value) {
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Chưa nhập tọa độ X', life: 3000 })
    return false
  }

  if (!yCoordRef.value) {
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Chưa nhập tọa độ Y', life: 3000 })
    return false
  }

  if (!fontSizeRef.value) {
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Chưa nhập Font Size', life: 3000 })
    return false
  }

  if (!fontColorRef.value) {
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Chưa Chọn Màu', life: 3000 })
    return false
  }

  if (!fontFamilyRef.value) {
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Chưa Chọn Font', life: 3000 })
    return false
  }

  if (checkTextInput && !textInputRef.value) {
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Chưa nhập Text', life: 3000 })
    return false
  }

  if (!fileSelectedRef.value) {
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Chưa Chọn File', life: 3000 })
    return false
  }
  return true
}

function fileChange(e) {
  let files = e.target.files || e.dataTransfer.files
  fileSelectedRef.value = files[0]
}

function preview() {
  if (!validate()) {
    return
  }

  const ctx = canvasRef.value.getContext('2d')

  const image = new Image()
  image.src = URL.createObjectURL(fileSelectedRef.value)

  image.onload = function () {
    canvasRef.value.width = image.width
    canvasRef.value.height = image.height
    ctx.drawImage(image, 0, 0)
    ctx.font = `${fontSizeRef.value}px ${fontFamilyRef.value}`
    ctx.fillStyle = fontColorRef.value
    ctx.fillText(textInputComputed.value[0] || 'Nguyen Van A', xCoordRef.value, yCoordRef.value)
  }
}

function download() {
  downloadCountRef.value = 0
  if (!validate(true)) {
    return
  }

  const image = new Image()
  image.src = URL.createObjectURL(fileSelectedRef.value)

  image.onload = async function () {
    for (const textInput of textInputComputed.value) {
      await handleDownloadImage(image, textInput)
    }
  }
}

function handleDownloadImage(image, textInput) {
  return new Promise((resolve) => {
    setTimeout(function () {
      const tempCanvas = document.createElement('canvas')
      const tempCtx = tempCanvas.getContext('2d')
      tempCanvas.width = image.width
      tempCanvas.height = image.height
      tempCtx.drawImage(image, 0, 0)
      tempCtx.font = `${fontSizeRef.value}px ${fontFamilyRef.value}`
      tempCtx.fillStyle = fontColorRef.value
      tempCtx.fillText(textInputComputed.value[0], xCoordRef.value, yCoordRef.value)

      const link = document.createElement('a')
      link.href = tempCanvas.toDataURL()
      link.download = `${textInput}.png`
      link.click()

      downloadCountRef.value++

      return resolve()
    }, 500)
  })
}
</script>

<template>
  <Toast />
  <div class="container mt-5 mx-auto shadow rounded-md bg-white p-5">
    <div>
      <h2 class="text-center text-4xl font-bold">Chèn chữ vào ảnh</h2>
      <Message severity="secondary" class="mt-4">
        <slot>
          <p class="text-sm">
            Nhập các thông tin tọa độ x (lề trái), y (lề trên), size ( kích thước chữ), màu sắc,
            font chữ, file ảnh
            <br />
            Bấm xem ảnh để điều chỉnh lại các thông số cho phù hợp
          </p>
        </slot>
      </Message>
      <div class="gap-8 md:gap-5 flex items-center flex-wrap mt-7">
        <FloatLabel>
          <InputNumber id="xCoord" v-model.number="xCoordRef" showButtons inputClass="w-[120px]" />
          <label for="xCoord">Tọa độ X</label>
        </FloatLabel>
        <FloatLabel>
          <InputNumber id="yCoord" v-model.number="yCoordRef" showButtons inputClass="w-[120px]" />
          <label for="yCoord">Tọa độ Y</label>
        </FloatLabel>
        <FloatLabel>
          <InputNumber
            id="fontSize"
            v-model.number="fontSizeRef"
            showButtons
            inputClass="w-[120px]"
          />
          <label for="fontSize">Size</label>
        </FloatLabel>
        <FloatLabel>
          <Select id="fontFamily" v-model="fontFamilyRef" :options="fonts" class="w-[200px]" />
          <label for="fontFamily">Font</label>
        </FloatLabel>
        <input id="color" type="color" v-model.lazy="fontColorRef" />
        <input type="file" accept="image/*" @change="fileChange" />
      </div>

      <div class="mt-4 w-full">
        <Textarea
          class="w-full"
          v-model="textInputRef"
          rows="5"
          placeholder="Muốn tạo nhiều ảnh thì mỗi text 1 dòng
          Ví dụ:
      anh A
      chị B"
          style="white-space: pre-line"
        />
      </div>

      <div class="columns-1 mt-4 flex justify-center flex-wrap">
        <Button label="Tải ảnh" severity="success" @click="download" />
      </div>

      <ProgressBar
        :value="Math.ceil((downloadCountRef / textInputComputed.length) * 100)"
        class="w-full mt-4"
        v-if="downloadCountRef"
      >
        Đang tải {{ downloadCountRef }} / {{ textInputComputed.length }} ảnh...
      </ProgressBar>
    </div>
    <div class="mt-4">
      <canvas
        v-show="fileSelectedRef"
        class="w-11/12 border h-auto mx-auto"
        ref="canvasRef"
      ></canvas>
    </div>
  </div>
</template>
