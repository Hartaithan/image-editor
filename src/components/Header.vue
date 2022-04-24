<template>
  <div class="header">
    <div class="header__view">
      <div class="header__dropzone" @click="triggerInput" @drop="handleDrop" @dragover="handleDragOver"
        @dragenter="handleDragEnter" @dragleave="handleDragLeave">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          viewBox="0 0 512 512" xml:space="preserve">
          <path d="M21.333,21.333h213.333v96c0,5.867,4.8,10.667,10.667,10.667h96v74.667h21.333v-85.333c0-1.067-0.32-2.133-0.64-3.2
				c-0.107-0.32-0.107-0.533-0.213-0.853c-0.533-1.387-1.387-2.56-2.453-3.627L252.907,3.093C250.88,1.173,248.213,0,245.333,0
				H10.667C4.8,0,0,4.8,0,10.667v448c0,5.867,4.8,10.667,10.667,10.667H224V448H21.333V21.333z M256,36.48l70.187,70.187H256V36.48z
				" />
          <path d="M373.333,234.667c-76.587,0-138.667,62.08-138.667,138.667S296.747,512,373.333,512S512,449.92,512,373.333
				C511.893,296.747,449.92,234.773,373.333,234.667z M373.333,490.667C308.48,490.667,256,438.187,256,373.333
				S308.48,256,373.333,256s117.333,52.48,117.333,117.333C490.56,438.08,438.08,490.56,373.333,490.667z" />
          <path d="M412.8,377.173l-28.8,28.8v-90.56c0-5.333-3.84-10.133-9.067-10.88c-6.613-0.96-12.267,4.16-12.267,10.56v90.667
				l-28.587-28.587c-4.16-4.16-10.987-4.16-15.253,0c-4.16,4.16-4.16,10.987,0,15.253l46.933,46.933c4.16,4.16,10.987,4.16,15.253,0
				l46.933-46.933c4.16-4.267,4.053-11.093-0.213-15.253C423.573,373.12,416.96,373.12,412.8,377.173z" />
        </svg>
        <div>
          <p>Drop you file here, or browse</p>
          <p>Supports only images</p>
        </div>
      </div>
      <div class="header__download" v-if="true">
        <button @click="emit('downloadCanvas')">Download</button>
      </div>
    </div>
    <input class="header__input" name="myFile" type="file" ref="inputRef" @change="handleInput" />
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from "vue";
import { useStore } from "@/store";
import { MutationType } from "@/models/storeModel";

const store = useStore();
const inputRef = ref<HTMLInputElement | null>(null);

const emit = defineEmits<{
  (e: "wrapImageInCanvas", file: Blob): void;
  (e: "downloadCanvas"): void;
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
}

const handleDragOver = (event: Event) => {
  event.preventDefault();
}

const handleDragEnter = (event: Event) => {
  const target = event.target as HTMLInputElement;
  target.classList.add('on-drag');
}

const handleDragLeave = (event: Event) => {
  const target = event.target as HTMLInputElement;
  target.classList.remove('on-drag');
}
</script>

<style lang="scss" scoped>
@import "@/assets/colors.scss";

.header {
  height: 80px;
  min-height: 80px;
  width: 100%;
  margin: 0 auto;
  margin-bottom: 10px;

  &__view {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: $c-element;
    border-radius: 8px;
    padding: 8px;
  }

  &__dropzone {
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

    svg {
      width: 40px;
      fill: $c-text;
      margin-right: 16px;
    }

    p {
      font-size: 14px;

      &:last-child {
        margin-top: 4px;
        font-size: 12px;
      }
    }
  }

  &__input {
    display: none;
  }

  &__download {
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
}

.on-drag {
  border: 1px dashed $c-text;
  background: $c-element-hover;
}
</style>
