import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api'; // Change import statement
import Transaction from '../utils/vexTransactions'; 

@Injectable()
export class TelegramBotService {
  private bot: TelegramBot;
  private lastTransactionTimes: { [fromId: number]: number } = {}; 

  constructor() {
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    // Initialize Telegram bot with your token
    this.bot = new TelegramBot(telegramBotToken, { polling: true }); // Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Listen for messages
    this.bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      const messageText = msg.text;
      // Handle incoming messages
      console.log(`Received message from ${chatId}: ${messageText}`);
    });

    // Listen for commands
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      // Respond to the '/start' command
      this.bot.sendMessage(chatId, 'Welcome!\n\ntype: /faucet 0x2YourEvmAddreess for get some evm TestNet\n\ntype: /rpc for get info network\n\ntype: /help if u need help');
    });

    this.bot.onText(/\/help/, (msg) => {
        const chatId = msg.chat.id;
        // Respond to the '/start' command
        console.log(msg)
        this.bot.sendMessage(chatId, 'Hello dear!, im here 😊\n\ntype: /faucet 0x2YourEvmAddreess for get some evm TestNet\n\ntype: /rpc for get info network\n\ntype: /help if u need help\n\nThere is a mistake?\nyou can contact: @yuda0x25c');
      });
     const rpcInfoMsg = "*RPC Info:*\n\n*Network: VEX EVM TESTNET*\nRPC URL: `https://testnet.vexascan.com/evmapi`\nchainID: 5522\nCurrency symbol: `VEX`\nBlock explorer URL: `https://testnet.vexascan.com/evmexplorer`\n\n*Vex Native TestNet*\nNetwork: VEX Native TestNet\nRPC: `http://194.163.139.217:8080`\nchainID: `adb373e86715ca39e81f1804a8c7f4029a5d2402d47dd451d9c595d46abba792`\nBlock Explorer URL: `https://testnet.vexascan.com`\n\n";
    
    this.bot.onText(/\/rpc/, (msg) => {
        const chatId = msg.chat.id;
        // Respond to the '/rpc' command with MarkdownV2 formatting
        this.bot.sendMessage(chatId, rpcInfoMsg, { parse_mode: 'MarkdownV2' });
    });

     // Listen for commands /fauchet
     this.bot.onText(/\/faucet(.+)?/, async (msg, match) => {
        const fromId = msg.from.id;
        const chatId = msg.chat.id;
        const userName = msg.from.username;
        // Extract the text after the '/faucet' command
         // Check if chatId has exceeded the limit
         console.log(this.isWithinLimit(fromId))
      if (this.isWithinLimit(fromId)) {
        this.bot.sendMessage(chatId, `@${userName} You have reached the transaction limit. Please try again after 24 hours.`);
        return;
      }
        this.bot.sendMessage(chatId, `Processing please wait`);
        const textAfterCommand = match[1] || '';
        const trimmedText = textAfterCommand.trim();
        try {
            // Attempt to execute the transaction
            const transact  = await Transaction(trimmedText, process.env.PRIVATE_KEY);
            // If successful, send success message
            console.log(transact)
            if(transact) {
                this.bot.sendMessage(chatId, `@${userName} Transaction successful\n1 VEX sent to: ${trimmedText}`);
                this.lastTransactionTimes[fromId] = Date.now();
            } else {
                this.bot.sendMessage(chatId, `@${userName} Transaction failled for: ${trimmedText}`);
            }
        } catch (error) {
            // If an error occurs, send error message
            this.bot.sendMessage(chatId, `@${userName} Transaction failed for: ${trimmedText}. Error: ${error.message}`);
        }
      });

    // Add more event listeners as needed
  }

  // Example method to send a message
  async sendMessage(chatId: number, message: string): Promise<void> {
    await this.bot.sendMessage(chatId, message);
  }

private isWithinLimit(fromId: number): boolean {
  console.log('Checking chatId:', fromId);
  const lastTransactionTime = this.lastTransactionTimes[fromId];
  console.log('Last transaction time:', lastTransactionTime);
  if (!lastTransactionTime) return false; // If no previous transaction
  const currentTime = Date.now();
  const elapsedTime = currentTime - lastTransactionTime;
  // Check if 24 hours have passed since the last transaction
  return elapsedTime < 24 * 60 * 60 * 1000;
}

}
