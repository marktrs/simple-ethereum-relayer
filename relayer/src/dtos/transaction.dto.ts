import { IsNotEmptyObject, IsString } from 'class-validator';

export interface Request {
  value: string;
  gas: string;
  nonce: string;
  to: string;
  from: string;
  data: string;
}

export class AddTransactionDto {
  @IsNotEmptyObject()
  readonly request: Request;

  @IsString()
  readonly signature: string;
}
