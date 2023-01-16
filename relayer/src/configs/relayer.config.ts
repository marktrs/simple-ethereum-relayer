import { registerAs } from '@nestjs/config';

export interface IRelayerConfig {
  port: number;
  privateKey: string;
  gasLimit: string;
  redisURL: string;
  providerURL: string;
  cronTime: string;
}

export default registerAs(
  'relayer',
  (): IRelayerConfig => ({
    port: +(process.env.RELAYER_PORT || 3001),
    privateKey: process.env.RELAYER_PAYMASTER_KEY || '',
    gasLimit: process.env.APP_GAS_LIMIT || '2500000',
    redisURL: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
    providerURL: process.env.PROVIDER_URL || 'http://127.0.0.1:8545',
    cronTime: process.env.RELAYER_CRON_TIME || '10 * * * * *', // default is execute every 10 seconds
  }),
);
