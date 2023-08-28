import { LoggerFactory, WarpFactory, Warp } from 'warp-contracts';
import { DeployPlugin } from "warp-contracts-plugin-deploy";

// Set up Warp instance for Arweave mainnet
LoggerFactory.INST.logLevel('debug');
export const warp: Warp = WarpFactory.forMainnet().use(new DeployPlugin());

// Set up Arweave client
export const arweave = warp.arweave;
