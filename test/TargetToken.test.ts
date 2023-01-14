import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, Wallet } from "ethers";
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
    forwarder = await deploy("Forwarder");
    targetToken = await deploy("TargetToken", totalSupply, forwarder.address);
    accounts = await ethers.getSigners();
  });

  context("token", function () {
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
  });

  context("metatx", function () {
    const amount = 1;
    let wallet1: Wallet;
    let wallet2: Wallet;
    let wallet3: Wallet;
    let receiver: SignerWithAddress;
    let forwarderWithSigner: Contract;

    beforeEach(async function () {
      const owner = accounts[0];
      const tgtoken = targetToken.connect(owner);

      receiver = accounts[1];
      wallet1 = ethers.Wallet.createRandom();
      wallet2 = ethers.Wallet.createRandom();
      wallet3 = ethers.Wallet.createRandom();

      const relayer = accounts[3];
      forwarderWithSigner = forwarder.connect(relayer);

      // transfer some tgtoken to newly generated wallet
      await tgtoken
        .transfer(wallet1.address, amount)
        .then((tx: any) => tx.wait());
      expect(await targetToken.balanceOf(wallet1.address)).to.equal(amount);
      // transfer some tgtoken to newly generated wallet
      await tgtoken
        .transfer(wallet2.address, amount)
        .then((tx: any) => tx.wait());
      expect(await targetToken.balanceOf(wallet2.address)).to.equal(amount);
    });

    it("transfer", async function () {
      // build transaction
      const data = targetToken.interface.encodeFunctionData("transfer", [
        receiver.address,
        amount,
      ]);

      // sign transaction with wallet1 without gas
      const { request, signature } = await signMetaTxRequest(
        wallet1.privateKey,
        forwarderWithSigner,
        {
          from: wallet1.address,
          to: targetToken.address,
          data,
        }
      );

      expect(await forwarder.verify(request, signature)).to.equal(true);

      // wallet1 can send transaction with gasless
      await forwarder.execute(request, signature).then((tx: any) => tx.wait());

      expect(await targetToken.balanceOf(receiver.address)).to.equal(amount);
      expect(await targetToken.balanceOf(wallet1.address)).to.equal(0);
    });

    it("batch transfer", async function () {
      const wallets = [wallet1, wallet2];
      const requests: any[] = [];
      const signatures: any[] = [];
      const data = targetToken.interface.encodeFunctionData("transfer", [
        receiver.address,
        amount,
      ]);

      for (let index = 0; index < wallets.length; index++) {
        const wallet = wallets[index];
        const { request, signature } = await signMetaTxRequest(
          wallet.privateKey,
          forwarderWithSigner,
          {
            from: wallet.address,
            to: targetToken.address,
            data,
          }
        );
        requests.push(request);
        signatures.push(signature);
      }

      await forwarder
        .batchExecute(requests, signatures)
        .then((tx: any) => tx.wait());

      expect(await targetToken.balanceOf(receiver.address)).to.equal(2);
      expect(await targetToken.balanceOf(wallet1.address)).to.equal(0);
    });

    it("batch transfer included wallet with insufficient fund should not revert", async function () {
      const wallets = [wallet1, wallet2, wallet3];
      const requests: any[] = [];
      const signatures: any[] = [];
      const data = targetToken.interface.encodeFunctionData("transfer", [
        receiver.address,
        amount,
      ]);

      for (let index = 0; index < wallets.length; index++) {
        const wallet = wallets[index];
        const { request, signature } = await signMetaTxRequest(
          wallet.privateKey,
          forwarderWithSigner,
          {
            from: wallet.address,
            to: targetToken.address,
            data,
          }
        );
        requests.push(request);
        signatures.push(signature);
      }

      await forwarder
        .batchExecute(requests, signatures)
        .then((tx: any) => tx.wait());

      expect(await targetToken.balanceOf(receiver.address)).to.equal(2);
      expect(await targetToken.balanceOf(wallet1.address)).to.equal(0);
    });
  });
});
