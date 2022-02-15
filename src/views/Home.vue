<template>
  <div class="home">
    <p v-if="!img">Изображение не добавлено</p>
    <div class="home__wrapper">
      <canvas class="home__canvas" v-if="img" ref="canvas" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "@/store";
import { MutationType } from "@/models/storeModel";

export default defineComponent({
  setup() {
    const store = useStore();
    const canvas = ref<HTMLCanvasElement | null>(null);

    document.onpaste = (e: ClipboardEvent) => {
      const data = e.clipboardData || (window as any).clipboardData;
      const file = data.files[0];
      store.commit(MutationType.SetImage, file);
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = function () {
        if (canvas.value) {
          console.log("width and heigth", image.width, image.height);
          canvas.value.width = image.width;
          canvas.value.height = image.height;
          var ctx = canvas.value.getContext("2d");
          ctx?.drawImage(image, 0, 0);
        }
      };
    };

    return {
      img: computed(() => store.state.imgUrl),
      canvas,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../styles/home.scss";
</style>
