<template>
  <div class="home">
    <FileInput />
    <div class="home__wrapper">
      <p v-if="!img">Изображение не добавлено</p>
      <canvas
        class="home__canvas"
        v-if="img"
        ref="canvas"
        @mousedown="startDrawing"
        @mousemove="drawing"
        @mouseup="finishDrawing"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import FileInput from "../components/FileInput.vue";
import { computed, defineComponent, ref } from "vue";
import { useStore } from "@/store";
import { MutationType } from "@/models/storeModel";

const store = useStore();
const img = computed(() => store.state.imgUrl);
const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const isDrawing = ref<boolean>(false);

document.onpaste = (e: ClipboardEvent) => {
  const data = e.clipboardData || (window as any).clipboardData;
  const file = data.files[0];
  store.commit(MutationType.SetImage, file);
  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = function () {
    if (canvas.value) {
      canvas.value.width = image.width;
      canvas.value.height = image.height;
      ctx.value = canvas.value.getContext("2d");
      if (ctx.value) {
        ctx.value.drawImage(image, 0, 0);
        ctx.value.lineCap = "round";
        ctx.value.strokeStyle = "#000000";
        ctx.value.lineWidth = 1;
      }
    }
  };
};

const startDrawing = (event: MouseEvent) => {
  const { offsetX, offsetY } = event;
  if (ctx.value) {
    isDrawing.value = true;
    ctx.value.beginPath();
    ctx.value.moveTo(offsetX, offsetY);
  }
};

const drawing = (event: MouseEvent) => {
  if (!isDrawing.value) {
    return;
  }
  const { offsetX, offsetY } = event;
  if (ctx.value) {
    ctx.value.lineTo(offsetX, offsetY);
    ctx.value.stroke();
  }
};

const finishDrawing = () => {
  if (ctx.value) {
    ctx.value.closePath();
    isDrawing.value = false;
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/home.scss";
</style>
