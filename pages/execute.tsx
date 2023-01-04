import type { NextPage } from "next";
import Head from "next/head";
import ExecuteTxnCard from "../components/ExecuteTxnCard";
import styles from "../styles/Home.module.css";

const Execute: NextPage = () => {
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
      <ExecuteTxnCard />
      </main>
    </div>
  );
};

export default Execute;