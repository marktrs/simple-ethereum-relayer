export interface IAppConfig {
  port: number;
  privateKey: string;
  gasLimit: string;
  redisURL: string;
  providerURL: string;
  relayerURL: string;
}

export const appConfig: IAppConfig = {
  port: +(process.env.APP_PORT || 3001),
  privateKey: process.env.RELAYER_PAYMASTER_KEY || "",
  gasLimit: process.env.APP_GAS_LIMIT || "2500000",
  redisURL: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  providerURL: process.env.PROVIDER_URL || "http://127.0.0.1:8545",
  relayerURL:
    process.env.RELAYER_URL || "http://127.0.0.1:3000/api/forward-transaction",
};
