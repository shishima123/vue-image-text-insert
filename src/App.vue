<script setup>
import { ref, computed, watch, nextTick } from 'vue'

import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
const toast = useToast()
const confirm = useConfirm()

const textInputRef = ref()
const canvasRef = ref()
const downloadCountRef = ref(0)
const fileSelectedRef = ref()
const positionDefault = {
  x: 0,
  y: 0,
  size: 50,
  font: 'DFVNHelloHoney',
  color: '#ff0000',
  textAlign: {
    id: 'center',
    label: 'Giữa'
  }
}
const positionsRef = ref([{ ...positionDefault }])
const positionSelectedRef = ref()
const visibleImagePickerRef = ref(false)
const imagePickerRef = ref()
const imagePickerDrawRef = ref()
const fonts = [
  'DFVNHelloHoney',
  'UVF-WazaLTPro',
  'LNTH-HotelLorint',
  'Arial',
  'Courier New',
  'Georgia',
  'Times New Roman',
  'Verdana'
]
const textAligns = [
  {
    id: 'left',
    label: 'Trái'
  },
  {
    id: 'center',
    label: 'Giữa'
  },
  {
    id: 'right',
    label: 'Phải'
  }
]

const textInputComputed = computed(() => {
  if (textInputRef.value) {
    let textSplit = []
    let split = textInputRef.value.split('\n').filter(Boolean)
    split.forEach((item) => {
      let arr = item.split('|').filter(Boolean)
      textSplit.push(arr)
    })
    return textSplit
  }
  return ''
})

watch([textInputRef, fileSelectedRef], async () => {
  preview()
})

watch(
  positionsRef,
  async () => {
    preview()
  },
  { deep: true }
)

function validate(checkTextInput = false) {
  if (checkTextInput && !textInputRef.value) {
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Chưa nhập Text', life: 3000 })
    return false
  }

  if (!fileSelectedRef.value) {
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Chưa Chọn File', life: 3000 })
    return false
  }

  for (const position of positionsRef.value) {
    if (position.x === null || position.x === undefined || position.x === '') {
      toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Chưa nhập tọa độ X', life: 3000 })
      return false
    }

    if (position.y === null || position.y === undefined || position.y === '') {
      toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Chưa nhập tọa độ Y', life: 3000 })
      return false
    }

    if (!position.size) {
      toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Chưa nhập Font Size', life: 3000 })
      return false
    }

    if (!position.color) {
      toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Chưa Chọn Màu', life: 3000 })
      return false
    }

    if (!position.font) {
      toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Chưa Chọn Font', life: 3000 })
      return false
    }
  }

  return true
}

function fileChange(e) {
  let files = e.target.files || e.dataTransfer.files
  fileSelectedRef.value = files[0]
}

function preview() {
  downloadCountRef.value = 0
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
    positionsRef.value.forEach((position, index) => {
      ctx.font = `${position.size}px ${position.font}`
      ctx.fillStyle = position.color

      let text = textInputComputed.value[0]?.[index] || `Text ${index + 1}`
      let textWidth = ctx.measureText(text).width
      let x = calcXCoordByTextAlign(position.x, textWidth, position.textAlign.id)
      ctx.fillText(text, x, position.y)
    })
  }
}

function confirmDownload(event) {
  confirm.require({
    target: event.currentTarget,
    message: 'Xác nhận tải ảnh?',
    header: 'Xác nhận',
    icon: 'pi pi-info-circle',
    rejectProps: {
      label: 'Hủy',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Tải'
    },
    accept: () => {
      handleDownloadImage()
    }
  })
}

function handleDownloadImage() {
  downloadCountRef.value = 0
  if (!validate(true)) {
    return
  }

  const image = new Image()
  image.src = URL.createObjectURL(fileSelectedRef.value)

  image.onload = async function () {
    for (const textInput of textInputComputed.value) {
      await downloadImage(image, textInput)
    }
    toast.add({
      severity: 'success',
      summary: 'Hoàn thành',
      detail: 'Tất cả ảnh đã được tải về',
      life: 3000
    })
  }
}

