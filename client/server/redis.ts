import { Client } from "redis-om";
import { appConfig } from "../configs/app.config";

export const client = new Client();
const { redisURL } = appConfig;

(async () => {
  client.open(redisURL);
})();
