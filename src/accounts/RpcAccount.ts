import { BaseAccount } from './BaseAccount';
import { WalletType } from '../types';

export class RpcAccount extends BaseAccount {
  public readonly type = WalletType.Rpc;
}
