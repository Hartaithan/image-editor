export interface IEventFiles extends EventTarget {
  files: HTMLInputElement;
}

export interface IEventHeader extends Event {
  target: HTMLInputElement & IEventFiles;
}
