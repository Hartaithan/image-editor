import { MutationTree } from "vuex";
import { Mutations, MutationType, State } from "../models/storeModel";

export const mutations: MutationTree<State> & Mutations = {
  [MutationType.SetImage](state, img) {
    state.img = img;
  },
};
