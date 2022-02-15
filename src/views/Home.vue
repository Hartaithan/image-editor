<template>
  <div class="home">
    <img class="home__img" v-if="img" :src="img" />
    <p v-else>Изображение не добавлено</p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "@/store";
import { MutationType } from "@/models/storeModel";

export default defineComponent({
  setup() {
    const store = useStore();

    document.onpaste = (e: ClipboardEvent) => {
      const data = e.clipboardData || (window as any).clipboardData;
      const file = data.files[0];
      store.commit(MutationType.SetImage, file);
    };

    return {
      img: computed(() => store.state.imgUrl),
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../styles/home.scss";
</style>
