import { Test, TestingModule } from '@nestjs/testing';
import { RelayerService } from '../services/relayer.service';
import { RelayerController } from './relayer.controller';

describe('AppController', () => {
  let relayerController: RelayerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RelayerController],
      providers: [RelayerService],
    }).compile();

    relayerController = app.get<RelayerController>(RelayerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(relayerController.addTransactionToBatch()).toBe('Hello World!');
    });
  });
});
