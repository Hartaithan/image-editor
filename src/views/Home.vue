<template>
  <div class="home">
    <Header @wrapImageInCanvas="wrapImageInCanvas" @downloadCanvas="downloadCanvas" />
    <div class="home__wrapper" ref="wrapper">
      <p v-if="!img">Изображение не добавлено</p>
      <canvas
        class="home__canvas"
        v-if="img"
        ref="canvas"
        @mousedown="startDrawing"
        @mouseup="finishDrawing"
        @mousemove="drawing"
        @touchstart="startDrawing"
        @touchend="finishDrawing"
        @touchmove="drawing"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "../components/Header.vue";
import { computed, onMounted, ref } from "vue";
import { useStore } from "@/store";
import { MutationType } from "@/models/storeModel";

const store = useStore();
const img = computed(() => store.state.imgUrl);
const wrapper = ref<HTMLDivElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const isDrawing = ref<boolean>(false);

let multipleX = 1;
let multipleY = 1;

let wrapperX = 1080;
let wrapperY = 839;

onMounted(() => {
  if (wrapper.value) {
    wrapperX = wrapper.value.clientWidth
    wrapperY = wrapper.value.clientHeight
  }
})

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
      ])
    })
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
</script>

<style lang="scss" scoped>
@import "../styles/home.scss";
</style>
