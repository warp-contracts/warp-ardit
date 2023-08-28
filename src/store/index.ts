import Vue from 'vue';
import Vuex from 'vuex';
import { arweave, warp } from '../environment';
import axios from 'axios';
import {indexingTag} from "@/constants";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    arweave,
    warp,
    states: {},
    contract: null,
    walletAddress: null,
    wallet: null,
  },
  mutations: {
    setStates(state, swState) {
      state.states = swState;
    },
    setContract(state, contract) {
      state.contract = contract;
    },
    setWalletAddress(state, walletAddress) {
      state.walletAddress = walletAddress;
    },
    setWallet(state, wallet) {
      state.wallet = wallet;
    },
  },
  actions: {
    async loadState({ commit }) {
      const wallet = await arweave.wallets.generate();
      const walletAddress = await arweave.wallets.jwkToAddress(wallet);
      commit('setWalletAddress', walletAddress);
      commit('setWallet', wallet);
    },
    async loadStates({ commit }) {
      return axios
        .get(
          `https://contracts.warp.cc/all-states?index=${indexingTag}&orderBy=sort_key&order=desc`
        )
        .then(async (res) => {
          const contents = res.data.states;
          const response: any = await Promise.allSettled(
            contents.map(async (r: any) => {
              return await axios.get(`https://gateway.redstone.finance/gateway/contract-data/${r.contract_tx_id}`);
            })
          );
          contents.forEach((c, index) => {
            c.contract_data = response[index].value.data;
            c.state = JSON.parse(c.state);
          });
          commit('setStates', contents);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  modules: {},
});
