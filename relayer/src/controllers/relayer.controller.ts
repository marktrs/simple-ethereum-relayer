import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ForwarderContract } from 'src/contracts/forwarder.contract';
import { AddTransactionDto } from 'src/dtos/transaction.dto';
import { Transaction } from 'src/entities/transaction.entity';
import { TransactionService } from 'src/services/transaction.service';

@Controller('relayer')
export class RelayerController {
  constructor(
    private readonly transaction: TransactionService,
    private readonly forwarder: ForwarderContract,
  ) {}

  @Get('transactions')
  @HttpCode(HttpStatus.OK)
  async getPendingTransactions(): Promise<Transaction[]> {
    return this.transaction.getTransactions();
  }

  @Post('forward-transaction')
  @HttpCode(HttpStatus.CREATED)
  async addTransaction(@Body() req: AddTransactionDto): Promise<any> {
    const { request, signature } = req;
    const isExist = await this.transaction.findBySignature(signature);
    if (isExist) {
      throw new HttpException(
        {
          message: {
            error: 'transaction already in pending queue',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const isTxValid = await this.forwarder.verify({ request, signature });
    if (!isTxValid) {
      throw new HttpException(
        {
          message: {
            error: 'invalid signature or request',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const id = await this.transaction.addTransaction({ request, signature });
    return {
      id,
      message: 'added transaction to queue',
    };
  }
}
