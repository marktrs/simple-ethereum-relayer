import { Badge } from "@nextui-org/react";
import type { Web3ReactHooks } from "@web3-react/core";
import React from "react";
export function Status({
  isActivating,
  isActive,
  error,
}: {
  isActivating: ReturnType<Web3ReactHooks["useIsActivating"]>;
  isActive: ReturnType<Web3ReactHooks["useIsActive"]>;
  error?: Error;
}) {
  return (
    <div>
      {error ? (
        <>
          <Badge color="error">
            {error.name ?? "Error"}
            {error.message ? `: ${error.message}` : null}
          </Badge>
        </>
      ) : isActivating ? (
        <Badge color="warning" variant="points" />
      ) : isActive ? (
        <Badge color="success">Connected</Badge>
      ) : (
        <>
          <Badge>Disconnected</Badge>
        </>
      )}
    </div>
  );
}
