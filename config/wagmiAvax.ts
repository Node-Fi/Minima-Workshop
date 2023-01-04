import { Chain } from "@rainbow-me/rainbowkit";

export const avalancheChain: Chain = {
  id: 43_114,
  name: "Avalanche",
  network: "avalanche",
  nativeCurrency: {
    decimals: 18,
    name: "Avalanche",
    symbol: "AVAX",
  },
  rpcUrls: {
    default: "https://api.avax.network/ext/bc/C/rpc",
  },
  blockExplorers: {
    default: { name: "SnowTrace", url: "https://snowtrace.io" },
  },
  testnet: false,
};



export const fujiChain: Chain = {
  id: 43_113,
  name: "Fuji",
  network: "fuji",
  nativeCurrency: {
    decimals: 18,
    name: "Avalanche",
    symbol: "AVAX",
  },
  rpcUrls: {
    default: "https://api.avax-test.network/ext/bc/C/rpc",
  },
  blockExplorers: {
    default: { name: "SnowTrace", url: "https://testnet.snowtrace.io/" },
  },
  testnet: true,
};

export const celoChain: Chain = {
  id: 42220,
  name: "Celo",
  network: "celo",
  nativeCurrency: {
    decimals: 18,
    name: "Celo native asset",
    symbol: "CELO",
  },
  rpcUrls: {
    default: "https://forno.celo.org",
  },
  blockExplorers: {
    default: { name: "blockscout", url: "https://explorer.celo.org/" },
  },
  testnet: true,
};