import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HyperionStreamService } from './hyperion-stream/hyperion-stream.service';
import { TelegramBotService } from './telegram-bot/telegram-bot.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, HyperionStreamService, TelegramBotService],
})
export class AppModule {}
