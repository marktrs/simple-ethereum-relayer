import { Container, Grid, Spacer } from "@nextui-org/react";
import Head from "next/head";
import React from "react";
import MetaMaskCard from "../components/connectorCards/MetaMaskCard";
import ProviderExample from "../components/ProviderExample";
import TokenCard from "../components/TokenCard";

export default function Home() {
  return (
    <>
      <Head>
        <title>Simple Ethereum Relayer App</title>
        <meta name="description" content="Simple Ethereum Relayer App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Spacer y={3} />
        <ProviderExample />
        <Grid.Container gap={2}>
          <Grid xs={12} md={4}>
            <MetaMaskCard />
          </Grid>
          <Grid xs={12} md={6}>
            <TokenCard />
          </Grid>
        </Grid.Container>
      </Container>
    </>
  );
}
