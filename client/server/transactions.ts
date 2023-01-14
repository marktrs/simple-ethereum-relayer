import { Entity, Schema } from "redis-om";
import { client } from "./redis";

export class Transaction extends Entity {
  request: string;
  signature: string;
}

export const transactionSchema = new Schema(Transaction, {
  request: { type: "text" },
  signature: { type: "text" },
});

export const transactionRepository = client.fetchRepository(transactionSchema);

(async () => {
  await transactionRepository.createIndex();
})();
