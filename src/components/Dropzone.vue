<template>
  <div class="dropzone">
    <UploadIcon />
    <div>
      <p>Drop you file here, or browse</p>
      <p>Supports only images</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import UploadIcon from './UploadIcon.vue';
</script>

<style lang="scss" scoped>
@import "@/assets/colors.scss";

.dropzone {
  flex: 8;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed $c-text-hover;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;

  * {
    pointer-events: none;
  }

  p {
    font-size: 14px;

    &:last-child {
      margin-top: 4px;
      font-size: 12px;
    }
  }
}
</style>