import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import SwapCard from "../components/SwapCard";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Minima Workshop</title>
        <meta
          name="description"
          content="Workshop for minima integration on AVAX"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <SwapCard />
      </main>
    </div>
  );
};

export default Home;
