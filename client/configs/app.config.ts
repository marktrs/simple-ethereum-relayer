// import dotenv from "dotenv";

// dotenv.config({
//   path: resolve(process.cwd(), ".env"),
// });

export interface IAppConfig {
  port: number;
  privateKey: string;
  gasLimit: string;
  providerURL: string;
  relayerURL: string;
}

export const appConfig: IAppConfig = {
  port: +(process.env.APP_PORT || 3001),
  privateKey: process.env.RELAYER_PAYMASTER_KEY || "",
  gasLimit: process.env.APP_GAS_LIMIT || "2500000",
  providerURL: process.env.PROVIDER_URL || "http://127.0.0.1:8545",
  relayerURL:
    process.env.RELAYER_URL || "http://127.0.0.1:3000/api/forward-transaction",
};
