import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ForwarderContract } from 'src/contracts/forwarder.contract';
import { TransactionService } from './transaction.service';

@Injectable()
export class RelayerService {
  private readonly logger = new Logger(RelayerService.name);
  constructor(
    private readonly transactionService: TransactionService,
    private readonly forwarderContract: ForwarderContract,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async executeTransactionBatch() {
    this.logger.debug('Start batch process ...');
    const txs = await this.transactionService.getTransactions();
    if (txs.length == 0) {
      return {
        message: 'no transaction to execute',
      };
    }

    this.logger.debug(`Found ${txs.length} transactions to process`);

    const requests = txs.map((tx) => JSON.parse(tx.request));
    const signatures = txs.map((tx) => tx.signature);
    const ids = txs.map((tx) => tx.entityId);

    await this.forwarderContract.batchExecute(requests, signatures);
    await this.transactionService.removeTransactions(ids);

    this.logger.debug(
      `Executed ${txs.length} transactions complete, Stop batch process ...`,
    );
  }
}
