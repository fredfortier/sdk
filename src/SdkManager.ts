import { RadarRelay } from './RadarRelay';
import { LocalAccount, RpcAccount, InjectedAccount } from './accounts';
import {
  Config,
  LightWalletConfig,
  RpcWalletConfig,
  InjectedWalletConfig,
  WalletType,
  Account} from './types';

export class SdkManager {

  // Setup method signatures
  public static Setup(config: LightWalletConfig): RadarRelay<LocalAccount>;
  public static Setup(config: RpcWalletConfig): RadarRelay<RpcAccount>;
  public static Setup(config: InjectedWalletConfig): RadarRelay<InjectedAccount>;

  /**
   * Create the SDK instance without starting the initialization lifecycle.
   * This allows event listeners to be attached before the starting the lifecycle.
   * @param {Config} config Wallet configuration options
   */
  public static Setup(config: Config) {
    if ((config as LightWalletConfig).wallet) {
      return new RadarRelay(LocalAccount, WalletType.Local, config);
    }

    if ((config as RpcWalletConfig).rpcUrl) {
      return new RadarRelay(RpcAccount, WalletType.Rpc, config);
    }

    if ((config as InjectedWalletConfig).type) {
      return new RadarRelay(InjectedAccount, WalletType.Injected, config);
    }
  }

  /**
   * Start the initialization lifecycle for the SDK instance that was created using Setup.
   * @param {RadarRelayConfig} rrConfig Radar Relay configuration options
   * @param {Config} walletConfig Wallet specific configuration options
   */
  public static async InitializeAsync(sdkInstance: RadarRelay<Account>) {
    await sdkInstance.initializeAsync();
  }

  // Setup & Initialize method signatures
  public static async SetupAndInitializeAsync(config: LightWalletConfig): Promise<RadarRelay<LocalAccount>>;
  public static async SetupAndInitializeAsync(config: RpcWalletConfig): Promise<RadarRelay<RpcAccount>>;
  public static async SetupAndInitializeAsync(config: InjectedWalletConfig): Promise<RadarRelay<InjectedAccount>>;

  /**
   * Create the SDK instance and run the initialization lifecycle
   * @param {Config} config Wallet configuration options
   */
  public static async SetupAndInitializeAsync(config: Config) {
    if ((config as LightWalletConfig).wallet) {
      return await new RadarRelay(LocalAccount, WalletType.Local, config).initializeAsync();
    }

    if ((config as RpcWalletConfig).rpcUrl) {
      return await new RadarRelay(RpcAccount, WalletType.Rpc, config).initializeAsync();
    }

    if ((config as InjectedWalletConfig).type) {
      return await new RadarRelay(InjectedAccount, WalletType.Injected, config).initializeAsync();
    }
  }
}
