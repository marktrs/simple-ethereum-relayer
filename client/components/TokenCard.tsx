import {
  Button,
  Card,
  Grid,
  Input,
  Spacer,
  Text,
  useInput,
} from "@nextui-org/react";
import React, { useState } from "react";
import { getTokenBalance, transferTokensMeta } from "../blockchain/token";
import contractAddress from "../contracts/contract-address.json";
import TokenArtifact from "../contracts/TargetToken.json";

export default function TokenCard() {
  const {
    value: recipientAddress,
    reset: clearRecipientAddress,
    bindings: recipientAddressBinding,
  } = useInput("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");

  const {
    value: amount,
    reset: clearAmount,
    bindings: amountBinding,
  } = useInput("100");

  const [balance, setBalance] = useState(0);

  async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  };

  const onSend = async () => {
    await transferTokensMeta(recipientAddress, amount, window.ethereum);
  };

  setInterval(async () => {
    const response = await getTokenBalance(window.ethereum);
    setBalance(parseInt(response));
  }, 3000);

  return (
    <>
      <Card>
        <Card.Header>
          <Text b>Token</Text>
        </Card.Header>
        <Card.Divider />
        <Card.Body>
          <Grid.Container gap={2}>
            <Grid>
              <Text b>Name</Text>
              <Text>{TokenArtifact.contractName}</Text>
            </Grid>
            <Grid>
              <Text b>Address</Text>
              <Text css={{ overflowWrap: "anywhere" }}>
                {contractAddress.Token}
              </Text>
            </Grid>
            <Grid>
              <Text b>Balance</Text>
              <Text>{balance}</Text>
            </Grid>
          </Grid.Container>
          <Text b css={{ ml: 12 }}>
            Transfer
          </Text>
          <Spacer />
          <Grid.Container gap={1.5}>
            <Grid xs={12}>
              <Input
                fullWidth
                clearable
                bordered
                labelPlaceholder="To address"
                {...recipientAddressBinding}
                onClearClick={clearRecipientAddress}
              />
            </Grid>
            <Spacer />
            <Grid xs={12}>
              <Input
                fullWidth
                clearable
                bordered
                labelPlaceholder="Amount"
                {...amountBinding}
                onClearClick={clearAmount}
              />
            </Grid>
          </Grid.Container>
        </Card.Body>
        <Card.Footer>
          <Button
            css={{ width: "100%" }}
            onPress={onSend}
            disabled={!recipientAddress || !amount}
          >
            Send
          </Button>
        </Card.Footer>
      </Card>
    </>
  );
}
