import type { BigNumber } from "@ethersproject/bignumber";
import { Spacer, Text } from "@nextui-org/react";
import type { Web3ReactHooks } from "@web3-react/core";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";

function useBalances(
  provider?: ReturnType<Web3ReactHooks["useProvider"]>,
  accounts?: string[]
): BigNumber[] | undefined {
  const [balances, setBalances] = useState<BigNumber[] | undefined>();

  useEffect(() => {
    if (provider && accounts?.length) {
      let stale = false;

      void Promise.all(
        accounts.map((account) => provider.getBalance(account))
      ).then((balances) => {
        if (stale) return;
        setBalances(balances);
      });

      return () => {
        stale = true;
        setBalances(undefined);
      };
    }
  }, [provider, accounts]);

  return balances;
}

export function Accounts({
  accounts,
  provider,
  ENSNames,
}: {
  accounts: ReturnType<Web3ReactHooks["useAccounts"]>;
  provider: ReturnType<Web3ReactHooks["useProvider"]>;
  ENSNames: ReturnType<Web3ReactHooks["useENSNames"]>;
}) {
  const balances = useBalances(provider, accounts);

  if (accounts === undefined) return null;

  return (
    <>
      <Text b>Account</Text>
      {accounts.length === 0
        ? "None"
        : accounts?.map((account, i) => (
            <>
              <Text css={{ overflowWrap: "anywhere" }}>
                {ENSNames?.[i] ?? account}
              </Text>
              <Spacer></Spacer>
              <Text b>ETH Balance</Text>
              <Text css={{ overflowWrap: "anywhere" }}>
                {balances?.[i]
                  ? `${ethers.utils.formatUnits(balances[i], 18)}`
                  : null}
              </Text>
            </>
          ))}
    </>
  );
}
