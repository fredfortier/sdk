import { RadarRelay } from './RadarRelay';
import { LocalAccount, RpcAccount, InjectedAccount } from './accounts';
import { RadarRelayConfig, LightWalletConfig, RpcWalletConfig, InjectedWalletConfig, Account } from './types';
export declare class SdkManager {
    static Setup(rrConfig: RadarRelayConfig, walletConfig: LightWalletConfig): RadarRelay<LocalAccount>;
    static Setup(rrConfig: RadarRelayConfig, walletConfig: RpcWalletConfig): RadarRelay<RpcAccount>;
    static Setup(rrConfig: RadarRelayConfig, walletConfig: InjectedWalletConfig): RadarRelay<InjectedAccount>;
    /**
     * Start the initialization lifecycle for the SDK instance that was created using Setup.
     * @param {RadarRelayConfig} rrConfig Radar Relay configuration options
     * @param {WalletConfig} walletConfig Wallet specific configuration options
     */
    static InitializeAsync(sdkInstance: RadarRelay<Account>): Promise<void>;
    static SetupAndInitializeAsync(rrConfig: RadarRelayConfig, walletConfig: LightWalletConfig): Promise<RadarRelay<LocalAccount>>;
    static SetupAndInitializeAsync(rrConfig: RadarRelayConfig, walletConfig: RpcWalletConfig): Promise<RadarRelay<RpcAccount>>;
    static SetupAndInitializeAsync(rrConfig: RadarRelayConfig, walletConfig: InjectedWalletConfig): Promise<RadarRelay<InjectedAccount>>;
}
