import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { Client } from 'redis-om';
import { ForwarderContract } from '../contracts/forwarder.contract';
import { TransactionService } from '../services/transaction.service';
import relayerConfig from '../configs/relayer.config';
import { RelayerController } from '../controllers/relayer.controller';
import { RelayerService } from '../services/relayer.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      load: [relayerConfig],
    }),
  ],
  controllers: [RelayerController],
  providers: [
    RelayerService,
    ConfigService,
    ForwarderContract,
    TransactionService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        const client = new Client();
        await client.open(process.env.REDIS_URL);
        return client;
      },
    },
  ],
})
export class RelayerModule {}
