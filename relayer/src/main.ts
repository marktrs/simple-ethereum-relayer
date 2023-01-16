import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import validationOptions from './configs/validation.config';
import { RelayerModule } from './modules/relayer.module';

async function bootstrap() {
  const app = await NestFactory.create(RelayerModule);
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  const configService = app.get(ConfigService);
  await app.listen(configService.get<string>('relayer.port'));
}

bootstrap();
