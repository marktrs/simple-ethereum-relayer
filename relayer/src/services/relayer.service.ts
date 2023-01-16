import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { IRelayerConfig } from 'src/configs/relayer.config';
import { ForwarderContract } from 'src/contracts/forwarder.contract';
import { TransactionService } from './transaction.service';

@Injectable()
export class RelayerService {
  private readonly logger = new Logger(RelayerService.name);
  private readonly relayerConfig: IRelayerConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly transactionService: TransactionService,
    private readonly forwarderContract: ForwarderContract,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
    this.relayerConfig = this.configService.get<IRelayerConfig>('relayer');
    const job = new CronJob(this.relayerConfig.cronTime, async () => {
      await this.executeTransactionBatch();
    });
    this.schedulerRegistry.addCronJob('executeTransactionBatch', job);
    job.start();
  }

  async executeTransactionBatch() {
    this.logger.debug('Starting batch process ...');
    const txs = await this.transactionService.getTransactions();

    if (txs.length == 0) {
      this.logger.debug(
        `No transaction to execute, Stopping batch process ...`,
      );
      return;
    }

    this.logger.debug(`Found ${txs.length} transactions to process`);
    const requests = txs.map((tx) => JSON.parse(tx.request));
    const signatures = txs.map((tx) => tx.signature);
    const ids = txs.map((tx) => tx.entityId);

    let gasUsage: number;
    const { gasLimit } = this.relayerConfig;

    gasUsage = await this.forwarderContract.estimateGas(requests, signatures);
    while (gasUsage > parseInt(gasLimit)) {
      ids.pop();
      requests.pop();
      signatures.pop();
      gasUsage = await this.forwarderContract.estimateGas(requests, signatures);
    }

    await this.forwarderContract.batchExecute(requests, signatures);
    await this.transactionService.removeTransactions(ids);

    this.logger.debug(
      `Executed ${ids.length} transactions complete, Stopping batch process ...`,
    );
  }
}
