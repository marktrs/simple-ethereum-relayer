import { Text } from "@nextui-org/react";
import type { Web3ReactHooks } from "@web3-react/core";
import React from "react";
import { CHAINS } from "../blockchain/chains";

export function Chain({
  chainId,
}: {
  chainId: ReturnType<Web3ReactHooks["useChainId"]>;
}) {
  if (chainId === undefined) return null;

  const name = chainId ? CHAINS[chainId]?.name : undefined;

  if (name) {
    return (
      <div>
        <Text b>Chain Id</Text>
        <Text>
          {name} ({chainId})
        </Text>
      </div>
    );
  }

  return (
    <div>
      <Text b>Chain Id</Text>
      <Text>{chainId}</Text>
    </div>
  );
}
