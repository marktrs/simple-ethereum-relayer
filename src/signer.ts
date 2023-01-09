import { signTypedMessage } from "eth-sig-util";

const EIP712Domain = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
];

const ForwardRequest = [
  { name: "from", type: "address" },
  { name: "to", type: "address" },
  { name: "value", type: "uint256" },
  { name: "gas", type: "uint256" },
  { name: "nonce", type: "uint256" },
  { name: "data", type: "bytes" },
];

function getMetaTxTypeData(chainId: number, verifyingContract: any) {
  return {
    types: {
      EIP712Domain,
      ForwardRequest,
    },
    domain: {
      name: "MinimalForwarder",
      version: "0.0.1",
      chainId,
      verifyingContract,
    },
    primaryType: "ForwardRequest",
  };
}

async function signTypedData(signer: any, from: string, data: any) {
  const privateKey = Buffer.from(signer.replace(/^0x/, ""), "hex");
  return signTypedMessage(privateKey, { data });
}

async function buildRequest(forwarder: any, input: any) {
  const nonce = await forwarder
    .getNonce(input.from)
    .then((nonce: number) => nonce.toString());
  return { value: 0, gas: 1e6, nonce, ...input };
}

async function buildTypedData(forwarder: any, request: any) {
  const chainId = await forwarder.provider
    .getNetwork()
    .then((n: any) => n.chainId);
  const typeData = getMetaTxTypeData(chainId, forwarder.address);
  return { ...typeData, message: request };
}

export const signMetaTxRequest = async function (
  signer: any,
  forwarder: any,
  input: any
) {
  const request = await buildRequest(forwarder, input);
  const toSign = await buildTypedData(forwarder, request);
  const signature = await signTypedData(signer, input.from, toSign);

  return { signature, request };
};
