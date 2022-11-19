import { Ref } from "vue";

export interface IInputMethods {
  inputRef: Ref<HTMLInputElement | null>;
  handleInput: (event: Event) => void;
  triggerInput: () => void;
  handleDrop: (event: DragEvent) => void;
  handleDragOver: (event: DragEvent) => void;
  handleDragEnter: (event: DragEvent) => void;
  handleDragLeave: (event: DragEvent) => void;
}
