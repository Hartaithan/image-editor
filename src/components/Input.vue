<template>
  <input class="input" name="myFile" type="file" ref="inputRef" @change="handleInput" />
</template>

<script setup lang="ts">
import { ref, defineEmits, defineExpose } from "vue";
import { useStore } from "@/store";
import { MutationType } from "@/models/storeModel";
import { IInputMethods } from "@/models/inputModel";

const store = useStore();
const inputRef = ref<HTMLInputElement | null>(null);

const emit = defineEmits<{
  (e: "wrapImageInCanvas", file: Blob): void;
}>();

const triggerInput = () => {
  if (inputRef.value) {
    inputRef.value.click();
  }
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const blob: File = (target.files as FileList)[0];
  store.commit(MutationType.SetImage, blob);
  emit("wrapImageInCanvas", blob);
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  const blob: File | undefined = event.dataTransfer?.files[0];
  if (blob) {
    store.commit(MutationType.SetImage, blob);
    emit("wrapImageInCanvas", blob);
  }
  (event.target as HTMLInputElement).classList.remove('on-drag');
};

const handleDragOver = (event: Event) => {
  event.preventDefault();
};

const handleDragEnter = (event: Event) => {
  const target = event.target as HTMLInputElement;
  target.classList.add('on-drag');
};

const handleDragLeave = (event: Event) => {
  const target = event.target as HTMLInputElement;
  target.classList.remove('on-drag');
};

defineExpose<IInputMethods>({
  inputRef,
  handleInput,
  triggerInput,
  handleDrop,
  handleDragOver,
  handleDragEnter,
  handleDragLeave,
});
</script>

<style lang="scss" scoped>
.input {
  display: none;
}
</style>
