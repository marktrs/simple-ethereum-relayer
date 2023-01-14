import { ethers } from "ethers";
import { appConfig } from "../configs/app.config";
import contractAddress from "../contracts/contract-address.json";
import ForwarderArtifact from "../contracts/Forwarder.json";

export const forwarderContract = () => {
  const { privateKey, providerURL } = appConfig;
  const provider = ethers.getDefaultProvider(providerURL);
  const wallet = new ethers.Wallet(privateKey, provider);
  const forwarder = new ethers.Contract(
    contractAddress.Forwarder,
    ForwarderArtifact.abi,
    wallet
  );

  return forwarder;
};
