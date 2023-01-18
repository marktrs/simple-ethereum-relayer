import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Contract, ethers } from 'ethers';
import { IRelayerConfig } from '../configs/relayer.config';
import { Transaction } from '../entities/transaction.entity';
import contractAddress from './contract-address.json';
import ForwarderArtifact from './Forwarder.json';

@Injectable()
export class ForwarderContract {
  private readonly relayerConfig: IRelayerConfig;
  private readonly forwarder: Contract;

  constructor(private configService: ConfigService) {
    this.relayerConfig = this.configService.get<IRelayerConfig>('relayer');

    const { privateKey, providerURL } = this.relayerConfig;
    const provider = ethers.getDefaultProvider(providerURL);
    const wallet = new ethers.Wallet(privateKey, provider);

    this.forwarder = new ethers.Contract(
      contractAddress.Forwarder,
      ForwarderArtifact.abi,
      wallet,
    );
  }

  async estimateGas(requests: string[], signatures: string[]): Promise<number> {
    const gasUsage = await this.forwarder.estimateGas.batchExecute(
      requests,
      signatures,
    );

    return gasUsage.toNumber();
  }

  async verify({ request, signature }: Partial<Transaction>): Promise<boolean> {
    return this.forwarder.verify(request, signature);
  }

  async batchExecute(requests: string[], signatures: string[]): Promise<void> {
    const { gasLimit } = this.relayerConfig;
    return this.forwarder.batchExecute(requests, signatures, {
      gasLimit,
    });
  }
}
