<template>
  <div>
    <div v-show="!loaded" class="loader">
      <pacman-loader :loading="!loaded" :color="color"></pacman-loader>
    </div>
    <ul class="balances-list" v-if="loaded">
      <li v-for="state in contents" :key="state.contract_tx_id" class="mt-3 mb-5">
        <div class="d-flex justify-content-center">
          <div class="contract-data">
            <h3>{{ state.contract_data }}</h3>
            <div>
              Contract tx id:
              <a :href="`https://sonar.warp.cc/#/app/contract/${state.contract_tx_id}`" target="_blank">{{
                state.contract_tx_id
              }}</a>
            </div>

            <div class="address">
              <span class="d-none d-lg-block"
                >Creator:
                <a :href="`https://viewblock.io/arweave/address/${state.state.owner}`" target="_blank">{{
                  state.state.owner
                }}</a></span
              ><span class="d-block d-lg-none"
                >Creator:
                <a :href="`https://viewblock.io/arweave/address/${state.state.owner}`" target="_blank">{{
                  state.state.owner | tx
                }}</a></span
              >
            </div>
          </div>
          <div class="thumbs">
            <div class="">
              <img
                class="img-thumb mb-2"
                src="../../assets/thumbs-up.svg"
                @click="upVote(state.contract_tx_id, state.state.votes)"
              />
            </div>
            <div class="">
              <img
                class="img-thumb mt-2"
                src="../../assets/thumbs-down.svg"
                @click="downVote(state.contract_tx_id, state.state.votes)"
              />
            </div>
          </div>
          <div class="status">
            {{ '-' }}
          </div>
        </div>
        <div></div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import PacmanLoader from 'vue-spinner/src/PacmanLoader.vue';

export default Vue.extend({
  name: 'Contents',
  props: {
    loading: Boolean,
  },
  data() {
    return {
      color: '#c0fdff',
      loaded: false,
      dates: [],
    };
  },
  components: {
    PacmanLoader,
  },
  watch: {
    contents: async function () {
      this.loaded = !!this.contents;
    },
    loading: function () {
      this.loaded = !this.loading;
    },
  },
  methods: {
    async vote(contractId: string, votes: any, interaction: string) {
        // TODO: implement vote
    },
    async upVote(contractId: string, votes: any) {
      await this.vote(contractId, votes, 'upVoteMessage');
    },
    async downVote(contractId: string, votes: any) {
      await this.vote(contractId, votes, 'downVoteMessage');
    },
  },
  computed: {
    contents() {
      return this.states;
    },
    ...mapState(['states', 'contract', 'arweave', 'walletAddress', 'warp', 'wallet']),
  },
});
</script>

<style lang="scss" src="./Contents.scss" scoped></style>
