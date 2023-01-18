import { artifacts, ethers, network } from "hardhat";

// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is avaialble in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Forwarder = await ethers.getContractFactory("Forwarder");
  const forwarder = await Forwarder.deploy();
  await forwarder.deployed();

  console.log("Forwarder address:", forwarder.address);

  const Token = await ethers.getContractFactory("TargetToken");
  const token = await Token.deploy(1000, forwarder.address);
  await token.deployed();

  console.log("Target Token address:", token.address);

  // We also save the contract's artifacts and address in the frontend directory
  exportArtifactFiles(token, forwarder);
}

function exportArtifactFiles(token: any, forwarder: any) {
  const fs = require("fs");
  const directories = [
    __dirname + "/../deployed",
    __dirname + "/../client/contracts",
    __dirname + "/../relayer/src/contracts",
  ];

  directories.forEach((contractsDir) => {
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(
      contractsDir + "/contract-address.json",
      JSON.stringify(
        {
          Token: token.address,
          Forwarder: forwarder.address,
        },
        null,
        2
      )
    );

    const TokenArtifact = artifacts.readArtifactSync("TargetToken");
    fs.writeFileSync(
      contractsDir + "/TargetToken.json",
      JSON.stringify(TokenArtifact, null, 2)
    );

    const ForwarderArtifact = artifacts.readArtifactSync("Forwarder");
    fs.writeFileSync(
      contractsDir + "/Forwarder.json",
      JSON.stringify(ForwarderArtifact, null, 2)
    );
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
