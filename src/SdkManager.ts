import { RadarRelay } from './RadarRelay';
import { LocalAccount, RpcAccount, InjectedAccount } from './accounts';
import { RadarRelayConfig,
  WalletConfig,
  LightWalletConfig,
  RpcWalletConfig,
  InjectedWalletConfig,
  WalletType,
  Account} from './types';

export class SdkManager {

  // Setup method signatures
  public static Setup(rrConfig: RadarRelayConfig, walletConfig: LightWalletConfig): RadarRelay<LocalAccount>;
  public static Setup(rrConfig: RadarRelayConfig, walletConfig: RpcWalletConfig): RadarRelay<RpcAccount>;
  public static Setup(rrConfig: RadarRelayConfig, walletConfig: InjectedWalletConfig): RadarRelay<InjectedAccount>;

  /**
   * Create the SDK instance without starting the initialization lifecycle.
   * This allows event listeners to be attached before the starting the lifecycle.
   * @param {RadarRelayConfig} rrConfig Radar Relay configuration options
   * @param {WalletConfig} walletConfig Wallet specific configuration options
   */
  public static Setup(rrConfig: RadarRelayConfig, walletConfig: WalletConfig) {
    if ((walletConfig as LightWalletConfig).wallet) {
      return new RadarRelay(rrConfig, LocalAccount, walletConfig, WalletType.Local);
    }

    if ((walletConfig as RpcWalletConfig).rpcUrl) {
      return new RadarRelay(rrConfig, RpcAccount, walletConfig, WalletType.Rpc);
    }

    if ((walletConfig as InjectedWalletConfig).type) {
      return new RadarRelay(rrConfig, InjectedAccount, walletConfig, WalletType.Injected);
    }
  }

  /**
   * Start the initialization lifecycle for the SDK instance that was created using Setup.
   * @param {RadarRelayConfig} rrConfig Radar Relay configuration options
   * @param {WalletConfig} walletConfig Wallet specific configuration options
   */
  public static async InitializeAsync(sdkInstance: RadarRelay<Account>) {
    await sdkInstance.initializeAsync();
  }

  // Setup & Initialize method signatures
  public static async SetupAndInitializeAsync(rrConfig: RadarRelayConfig, walletConfig: LightWalletConfig): Promise<RadarRelay<LocalAccount>>;
  public static async SetupAndInitializeAsync(rrConfig: RadarRelayConfig, walletConfig: RpcWalletConfig): Promise<RadarRelay<RpcAccount>>;
  public static async SetupAndInitializeAsync(rrConfig: RadarRelayConfig, walletConfig: InjectedWalletConfig): Promise<RadarRelay<InjectedAccount>>;

  /**
   * Create the SDK instance and run the initialization lifecycle
   * @param {RadarRelayConfig} rrConfig Radar Relay configuration options
   * @param {WalletConfig} walletConfig Wallet specific configuration options
   */
  public static async SetupAndInitializeAsync(rrConfig: RadarRelayConfig, walletConfig: WalletConfig) {
    if ((walletConfig as LightWalletConfig).wallet) {
      return await new RadarRelay(rrConfig, LocalAccount, walletConfig, WalletType.Local).initializeAsync();
    }

    if ((walletConfig as RpcWalletConfig).rpcUrl) {
      return await new RadarRelay(rrConfig, RpcAccount, walletConfig, WalletType.Rpc).initializeAsync();
    }

    if ((walletConfig as InjectedWalletConfig).type) {
      return await new RadarRelay(rrConfig, InjectedAccount, walletConfig, WalletType.Injected).initializeAsync();
    }
  }
}
