// /* tslint:disable:no-unused-expression */
// /* tslint:disable:no-implicit-dependencies */

// // TODO test is dependent on local running API
// // Create MOCK API endpoints

// import * as mocha from 'mocha';
// import * as chai from 'chai';
// import {SdkManager} from '../src/index';
// import {mockRequests} from './lib/mockRequests';
// import { LocalAccount } from '../src/accounts/LocalAccount';

// const expect = chai.expect;

// describe('RadarRelay', async () => {

//     let rrsdk = await SdkManager.InitializeAsync({
//       endpoint: 'http://localhost:8080/v0',
//       websocketEndpoint: 'ws://ws.radarrelay.com'
//       },
//       {
//         wallet: {
//           password: 'password',
//           seedPhrase: 'concert load couple harbor equip island argue ramp clarify fence smart topic'
//         },
//         dataRpcUrl: 'http://localhost:8545'
//       }
//     );

//     mockRequests();

//     rrsdk.events.on('loading', data => {
//       // console.log(data);
//     });

//     let ethereumInitialized = false;
//     let accountInitialized = false;
//     let ethereumNetworkIdInitialized = false;
//     let zeroExInitialized = false;
//     let tokensInitialized = false;
//     let marketsInitialized = false;
//     let tradeInitialized = false;

//     rrsdk.events.on('ethereumInitialized', network => {
//       ethereumInitialized = true;
//     });
//     rrsdk.events.on('ethereumNetworkIdInitialized', networkId => {
//       ethereumNetworkIdInitialized = true;
//     });
//     rrsdk.events.on('tokensInitialized', account => {
//       tokensInitialized = true;
//     });
//     rrsdk.events.on('accountInitialized', account => {
//       accountInitialized = true;
//     });
//     rrsdk.events.on('zeroExInitialized', zeroEx => {
//       zeroExInitialized = true;
//     });
//     rrsdk.events.on('tradeInitialized', trade => {
//       tradeInitialized = true;
//     });
//     rrsdk.events.on('marketsInitialized', markets => {
//       marketsInitialized = true;
//     });

//     beforeEach(() => {
//       ethereumInitialized = false;
//       tokensInitialized = false;
//       accountInitialized = false;
//       ethereumNetworkIdInitialized = false;
//       zeroExInitialized = false;
//       marketsInitialized = false;
//       tradeInitialized = false;
//     });

//     it('properly initializes and updates via init lifecycle', async () => {

//       expect(accountInitialized).to.be.true;
//       expect(ethereumInitialized).to.be.true;
//       expect(tokensInitialized).to.be.true;
//       expect(accountInitialized).to.be.true;
//       expect(zeroExInitialized).to.be.true;
//       expect(tradeInitialized).to.be.true;
//       expect(marketsInitialized).to.be.true;
//     });

//     it('SDK reloads properly when an account address is changed', async () => {
//       const addresses = await rrsdk.account.getAvailableAddressesAsync();
//       await (rrsdk.account as LocalAccount).setAddressAsync(addresses[1]);
//       expect(rrsdk.account.address).to.be.eq(addresses[1]);
//       // check nested dependency (NOTE: private vars)
//       expect(((rrsdk as any)._trade as any)._account.address).to.be.eq(addresses[1]);
//     });

//     // TODO may not be necessary
//     it('SDK reloads properly when using rpcWallet', async () => {

//       rrsdk = await SdkManager.InitializeAsync({
//         endpoint: 'http://localhost:8080/v0',
//         websocketEndpoint: 'ws://ws.radarrelay.com'
//         },
//         {
//           wallet: {
//             password: 'password',
//             seedPhrase: 'concert load couple harbor equip island argue ramp clarify fence smart topic'
//           },
//           dataRpcUrl: 'http://localhost:8545'
//         }
//       );

//       expect(accountInitialized).to.be.true;
//       expect(ethereumInitialized).to.be.true;
//       expect(tokensInitialized).to.be.true;
//       expect(accountInitialized).to.be.true;
//       expect(zeroExInitialized).to.be.true;
//       expect(tradeInitialized).to.be.true;
//       expect(marketsInitialized).to.be.true;
//       expect(rrsdk.account.address).to.equal('0x5409ed021d9299bf6814279a6a1411a7e866a631');
//     });

//     it.skip('properly handles setting invalid connection');

//     it.skip('properly handles setting invalid account');

// });
