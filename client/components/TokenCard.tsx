import {
  Badge,
  Button,
  Card,
  Grid,
  Input,
  Spacer,
  Text,
  useInput,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { getTokenBalance, transferTokensMeta } from "../blockchain/token";
import contractAddress from "../contracts/contract-address.json";
import TokenArtifact from "../contracts/TargetToken.json";
import { hooks, metaMask } from "../connectors/metaMask";

const { useProvider } = hooks;

export default function TokenCard(): React.ReactElement {
  const provider = useProvider();

  const {
    value: recipientAddress,
    reset: clearRecipientAddress,
    bindings: recipientAddressBinding,
  } = useInput("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");

  let {
    value: amount,
    setValue: setAmount,
    reset: clearAmount,
    bindings: amountBinding,
  } = useInput("100");

  const [balance, setBalance] = useState(0);
  const [contractFound, setContractFound] = useState(false);

  const onSend = async () => {
    await transferTokensMeta(recipientAddress, amount, window.ethereum);
  };

  amountBinding.onChange = (e: any) => {
    let value = e.target.value;
    if (Math.floor(value) != value) {
      value = Math.floor(value).toString();
    }
    setAmount(value);
  };

  useEffect(() => {
    setInterval(async () => {
      try {
        const response = await getTokenBalance(window.ethereum);
        if (response) {
          setBalance(parseInt(response));
          setContractFound(true);
        }
      } catch (error) {
        setContractFound(false);
      }
    }, 1000);
  });

  return (
    <>
      <Card>
        <Card.Header>
          <Grid.Container justify="space-between" gap={2}>
            <Grid>
              <Text b>TGT Token</Text>
            </Grid>
            <Grid>
              {contractFound ? (
                <Badge color="success">Connected</Badge>
              ) : (
                <Badge color="warning" variant="points">
                  Contract Not Found
                </Badge>
              )}
            </Grid>
          </Grid.Container>
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
              <Text>{contractFound ? balance : "..."}</Text>
              <Text color="error">
                {contractFound && balance == 0
                  ? "To get TGT tokens use ' yarn faucet -- <your-address> '"
                  : ""}
              </Text>
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
                type="number"
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
            disabled={
              !recipientAddress || !amount || balance == 0 || !contractFound
            }
          >
            Send
          </Button>
        </Card.Footer>
      </Card>
    </>
  );
}
