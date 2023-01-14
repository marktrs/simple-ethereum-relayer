import { Card, Grid, Text } from "@nextui-org/react";
import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { Web3ReactHooks } from "@web3-react/core";
import { GnosisSafe } from "@web3-react/gnosis-safe";
import { MetaMask } from "@web3-react/metamask";
import { Network } from "@web3-react/network";
import { WalletConnect } from "@web3-react/walletconnect";
import React from "react";
import { getName } from "../blockchain/utils";
import { Accounts } from "./Accounts";
import { Chain } from "./Chain";
import { ConnectWithSelect } from "./ConnectWithSelect";
import { Status } from "./Status";

interface Props {
  connector: MetaMask | WalletConnect | CoinbaseWallet | Network | GnosisSafe;
  chainId: ReturnType<Web3ReactHooks["useChainId"]>;
  isActivating: ReturnType<Web3ReactHooks["useIsActivating"]>;
  isActive: ReturnType<Web3ReactHooks["useIsActive"]>;
  error: Error | undefined;
  setError: React.Dispatch<React.SetStateAction<undefined>>;
  ENSNames: ReturnType<Web3ReactHooks["useENSNames"]>;
  provider?: ReturnType<Web3ReactHooks["useProvider"]>;
  accounts?: string[];
}

export function ConnectorCard({
  connector,
  chainId,
  isActivating,
  isActive,
  error,
  setError,
  ENSNames,
  accounts,
  provider,
}: Props) {
  return (
    <>
      <Card>
        <Card.Header>
          <Grid.Container justify="space-between" gap={2}>
            <Grid>
              <Text b>{getName(connector)}</Text>
            </Grid>
            <Grid>
              <Status
                isActivating={isActivating}
                isActive={isActive}
                error={error}
              />
            </Grid>
          </Grid.Container>
        </Card.Header>
        <Card.Divider />
        <Card.Body>
          <Grid.Container gap={2} justify="space-between">
            <Grid xs={12}>
              <Chain chainId={chainId} />
            </Grid>
            <Grid xs={12}>
              <Accounts
                accounts={accounts}
                provider={provider}
                ENSNames={ENSNames}
              />
            </Grid>
            <Grid xs={12}>
              <ConnectWithSelect
                connector={connector}
                chainId={chainId}
                isActivating={isActivating}
                isActive={isActive}
                error={error}
                setError={setError}
              />
            </Grid>
          </Grid.Container>
        </Card.Body>
      </Card>
    </>
  );
}
