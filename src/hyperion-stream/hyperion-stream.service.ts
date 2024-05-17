import { Injectable } from '@nestjs/common';
import { HyperionStreamClient, StreamClientEvents, EventData } from '@genesisblockid/hyperion-stream-client';

@Injectable()
export class HyperionStreamService {
  private client: HyperionStreamClient;

  constructor() {
    this.client = new HyperionStreamClient({
      endpoint: 'http://154.26.131.93:1234',
      debug: true,
      libStream: false,
    });

    this.client.setAsyncDataHandler(this.handler);

    this.client.on(StreamClientEvents.EMPTY, () => {
      console.log('Queue Empty!');
    });

    this.client.on(StreamClientEvents.LIBUPDATE, (data: any) => {
      console.log('Current LIB:', data.block_num);
    });

    this.client.on(StreamClientEvents.FORK, (data) => {
      console.log('Fork Event:', data);
    });
  }

  private async handler(data: any) {
    switch (data.type) {
      case 'action': {
        const action = data.content;
        const act = action.act;
        const actData = act.data;
        console.log(`Action - [${data.content.block_num}] [${act.account}::${act.name}] >> ${JSON.stringify(actData)}`);
        break;
      }
      case 'delta': {
        const delta = data.content;
        const row = delta.data;
        console.log(`Delta - [${data.content.block_num}] [${delta.code}::${delta.table}] >> ${JSON.stringify(row)}`);
        break;
      }
    }
  }

  async connect() {
    try {
      await this.client.connect();
      await this.streamActions();
      await this.streamDeltas();
    } catch (error) {
      console.error('Error connecting and streaming data:', error);
      // Handle the error as needed, e.g., retrying, logging, etc.
    }
  }
  

  private async streamActions() {
    await this.client.streamActions({
      contract: 'vex.token',
      action: 'transfer',
      account: '',
      filters: [],
      read_until: 0,
      start_from: 0,
    });

    await this.client.streamActions({
      contract: 'vex.token',
      action: '*',
      account: '',
      filters: [],
      read_until: 0,
      start_from: 0,
    });
  }

  private async streamDeltas() {
    await this.client.streamDeltas({
      code: 'vex.token',
      scope: '*',
      table: '*',
      payer: '',
      read_until: 0,
      start_from: 0,
    });

    await this.client.streamDeltas({
      code: 'vex.token',
      scope: '*',
      table: '*',
      payer: '',
      read_until: 0,
      start_from: 0,
    });
  }
}
