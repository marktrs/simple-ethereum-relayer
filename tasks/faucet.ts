import fs from "fs";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";

task(
  "faucet",
  "Sends ETH and TGT tokens to an address",
  async (args: TaskArguments, hre: HardhatRuntimeEnvironment) => {
    const { ethers, network } = hre;
    const { receiver } = args;
    if (network.name === "hardhat") {
      console.warn(
        "You are running the faucet task with Hardhat network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }

    const addressesFile = __dirname + "/../deployed/contract-address.json";

    if (!fs.existsSync(addressesFile)) {
      console.error(
        "File not found:contract-address.json, You need to deploy your contract first"
      );
      return;
    }

    const addressJson = fs.readFileSync(addressesFile);
    const address = JSON.parse(addressJson.toString());

    if ((await ethers.provider.getCode(address.Token)) === "0x") {
      console.error(
        "ethers.provider.getCode='0x', You need to deploy your contract first"
      );
      return;
    }

    const token = await ethers.getContractAt("TargetToken", address.Token);
    const [sender] = await ethers.getSigners();

    const tx = await token.transfer(receiver, 100);
    await tx.wait();

    const tx2 = await sender.sendTransaction({
      to: receiver,
      value: ethers.constants.WeiPerEther,
    });
    await tx2.wait();

    console.log(`Transferred 1 ETH and 100 TGT to ${receiver}`);
  }
).addPositionalParam("receiver", "The address that will receive them");
