<template>
  <header>
    <Dropzone @click="handlers.triggerInput" @drop="handlers.handleDrop" @dragover="handlers.handleDragOver"
      @dragenter="handlers.handleDragEnter" @dragleave="handlers.handleDragLeave" />
    <Download @downloadCanvas="downloadCanvas" />
    <Input ref="input" @wrapImageInCanvas="wrapImageInCanvas" />
  </header>
  <div class="wrapper" ref="wrapper">
    <p v-if="!img">Image not added</p>
    <canvas class="canvas" v-if="img" ref="canvas" @mousedown="startDrawing" @mouseup="finishDrawing"
      @mousemove="drawing" @touchstart="startDrawing" @touchend="finishDrawing" @touchmove="drawing" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useStore } from "@/store";
import { MutationType } from "@/models/storeModel";
import { IInputMethods } from "@/models/inputModel";
import Input from "./components/Input.vue";
import Dropzone from "./components/Dropzone.vue";
import Download from "./components/Download.vue";

const store = useStore();
const img = computed(() => store.state.imgUrl);
const wrapper = ref<HTMLDivElement | null>(null);
const input = ref<IInputMethods | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const isDrawing = ref<boolean>(false);

let multipleX = 1;
let multipleY = 1;

let wrapperX = 1080;
let wrapperY = 839;

onMounted(() => {
  if (wrapper.value) {
    wrapperX = wrapper.value.clientWidth;
    wrapperY = wrapper.value.clientHeight;
  }
});

const wrapImageInCanvas = (file: Blob) => {
  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = function () {
    if (canvas.value) {
      if (image.width > wrapperX && image.height > wrapperY) {
        if (image.width > image.height) {
          multipleX = image.width / wrapperX;
          multipleY = wrapperY / (wrapperY / (image.width / wrapperX));
        } else {
          multipleX = wrapperX / (wrapperX / (image.height / wrapperY));
          multipleY = image.height / wrapperY;
        }
      }
      canvas.value.width = image.width;
      canvas.value.height = image.height;
      ctx.value = canvas.value.getContext("2d");
      if (ctx.value) {
        ctx.value.drawImage(image, 0, 0);
        ctx.value.lineCap = "round";
        ctx.value.strokeStyle = "red";
        ctx.value.lineWidth = 10;
      }
    }
  };
};

document.onpaste = (e: ClipboardEvent) => {
  const data = e.clipboardData || (window as any).clipboardData;
  const file = data.files[0];
  store.commit(MutationType.SetImage, file);
  wrapImageInCanvas(file);
};

document.oncopy = () => {
  if (canvas.value) {
    canvas.value.toBlob((blob: Blob | null) => {
      blob !== null && navigator.clipboard.write([
        new window.ClipboardItem({
          [blob.type]: blob
        })
      ]);
    });
  }
};

const startDrawing = (event: MouseEvent | TouchEvent) => {
  if (ctx.value) {
    isDrawing.value = true;
    if (event instanceof MouseEvent) {
      const { offsetX, offsetY } = event;
      ctx.value.beginPath();
      ctx.value.moveTo(offsetX * multipleX, offsetY * multipleY);
    }
    if (event instanceof TouchEvent) {
      const { pageX, pageY } = event.changedTouches[0];
      ctx.value.beginPath();
      ctx.value.moveTo(pageX * multipleX, pageY * multipleY);
    }
  }
};

const drawing = (event: MouseEvent | TouchEvent) => {
  if (!isDrawing.value) {
    return;
  }
  if (ctx.value) {
    if (event instanceof MouseEvent) {
      const { offsetX, offsetY } = event;
      ctx.value.lineTo(offsetX * multipleX, offsetY * multipleY);
      ctx.value.stroke();
    }
    if (event instanceof TouchEvent) {
      const { pageX, pageY } = event.changedTouches[0];
      ctx.value.lineTo(pageX * multipleX, pageY * multipleY);
      ctx.value.stroke();
    }
  }
};

const finishDrawing = () => {
  if (ctx.value) {
    ctx.value.closePath();
    isDrawing.value = false;
  }
};

const downloadCanvas = () => {
  if (canvas.value) {
    const link = document.createElement("a");
    link.href = canvas.value.toDataURL();
    link.setAttribute("visibility", "hidden");
    link.download = "image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const handlers = {
  handleInput: (event: Event) => input.value && input.value.handleInput(event),
  triggerInput: () => input.value && input.value.triggerInput(),
  handleDrop: (event: DragEvent) => input.value && input.value.handleDrop(event),
  handleDragOver: (event: DragEvent) => input.value && input.value.handleDragOver(event),
  handleDragEnter: (event: DragEvent) => input.value && input.value.handleDragEnter(event),
  handleDragLeave: (event: DragEvent) => input.value && input.value.handleDragLeave(event),
};
</script>

<style lang="scss" scoped>
@import "@/assets/colors.scss";

.wrapper {
  flex-grow: 1;
  width: 100%;
  height: calc(100% - 90px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.canvas {
  max-width: 100%;
  max-height: 100%;
}

header {
  height: 80px;
  min-height: 80px;
  width: 100%;
  margin: 0 auto;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: $c-element;
  border-radius: 8px;
  padding: 8px;
}
</style>
