import { RadarRelay } from './RadarRelay';
import { LocalAccount, RpcAccount, InjectedAccount } from './accounts';
import { RadarRelayConfig,
  WalletConfig,
  LightWalletConfig,
  RpcWalletConfig,
  InjectedWalletConfig,
  WalletType} from './types';

export class SdkManager {

  // Method signatures
  public static async InitializeAsync(rrConfig: RadarRelayConfig, walletConfig: LightWalletConfig): Promise<RadarRelay<LocalAccount>>;
  public static async InitializeAsync(rrConfig: RadarRelayConfig, walletConfig: RpcWalletConfig): Promise<RadarRelay<RpcAccount>>;
  public static async InitializeAsync(rrConfig: RadarRelayConfig, walletConfig: InjectedWalletConfig): Promise<RadarRelay<InjectedAccount>>;

  /**
   * Initialize the appropriate sdk
   * @param {RadarRelayConfig} rrConfig Radar Relay configuration options
   * @param {WalletConfig} walletConfig Wallet specific configuration options
   */
  public static async InitializeAsync(rrConfig: RadarRelayConfig, walletConfig: WalletConfig) {
    if ((walletConfig as LightWalletConfig).wallet) {
      return await new RadarRelay<LocalAccount>(rrConfig, LocalAccount).initialize(walletConfig, WalletType.Local);
    }

    if ((walletConfig as RpcWalletConfig).rpcUrl) {
      return await new RadarRelay<RpcAccount>(rrConfig, RpcAccount).initialize(walletConfig, WalletType.Rpc);
    }

    if ((walletConfig as InjectedWalletConfig).type) {
      return await new RadarRelay<InjectedAccount>(rrConfig, InjectedAccount).initialize(walletConfig, WalletType.Injected);
    }
  }
}
