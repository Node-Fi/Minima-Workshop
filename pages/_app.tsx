import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import {
  RainbowKitProvider,
  getDefaultWallets,
  ConnectButton,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { avalancheChain, fujiChain } from "../config/wagmiAvax";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { AppShell, Header, MantineProvider } from "@mantine/core";

const { provider, chains } = configureChains(
  [avalancheChain, fujiChain],
  [jsonRpcProvider({ rpc: (chain) => ({ http: chain.rpcUrls.default }) })]
);

const { connectors } = getDefaultWallets({
  appName: "RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme: "light",
          }}
        >
          <AppShell
            header={
              <Header height={70} p="md">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <ConnectButton />
                </div>
              </Header>
            }
          >
            <Component {...pageProps} />
          </AppShell>
        </MantineProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
