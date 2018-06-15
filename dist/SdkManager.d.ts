import { RadarRelay } from './RadarRelay';
import { LocalAccount, RpcAccount, InjectedAccount } from './accounts';
import { LightWalletConfig, RpcWalletConfig, InjectedWalletConfig, Account } from './types';
export declare class SdkManager {
    static Setup(config: LightWalletConfig): RadarRelay<LocalAccount>;
    static Setup(config: RpcWalletConfig): RadarRelay<RpcAccount>;
    static Setup(config: InjectedWalletConfig): RadarRelay<InjectedAccount>;
    /**
     * Start the initialization lifecycle for the SDK instance that was created using Setup
     *
     * @param {RadarRelayConfig} rrConfig Radar Relay configuration options
     * @param {Config} walletConfig Wallet specific configuration options
     */
    static InitializeAsync(sdkInstance: RadarRelay<Account>): Promise<void>;
    static SetupAndInitializeAsync(config: LightWalletConfig): Promise<RadarRelay<LocalAccount>>;
    static SetupAndInitializeAsync(config: RpcWalletConfig): Promise<RadarRelay<RpcAccount>>;
    static SetupAndInitializeAsync(config: InjectedWalletConfig): Promise<RadarRelay<InjectedAccount>>;
}
