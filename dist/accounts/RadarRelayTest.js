// import { WalletConfig,
//   LightWalletConfig,
//   InjectedWalletConfig,
//   InjectedWalletType,
//   RpcWalletConfig,
//   Account, 
//   RadarRelayConfig} from '../types';
// import { InjectedAccount } from './InjectedAccount';
// import { LocalAccount } from './LocalAccount';
// import { RpcAccount } from './RpcAccount';
// export class LocalWallet {
// }
// export class RadarRelay<T> {
//   constructor(rrConfig: RadarRelayConfig, walletConfig: WalletConfig) {
//     // ?
//   }
//   public initialize<T>(rrConfig: RadarRelayConfig, walletConfig: WalletConfig): T {
//     return new LocalWallet() as T;
//   }
// }
// export class LocalWalletSdk {
//  constructor(walletConfig: WalletConfig) {
//    // noop
//  }
// }
// export class RpcWalletSdk {
//   constructor(walletConfig: WalletConfig) {
//     // noop
//   }
// }
// export class InjectedWalletSdk {
//   constructor(walletConfig: WalletConfig) {
//     // noop
//   }
// }
// export type Sdk = LocalWalletSdk | RpcWalletSdk | InjectedWalletSdk;
// /* OPTION 1 */
// export class SdkManager {
//   // Method signatures
//   public static Initialize(rrConfig: RadarRelayConfig, walletConfig: LightWalletConfig): LocalWalletSdk;
//   public static Initialize(rrConfig: RadarRelayConfig, walletConfig: RpcWalletConfig): RpcWalletSdk;
//   public static Initialize(rrConfig: RadarRelayConfig, walletConfig: InjectedWalletConfig): InjectedWalletSdk;
//   // Implementation
//   public static Initialize(rrConfig: RadarRelayConfig, walletConfig: WalletConfig): Sdk {
//     if ((walletConfig as LightWalletConfig).wallet) {
//       return new LocalWalletSdk(rrConfig, walletConfig);
//     }
//     if ((walletConfig as RpcWalletConfig).rpcUrl) {
//       return new RpcWalletSdk(rrConfig, walletConfig);
//     }
//     if ((walletConfig as InjectedWalletConfig).type) {
//       return new InjectedWalletSdk(rrConfig, walletConfig);
//     }
//   }
// }
// const localWalletSdk = SdkManager.Initialize(rrConfig, lightWalletConfig);
// const rpcWalletSdk = SdkManager.Initialize(rrConfig, rpcWalletConfig);
// const injectedWalletSdk = SdkManager.Initialize(rrConfig, injectedWalletConfig);
// // Or
// // export { LocalWalletSdk } from './sdk';
// // export { RpcWalletSdk } from './sdk';
// // export { InjectedWalletSdk } from './sdk';
// // Or keep the same structure, but allow for switching of the account class
// export class SdkManager {
//   // Method signatures
//   public static Initialize(rrConfig: RadarRelayConfig, walletConfig: LightWalletConfig): RadarRelay<LocalAccount>;
//   public static Initialize(rrConfig: RadarRelayConfig, walletConfig: RpcWalletConfig): RadarRelay<RpcAccount>;
//   public static Initialize(rrConfig: RadarRelayConfig, walletConfig: InjectedWalletConfig): RadarRelay<InjectedAccount>;
//   // Implementation
//   public static Initialize(rrConfig: RadarRelayConfig, walletConfig: WalletConfig): Sdk {
//     if ((walletConfig as LightWalletConfig).wallet) {
//       return new RadarRelay<LocalAccount>(rrConfig, walletConfig);
//     }
//     if ((walletConfig as RpcWalletConfig).rpcUrl) {
//       return new RadarRelay<RpcAccount>(rrConfig, walletConfig);
//     }
//     if ((walletConfig as InjectedWalletConfig).type) {
//       return new RadarRelay<InjectedAccount>(rrConfig, walletConfig);
//     }
//   }
// }
// const localWalletSdk = SdkManager.Initialize(rrConfig, lightWalletConfig);
// const rpcWalletSdk = SdkManager.Initialize(rrConfig, rpcWalletConfig);
// const injectedWalletSdk = SdkManager.Initialize(rrConfig, injectedWalletConfig);
