<template>
  <div class="mb-5">
    <h1 class="mt-3 mt-md-5">ArDit</h1>
    <div>
      <span class="d-md-block d-none mb-5"
        >Source tx id:
        <a :href="`https://sonar.warp.cc/#/app/source/${srcTxId}`" target="_blank">{{ srcTxId }}</a></span
      ><span class="d-block d-md-none">Source tx id: {{ srcTxId | tx }}</span>
    </div>
    <input type="text" placeholder="Content" ref="content" />
    <button @click="addContent" class="mint">Add new content</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { deployedContracts } from '../../deployed-contracts';
import { ArweaveSigner } from "warp-contracts-plugin-deploy";
import { Tag } from "warp-contracts";
import {indexingTag} from "@/constants";
export default Vue.extend({
  name: 'Header',
  data() {
    return {
      srcTxId: 'Z1yUWTeXEiy0J8vIG0VC2D5J39WxejPxq83Se1up8so',
    };
  },
  methods: {
    async addContent() {
      if (!this.$refs.content.value) {
        return;
      }
      this.$toasted.show('Processing...');
      const initialState = {
        description: 'NFT-based Arweave social app',
        settings: null,
        symbol: 'ARDIT',
        name: 'ArDit',
        decimals: '',
        totalSupply: 100,
        balances: {
          [this.walletAddress]: 100,
        },
        allowances: {},
        owner: this.walletAddress,
        canEvolve: true,
        evolve: '',
        votes: { status: 0, addresses: [] },
      };
      const { contractTxId } = await this.warp.deployFromSourceTx({
        wallet: new ArweaveSigner(this.wallet),
        initState: JSON.stringify(initialState),
        srcTxId: this.srcTxId,
        data: { 'Content-Type': 'text/html', body: `${this.$refs.content.value}` },
        tags: [new Tag('Indexed-By', indexingTag)]
      });
      const contract = this.warp.contract(contractTxId).connect(this.wallet);
      const { cachedValue } = await contract.readState();
      if (cachedValue) {
        this.$toasted.clear();
        this.$toasted.global.success('Processed!');
        this.$toasted.global.close(
          `<div>Contract id: <a href="https://sonar.warp.cc/#/app/contract/${contractTxId}" target="_blank">${contractTxId}</a></div>`
        );
      }

      this.$parent.updateContents();
      this.$refs.content.value = '';
    },
  },
  computed: {
    contractAddress() {
      return deployedContracts.fc;
    },
    ...mapState(['arweave', 'walletAddress', 'wallet', 'warp']),
  },
});
</script>

<style lang="scss" src="./Header.scss"></style>
