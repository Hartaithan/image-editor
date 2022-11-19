<template>
  <div class="download" v-if="true">
    <button @click="emit('downloadCanvas')">Download</button>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from "vue";

const emit = defineEmits<{
  (e: "downloadCanvas"): void;
}>();
</script>

<style lang="scss" scoped>
@import "@/assets/colors.scss";

.download {
  flex: 2;
  height: 100%;
  width: 100%;
  margin-left: 10px;

  button {
    height: 100%;
    width: 100%;
    background: $c-inner-element;
    border: none;
    border-radius: 8px;
    font-size: 20px;
    font-weight: 500;
    cursor: pointer;

    &:hover {
      background: $c-inner-element-hover;
    }
  }
}
</style>