
export class ZeroExWrapper {

}

import Web3 = require('web3');
import {promisify} from 'es6-promisify';
import BigNumber from 'bignumber.js';
import { ZeroEx, ZeroExConfig, SignedOrder } from '0x.js';

(async () => {
  const provider = new Web3.providers.HttpProvider('http://35.196.15.153:8545');
  const web3 = new Web3(provider);
  const networkId = await promisify(web3.version.getNetwork)();

  const zeroExConfig: ZeroExConfig = {
    networkId: parseInt(networkId, 10)
  };
  const zeroEx = new ZeroEx(web3.currentProvider, zeroExConfig);

  const zeroExProxyContract = '0x087eed4bc1ee3de49befbd66c662b434b15d49d4';

  // Set Exchange Contract Address.
  const exchangeAddress = zeroEx.exchange.getContractAddress();

  const zrxAllowance = await zeroEx.token.getBalanceAsync(
    '0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570',
    web3.eth.accounts[0]
 );

 const signedOrder: SignedOrder = JSON.parse(`{
    "ecSignature": {
      "v": 27,
      "r": "0xabab930ab3b91c87af7113c2606a6ce7a2eed87afad2c9851be1e9225c7c4ef4",
      "s": "0x0bcde602e212288f13d852abd462899d5f816473a14cc9a8082c3ce6a284b880"
    },
    "exchangeContractAddress": "0x90fe2af704b34e0224bf2299c838e04d4dcf1364",
    "expirationUnixTimestampSec": "1522443925",
    "feeRecipient": "0xa258b39954cef5cb142fd567a46cddb31a670124",
    "maker": "0x4f8c975765e58c548b3fded45b9f81c1bfc5fc90",
    "makerFee": "0",
    "makerTokenAddress": "0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570",
    "makerTokenAmount": "1200000000000000000",
    "salt": "98567051257498161895650393540850073379060812338841565648042755053289806057072",
    "taker": "0x0000000000000000000000000000000000000000",
    "takerFee": "0",
    "takerTokenAddress": "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
    "takerTokenAmount": "2280000000000000"
  }`);

  signedOrder.makerTokenAmount = new BigNumber(signedOrder.makerTokenAmount);
  signedOrder.takerTokenAmount = new BigNumber(signedOrder.takerTokenAmount);
  signedOrder.makerFee = new BigNumber(signedOrder.makerFee);
  signedOrder.takerFee = new BigNumber(signedOrder.takerFee);
  signedOrder.salt = new BigNumber(signedOrder.salt);
  signedOrder.expirationUnixTimestampSec = new BigNumber(signedOrder.expirationUnixTimestampSec);

  const txHash = await zeroEx.exchange.fillOrderAsync(
    signedOrder,
    new BigNumber('100000000000000000'),
    true,
    web3.eth.accounts[0].toLowerCase(),
    {
      shouldValidate: true
    }
  );

  console.log(txHash);

  const results = await zeroEx.awaitTransactionMinedAsync(
    txHash,
    1000
  );

  console.log(results);

})();
