import { createLogger, createStore } from "vuex";
import { mutations } from "./mutations";
import { State, Store } from "../models/storeModel";
import { state } from "./state";

export const store = createStore<State>({
  plugins: process.env.NODE_ENV === "development" ? [createLogger()] : [],
  state,
  mutations,
  actions: {},
  modules: {},
});

export function useStore(): Store {
  return store as Store;
}
