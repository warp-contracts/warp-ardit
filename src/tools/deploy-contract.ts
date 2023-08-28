import fs from 'fs';
import path from 'path';
import { Tag, WarpFactory } from "warp-contracts";
import {ArweaveSigner, DeployPlugin} from "warp-contracts-plugin-deploy";

(async () => {
  // Arweave and Warp initialization
  const warp = WarpFactory.forMainnet().use(new DeployPlugin());
  const arweave = warp.arweave;

  // Loading contract source and initial state from files
  const contractSrc = fs.readFileSync(path.join(__dirname, '../../dist/contract.js'), 'utf8');
  const jwk = await arweave.wallets.generate();
  const walletAddress = await arweave.wallets.jwkToAddress(jwk);

  const initialState = {
    description: 'Webinar token',
    settings: null,
    symbol: 'Webinar',
    name: 'Webinar',
    decimals: '',
    totalSupply: 100,
    balances: {
      [walletAddress]: 100,
    },
    allowances: {},
    owner: walletAddress,
    canEvolve: true,
    evolve: '',
    votes: { status: 0, addresses: [] },
  };

  // Deploying contract
  console.log('Deployment started');
  const { contractTxId } = await warp.deploy({
    wallet: new ArweaveSigner(jwk),
    initState: JSON.stringify(initialState),
    src: contractSrc,
    data: { 'Content-Type': 'text/html', body: 'HELLO WORLD' },
    tags: [new Tag('Indexed-By', 'test-tag-ardit')]
  });
  console.log("Deployment completed: " + contractTxId);
})();
