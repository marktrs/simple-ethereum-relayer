import { Test, TestingModule } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { TransactionService } from '../services/transaction.service';
import { RelayerController } from './relayer.controller';

const moduleMocker = new ModuleMocker(global);

describe('RelayerController', () => {
  let relayerController: RelayerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RelayerController],
    })
      .useMocker((token) => {
        if (token === TransactionService) {
          return {
            getTransactions: jest.fn().mockResolvedValue([]),
          };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    relayerController = app.get<RelayerController>(RelayerController);
  });

  describe('Transaction', () => {
    it('should return pending transaction', async () => {
      expect(await relayerController.getPendingTransactions()).toEqual([]);
    });
  });
});
