import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HyperionStreamService } from './hyperion-stream/hyperion-stream.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  // const hyperionService = new HyperionStreamService();
  // await hyperionService.connect();
}
bootstrap();
