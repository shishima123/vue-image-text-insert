<script setup>
import { ref, computed, watch, nextTick } from 'vue'

import { useToast } from 'primevue/usetoast'
const toast = useToast()

const textInputRef = ref()
const canvasRef = ref()
const downloadCountRef = ref(0)
const fileSelectedRef = ref()
const positionsRef = ref([{ x: 0, y: 0, size: 100, font: 'DFVNHelloHoney', color: '#ff0000' }])
const positionSelectedRef = ref()
const visibleImagePickerRef = ref(false)
const imagePickerRef = ref()
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
      ctx.fillText(
        textInputComputed.value[0]?.[index] || `Text ${index + 1}`,
        position.x,
        position.y
      )
    })
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
    toast.add({
      severity: 'success',
      summary: 'Hoàn thành',
      detail: 'Tất cả ảnh đã được tải về',
      life: 3000
    })
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
      positionsRef.value.forEach((position, index) => {
        tempCtx.font = `${position.size}px ${position.font}`
        tempCtx.fillStyle = position.color
        tempCtx.fillText(textInput?.[index] || '', position.x, position.y)
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

function handleAddPosition() {
  positionsRef.value.push({
    x: 0,
    y: 0,
    size: 50,
    font: 'DFVNHelloHoney',
    color: '#ff0000'
  })
}

function handleMouseMove(event) {
  positionsRef.value[positionSelectedRef.value].x = event.pageX - event.target.offsetLeft
  positionsRef.value[positionSelectedRef.value].y = event.pageY - event.target.offsetTop
  visibleImagePickerRef.value = false
}

async function handlePickPosition(index) {
  if (!fileSelectedRef.value) {
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Chưa Chọn File', life: 3000 })
    return false
  }
  visibleImagePickerRef.value = true
  positionSelectedRef.value = index
  await nextTick()
  imagePickerRef.value.src = URL.createObjectURL(fileSelectedRef.value)
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

      <div class="grid grid-cols-1 gap-3 mb-3">
        <div
          class="flex gap-3 items-center flex-wrap"
          v-for="(position, index) in positionsRef"
          :key="index"
        >
          <span class="font-bold block"> Vị trí {{ index + 1 }} </span>
          <InputNumber
            id="xCoord"
            v-model.number="position.x"
            showButtons
            inputClass="w-[100px]"
            :min="0"
          />

          <InputNumber
            id="yCoord"
            v-model.number="position.y"
            showButtons
            inputClass="w-[100px]"
            :min="0"
          />

          <InputNumber
            id="fontSize"
            v-model.number="position.size"
            showButtons
            inputClass="w-[75px]"
            :min="1"
          />

          <Select id="fontFamily" v-model="position.font" :options="fonts" class="w-[220px]" />

          <input
            id="color"
            type="color"
            v-model.lazy="position.color"
            class="block h-[40px] px-2 py-1 w-[70px]"
          />

          <Button
            class="w-[150px]"
            icon="pi pi-map-marker"
            severity="secondary"
            @click="handlePickPosition(index)"
            v-tooltip.top="'Chọn tọa độ'"
          />
        </div>
        <div class="text-right">
          <Button
            class="w-[150px]"
            label="Thêm vị trí"
            icon="pi pi-plus"
            severity="success"
            @click="handleAddPosition"
          />
        </div>
      </div>

      <div class="mt-4 text-center">
        <Button label="Tải ảnh" severity="info" @click="download" class="!px-5" />
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
      <p>Xem trước</p>
      <canvas class="w-full border h-auto" ref="canvasRef">Preview</canvas>
    </div>
  </div>

  <Drawer
    v-model:visible="visibleImagePickerRef"
    header="Chọn tọa độ"
    position="full"
    class="drawer-custom"
  >
    <img
      src="#"
      ref="imagePickerRef"
      class="h-full w-auto mx-auto cursor-crosshair shadow"
      @click="handleMouseMove"
    />
  </Drawer>
</template>

<style>
.drawer-custom.p-drawer {
  background: #f2f2f2;
}
</style>
