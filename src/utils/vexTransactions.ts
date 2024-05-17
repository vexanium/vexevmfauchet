import { Api, JsonRpc } from 'vexaniumjs';
import { JsSignatureProvider } from 'vexaniumjs/dist/vexjs-jssig';

export default async function Transaction(textAfterCommand: any, privatekey: any) {
const defaultPrivateKey = privatekey; 
const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);

const rpc = new JsonRpc('http://194.163.139.217:8080', { fetch });

const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
    try {
        console.log('text ',textAfterCommand)
        const result = await api.transact({
          actions: [{
            account: 'vex.token',
            name: 'transfer',
            authorization: [{
              actor: 'appnetwork',
              permission: 'active',
            }],
            data: {
              from: 'appnetwork',
              to: 'vex.evm',
              quantity: '2.0000 VEX',
              memo: textAfterCommand,
            },
          }]
        }, {
          blocksBehind: 3,
          expireSeconds: 30,
        });
        
        return true;
    } catch (error) {
        return false
    }
}
