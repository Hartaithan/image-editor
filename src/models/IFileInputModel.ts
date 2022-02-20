export interface IEventFiles extends EventTarget {
  files: HTMLInputElement;
}

export interface IEventFileInput extends Event {
  target: HTMLInputElement & IEventFiles;
}