function downloadImage(image, textInput) {
  return new Promise((resolve) => {
    setTimeout(function () {
      const tempCanvas = document.createElement('canvas')
      const tempCtx = tempCanvas.getContext('2d')
      tempCanvas.width = image.width
      tempCanvas.height = image.height
      tempCtx.drawImage(image, 0, 0)
      positionsRef.value.forEach((position, index) => {
        tempCtx.font = `${position.size}px ${position.font}`
        tempCtx.fillStyle = position.color

        let text = textInput?.[index] || ''
        let textWidth = tempCtx.measureText(text).width
        let x = calcXCoordByTextAlign(position.x, textWidth, position.textAlign.id)
        tempCtx.fillText(text, x, position.y)
      })

      const link = document.createElement('a')
      link.href = tempCanvas.toDataURL()
      link.download = `${textInput}.png`
      link.click()

      downloadCountRef.value++

      return resolve()
    }, 500)
  })
}

function calcXCoordByTextAlign(x, textWidth, textAlignId) {
  if (textAlignId === 'center') {
    x = x - textWidth / 2
  } else if (textAlignId === 'right') {
    x = x - textWidth
  }
  return x
}

function handleAddPosition() {
  positionsRef.value.push({ ...positionDefault })
}

function handlePositionPicker(event) {
  let { xOriginal, yOriginal } = calcMouseCoordinates(event)

  positionsRef.value[positionSelectedRef.value].x = xOriginal
  positionsRef.value[positionSelectedRef.value].y = yOriginal
  visibleImagePickerRef.value = false
}

function handleRemovePosition(index) {
  positionsRef.value.splice(index, 1)
}

let ctxImagePickerDraw
async function handlePickPosition(index) {
  if (!fileSelectedRef.value) {
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Chưa Chọn File', life: 3000 })
    return false
  }
  visibleImagePickerRef.value = true
  positionSelectedRef.value = index
  await nextTick()
  imagePickerRef.value.src = URL.createObjectURL(fileSelectedRef.value)

  let ctx = imagePickerRef.value.getContext('2d')
  ctxImagePickerDraw = imagePickerDrawRef.value.getContext('2d')

  const image = new Image()
  image.src = URL.createObjectURL(fileSelectedRef.value)
  image.onload = function () {
    imagePickerRef.value.width = image.width
    imagePickerRef.value.height = image.height

    imagePickerDrawRef.value.width = image.width
    imagePickerDrawRef.value.height = image.height
    ctx.drawImage(image, 0, 0)
  }
}

function handleMouseMoveDrawText(event) {
  let { xOriginal, yOriginal } = calcMouseCoordinates(event)
  let positionSelected = positionsRef.value[positionSelectedRef.value]
  if (imagePickerRef.value) {
    ctxImagePickerDraw.clearRect(0, 0, imagePickerRef.value.width, imagePickerRef.value.height)
    ctxImagePickerDraw.font = `${positionSelected.size}px ${positionSelected.font}`
    ctxImagePickerDraw.fillStyle = `${positionSelected.color}`

    let text =
      textInputComputed.value[0]?.[positionSelectedRef.value] ||
      `Text ${positionSelectedRef.value + 1}`
    let textWidth = ctxImagePickerDraw.measureText(text).width
    xOriginal = calcXCoordByTextAlign(xOriginal, textWidth, positionSelected?.textAlign?.id)
    ctxImagePickerDraw.fillText(text, xOriginal, yOriginal)
  }
}

