import {WalletManager} from 'vault-manager';

export class Wallet {

  private 
  
  constructor() {
    
  }

  public async create() {
    // Create a new core wallet
    const wallet = await walletManager.core.createWalletAsync({ password: 'supersecretpassword99' });
  }

  public destroy() {
    
  }
  public export() {
    
  }

}
