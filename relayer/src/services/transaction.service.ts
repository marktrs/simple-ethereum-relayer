import { Inject, Injectable } from '@nestjs/common';
import { Client, Repository } from 'redis-om';
import {
  Transaction,
  transactionSchema,
} from 'src/entities/transaction.entity';

@Injectable()
export class TransactionService {
  private readonly transactionRepository: Repository<Transaction>;

  constructor(@Inject('REDIS_CLIENT') redisClient: Client) {
    this.transactionRepository = redisClient.fetchRepository(transactionSchema);
    this.transactionRepository.createIndex();
  }

  async getTransactions(): Promise<Transaction[]> {
    return this.transactionRepository.search().returnAll();
  }

  async addTransaction({
    request,
    signature,
  }: Partial<Transaction>): Promise<string> {
    const tx: Transaction = this.transactionRepository.createEntity();

    tx.request = JSON.stringify(request);
    tx.signature = signature;

    return this.transactionRepository.save(tx);
  }

  async removeTransactions(ids: string[]): Promise<void> {
    return this.transactionRepository.remove(ids);
  }
}