function calcMouseCoordinates(event) {
  let element = event.target
  // Tính tỷ lệ thu nhỏ
  let rect = event.target.getBoundingClientRect()
  const scaleX = element.width / rect.width
  const scaleY = element.height / rect.height

  // Tính tọa độ thật
  const xOriginal = Math.ceil((event.clientX - rect.left) * scaleX)
  const yOriginal = Math.ceil((event.clientY - rect.top) * scaleY)

  return { xOriginal, yOriginal }
}
</script>

<template>
  <Toast />

  <div class="container mt-5 mx-auto shadow rounded-md bg-white p-5">
    <h2 class="text-center text-4xl font-bold mb-4">Chèn chữ vào ảnh</h2>
    <div class="w-full">
      <input class="mb-4" type="file" accept="image/*" @change="fileChange" />

      <div class="w-full mb-4">
        <Textarea
          class="w-full whitespace-pre-line"
          v-model="textInputRef"
          rows="5"
          placeholder="Muốn tạo nhiều ảnh thì mỗi ảnh là 1 dòng text. Các vị trí sẽ được phân cách bằng dấu |
          Ví dụ:
      anh A|Mời anh
      chị B|Mời chị"
        />
      </div>

      <div class="grid grid-cols-1 gap-3 mb-3">
        <div
          class="flex gap-3 items-center flex-wrap"
          v-for="(position, index) in positionsRef"
          :key="index"
        >
          <span class="font-bold block"> Vị trí {{ index + 1 }} </span>
          <InputNumber v-model.number="position.x" showButtons inputClass="w-[100px]" :min="0" />

          <InputNumber v-model.number="position.y" showButtons inputClass="w-[100px]" :min="0" />

          <InputNumber v-model.number="position.size" showButtons inputClass="w-[75px]" :min="1" />

          <Select v-model="position.font" :options="fonts" class="w-[195px]" />

          <input
            type="color"
            v-model.lazy="position.color"
            class="block h-[40px] px-2 py-1 w-[45px]"
          />

          <Select
            v-model="position.textAlign"
            :options="textAligns"
            class="w-[105px]"
            optionLabel="label"
          />

          <Button
            class="w-[150px]"
            icon="pi pi-map-marker"
            severity="secondary"
            @click="handlePickPosition(index)"
            v-tooltip.top="'Chọn tọa độ'"
            outlined
          />
          <Button
            v-if="index > 0"
            class="w-[150px]"
            icon="pi pi-times"
            severity="danger"
            @click="handleRemovePosition(index)"
            outlined
          />
        </div>
        <div>
          <Button
            class="w-[150px] mr-5"
            label="Thêm vị trí"
            icon="pi pi-plus"
            severity="success"
            @click="handleAddPosition"
          />
          <Button label="Tải ảnh" severity="info" @click="confirmDownload" class="!px-5" />
        </div>
      </div>
      <ProgressBar
        :value="Math.ceil((downloadCountRef / textInputComputed.length) * 100)"
        class="w-full mt-4"
        v-if="downloadCountRef"
      >
        Đang tải {{ downloadCountRef }} / {{ textInputComputed.length }} ảnh...
      </ProgressBar>
    </div>
    <div class="w-full">
      <p class="font-bold">Xem trước</p>
      <canvas class="w-full border h-auto max-w-screen-lg mx-auto" ref="canvasRef">Preview</canvas>
    </div>
  </div>

  <Drawer
    v-model:visible="visibleImagePickerRef"
    header="Chọn tọa độ"
    position="full"
    class="drawer-custom"
  >
    <div class="relative">
      <canvas ref="imagePickerRef" class="w-full h-auto max-w-screen-lg" />
      <canvas
        ref="imagePickerDrawRef"
        class="w-full h-auto max-w-screen-lg absolute top-0 left-0"
        @mousemove="handleMouseMoveDrawText"
        @click="handlePositionPicker"
      ></canvas>
    </div>
  </Drawer>

  <ConfirmPopup></ConfirmPopup>
</template>

<style>
.drawer-custom.p-drawer {
  background: #f2f2f2;
}
</style>
