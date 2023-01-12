import { ethers } from "ethers";
import { appConfig } from "../configs/app.config";
import contractAddress from "../contracts/contract-address.json";
import ForwarderArtifact from "../contracts/MinimalForwarder.json";
import TokenArtifact from "../contracts/TargetToken.json";
import { signMetaTxRequest } from "./signer";

const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

export const transferTokensMeta = async (
  receiver: string,
  amount: string,
  ethProvider: any
) => {
  let request;
  const userProvider = new ethers.providers.Web3Provider(ethProvider);

  const forwarder = new ethers.Contract(
    contractAddress.Forwarder,
    ForwarderArtifact.abi,
    userProvider.getSigner(0)
  );
  const token = new ethers.Contract(
    contractAddress.Token,
    TokenArtifact.abi,
    userProvider.getSigner(0)
  );

  try {
    const signer = userProvider.getSigner(0);
    const from = await signer.getAddress();
    const data = token.interface.encodeFunctionData("transfer", [
      receiver,
      amount,
    ]);

    const to = token.address;

    request = await signMetaTxRequest(signer.provider, forwarder, {
      to,
      from,
      data,
    });
  } catch (error) {
    if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
      return;
    }
    console.error(error);
    throw error;
  }

  const { relayerURL } = appConfig;

  await fetch(relayerURL, {
    method: "POST",
    body: JSON.stringify(request),
    headers: { "Content-Type": "application/json" },
    mode: "no-cors",
  });
};

export const getTokenBalance = async (ethProvider: any) => {
  await ethProvider.request({ method: "eth_requestAccounts" });
  const userProvider = new ethers.providers.Web3Provider(ethProvider);
  const token = new ethers.Contract(
    contractAddress.Token,
    TokenArtifact.abi,
    userProvider.getSigner(0)
  );
  const signer = userProvider.getSigner(0);
  const signerAddress = await signer.getAddress();
  const balance = await token.balanceOf(signerAddress);
  console.log(ethers.utils.formatUnits(balance, 0));

  return ethers.utils.formatUnits(balance, 0);
};
