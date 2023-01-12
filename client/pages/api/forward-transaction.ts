import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { appConfig } from "../../configs/app.config";
import contractAddress from "../../contracts/contract-address.json";
import ForwarderArtifact from "../../contracts/MinimalForwarder.json";

const apiRoute = createRouter().post(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { request, signature } = JSON.parse(req.body);
    const { gasLimit, privateKey, providerURL } = appConfig;
    const provider = ethers.getDefaultProvider(providerURL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const forwarder = new ethers.Contract(
      contractAddress.Forwarder,
      ForwarderArtifact.abi,
      wallet
    );

    const response = await forwarder.execute(request, signature, {
      gasLimit,
    });

    res.status(200).json({ response });
  }
);

export default apiRoute.handler();
