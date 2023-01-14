import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

import { forwarderContract } from "../../blockchain/forwarder";
import { appConfig } from "../../configs/app.config";
import { Transaction, transactionRepository } from "../../server/transactions";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const { request, signature } = JSON.parse(req.body);
  const response = await forwarderContract().verify(request, signature);
  if (!response) {
    res.status(400).json({ message: "invalid signature or request" });
    return;
  }

  const tx: Transaction = transactionRepository.createEntity();
  tx.request = JSON.stringify(request);
  tx.signature = signature;

  await transactionRepository.save(tx);

  res.status(200).json({ message: "transaction was added to queue" });
});

router.put(async (_, res: NextApiResponse) => {
  const { gasLimit } = appConfig;
  const transactions: Transaction[] = await transactionRepository
    .search()
    .returnAll();

  const requests = transactions.map((tx) => JSON.parse(tx.request));
  const signatures = transactions.map((tx) => tx.signature);

  try {
    await forwarderContract().batchExecute(requests, signatures, {
      gasLimit,
    });
  } catch (error) {
    res.status(500).json({
      message: `failed to forward transaction`,
      error,
    });
    throw error;
  }

  res.status(200).json({
    message: `${transactions.length} transactions were submitted to the network`,
  });
});

export default router.handler();
