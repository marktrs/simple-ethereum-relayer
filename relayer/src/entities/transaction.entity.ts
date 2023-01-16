import { Entity, Schema } from 'redis-om';

export class Transaction extends Entity {
  request: any;
  signature: string;
}

export const transactionSchema = new Schema(Transaction, {
  request: { type: 'text' },
  signature: { type: 'text' },
});
