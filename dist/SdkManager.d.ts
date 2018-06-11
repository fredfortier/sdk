import { RadarRelay } from './RadarRelay';
import { LocalAccount, RpcAccount, InjectedAccount } from './accounts';
import { RadarRelayConfig, LightWalletConfig, RpcWalletConfig, InjectedWalletConfig } from './types';
export declare class SdkManager {
    static InitializeAsync(rrConfig: RadarRelayConfig, walletConfig: LightWalletConfig): Promise<RadarRelay<LocalAccount>>;
    static InitializeAsync(rrConfig: RadarRelayConfig, walletConfig: RpcWalletConfig): Promise<RadarRelay<RpcAccount>>;
    static InitializeAsync(rrConfig: RadarRelayConfig, walletConfig: InjectedWalletConfig): Promise<RadarRelay<InjectedAccount>>;
}
