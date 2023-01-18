# Simple ETH Relayer

**Prerequisites**

- Metmask extension installed
- Node.JS 16+
- Docker

## Demo

Launch a local ethereum network

```
yarn evm
```

In another terminal deploy contract to local ethereum network

```
yarn deploy:local
```

Send some 100 TGT and 1 ETH token to your address

```
yarn faucet -- <your-address>
```

Import one of hardhat default wallet private key without TGT token to your metamask (to use as a receiver and check balance after transaction is forwarded)

```
hardhat default wallet private keys:

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
```

Running relayer-provider API and relayer-client app using docker compose

```
docker compose up -d --build
```

Wait till these containers started

```
[+] Running 4/4
 ⠿ Network simple-eth-relayer_default  Created
 ⠿ Container redis-stack               Started
 ⠿ Container relayer-client            Started
 ⠿ Container relayer-provider          Started
```

## Usage

1. Go checkout http://localhost:3000 you should see your client app is up and running
2. Wait till TGT Token box is '**Connected**'
3. Click **Send** button
4. On metamask pop-up ensure your transaction info is correct then click **Sign** button
5. Look up for relayer-provider batch process using

```
docker logs -f relayer-provider
```

6. Wait till your transaction is executed and the hardhat network console should have following logs show up

```
  Contract call:       Forwarder#batchExecute
  Transaction:         0xd2d8fa83b6a6d124a18177aa9d8a730874531269d39c43b383ff09d24fb9f4cf
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  To:                  0x5fbdb2315678afecb367f032d93f642f64180aa3
  Value:               0 ETH
  Gas used:            93414 of 2500000
  Block #5:            0x97d2cc4528c82f1b417650ab9ca895e601279b65e316ee0e441b55eba886a908
```

7. Your account balance should update, your ETH balance will remain the same
8. Switch account on metamask to the receiver account, TGT balance should update

## Known issue and troubleshooting

- Sometime Metamask on client app keep loading and unable to connect local network, Try to stop running hardhat node and try switching network on Metamask to reset.
- When balance fetching on client app is not update after signed transaction, Please wait till relayer executed transaction batch (or decrease cron time) and look up for event on hardhat network console.
- Running hardhat local network in docker with contract deployment is not complete yet. Ethereum provider can't find deployed contracts to execute faucet task, Need additional works to be done.
