import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { signMetaTxRequest } from "../src/signer";

async function deploy(name: string, ...params: any): Promise<Contract> {
  const Contract = await ethers.getContractFactory(name);
  return await Contract.deploy(...params).then((f) => f.deployed());
}

describe("contract/TargetToken", () => {
  const totalSupply = 100;
  let targetToken: Contract;
  let forwarder: Contract;
  let accounts: SignerWithAddress[];

  beforeEach(async () => {
    forwarder = await deploy("MinimalForwarder");
    targetToken = await deploy("TargetToken", totalSupply, forwarder.address);
    accounts = await ethers.getSigners();
  });

  it("should assign the total supply of tokens to the owner", async function () {
    const owner = accounts[0].address;
    const ownerBalance = await targetToken.balanceOf(owner);
    expect(await targetToken.totalSupply()).to.equal(ownerBalance);
  });

  it("transfer emits event", async function () {
    const owner = accounts[0];
    const receiver = accounts[1].address;
    const amount = 1;
    const tgtoken = targetToken.connect(owner);
    const { events } = await tgtoken
      .transfer(receiver, amount)
      .then((tx: any) => tx.wait());

    expect(events[0].event).to.equal("Transfer");
    expect(events[0].args[1]).to.equal(receiver);
    expect(events[0].args[2]).to.equal(amount);
  });

  it("recognize trusted forwarder", async function () {
    expect(await targetToken.isTrustedForwarder(forwarder.address));
  });

  it("transfer via a meta-tx", async function () {
    const owner = accounts[0];
    const receiver = accounts[1];
    const wallet = ethers.Wallet.createRandom();
    const relayer = accounts[3];
    const forwarderWithSigner = forwarder.connect(relayer);
    const amount = 1;

    // transfer some tgtoken to newly generated wallet
    const tgtoken = targetToken.connect(owner);
    await tgtoken.transfer(wallet.address, amount).then((tx: any) => tx.wait());
    expect(await targetToken.balanceOf(wallet.address)).to.equal(amount);

    const data = targetToken.interface.encodeFunctionData("transfer", [
      receiver.address,
      amount,
    ]);

    const { request, signature } = await signMetaTxRequest(
      wallet.privateKey,
      forwarderWithSigner,
      {
        from: wallet.address,
        to: targetToken.address,
        data,
      }
    );

    // wallet can send transaction with gasless
    await forwarder.execute(request, signature).then((tx: any) => tx.wait());
    expect(await targetToken.balanceOf(receiver.address)).to.equal(amount);
  });
});
