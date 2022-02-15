import { CommitOptions, Store as VuexStore } from "vuex";

export type Store = Omit<VuexStore<State>, "commit"> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>;
};

export type State = {
  imgBlob: Blob | null;
  imgUrl: string | null;
};

export enum MutationType {
  SetImage = "SET_IMAGE",
}

export type Mutations = {
  [MutationType.SetImage](state: State, img: Blob): void;
};
