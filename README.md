# Radar Relay SDK

## Setting up an Ethereum Node

**Install Parity**

```
brew install parity
```

**Run Parity Node**
```
parity --jsonrpc-hosts=all \
       --jsonrpc-interface=all \
       --ws-origins=all \
       --ws-hosts=all \
       --ws-interface=all \
       --chain=kovan \
       --base-path /path/for/ethereum_node_data
```

**Create a trading Account**

```
~parity account new
~enter password (don't lose this)
```

**Create Node Config File**

create `/path/to/parity-config.toml`

```
[account]
unlock = ["0x000000000000000000000000000000000000"] (account address created above)
password = ["/home/{account}/.parity-account-pass"] (password saved in plain text)
```

**Run Parity with Unlocked Account**

__NOTE: this is dangerous, use at your own risk. Should be done on a computer free of malware and a strict firewall__

```
parity --jsonrpc-hosts=all \
       --jsonrpc-interface=all \
       --ws-origins=all \
       --ws-hosts=all \
       --ws-interface=all \
       --chain=kovan \
       --config /path/to/parity-config.toml \
       --base-path /path/for/ethereum_node_data
```

## SDK Init / State Change Lifecycle

### Overview

The Ethereum and 0x.js application loading lifecycle is difficult to manage, especially when designing for optimized state changes. Specifically, changing RPC Networks, switching accounts, and updating API endpoints. To manage the lifecycle more efficiently, the Radar Relay SDK utilizes a combination of the following:

* [`EventEmitter`](https://nodejs.org/api/events.html)
* [`SDKInitLifeCycle `](https://github.com/RadarRelay/radar-relay-sdk/blob/beta/src/sdk-init-lifecycle.ts)

--- 

The `SDKInitLifeCycle` class works as follows:

Define an array that consists of: 

   1. `event`, which when triggered will then call the defined
   2. `func` the function that is called when this event is triggered (ideally the next in priority)
   3. `priority` an integer that defines the priority of this method.

Once the `currentPriority` has hit 0, the promise will resolve. If an error occurs along the lifecycle, the timeout will occur after 10s and reject the promise.

Each init method must trigger an event on the `EventEmitter`, which indicates the method is done as well as return the `SDKInitLifeCycle.promise()`


### Life Cycle

![](https://docs.google.com/drawings/d/e/2PACX-1vS-ZE8iqFN6qm9iY_pqtJfElw2iwR-THeM1MuUYCH4H_9uAMAOv1ogEt72f0SuEZFB6tnfd4hm7NGuo/pub?w=929&h=580)



## SDK Usage

`~ npm install radar-relay-sdk`

```javascript
import RadarRelay from 'radar-relay-sdk';

const rr = new RadarRelay();

// unlocked node RPC endpoint,  API endpoint
rr.initialize({
  password?: string; // set if using local wallet
  walletRpcUrl?: string; // set if using unlocked node
  radarRelayEndpoint?: string; // endpoint for radar relay's api: e.g. https://api.radarrelay.com
  defaultGasPrice?: BigNumber; // set a gas price to default to
  dataRpcUrl: string; // required Ethereum RPC node url e.g. https://mainnet.infura.io/{your-api-key}
}); 

// initialize
// ----------
// called automatically on initialize
// but can be called at any point
// each will trigger an event (see events below)
rr.initialize
rr.setEthereumAsync

// events
// ------
// anything that triggers state change (like changing the network, or a fill)
// fires an event that you can listen to
rr.events.on(
  'ethereumNetworkUpdated | ethereumNetworkIdInitialized | zeroExInitialized | tokensInitialized | accountInitialized | tradeInitialized | marketsInitialized | transactionPending | transactionMined'
)
rr.events.emit('see_above' | 'or you can emit anything', with, some, data)

// account data
// -------------
rr.account.getAvailableAddressesAsync
rr.account.setAddressAsync
rr.account.getEthBalanceAsync
rr.account.transferEthAsync
rr.account.wrapEthAsync
rr.account.unwrapEthAsync
rr.account.getTokenBalanceAsync
rr.account.getTokenAllowanceAsync
rr.account.setTokenAllowanceAsync
rr.account.getFillsAsync
rr.account.getOrdersAsync

// markets
// -------
// markets are marketId mapped Market classes with all 
// the same methods and the following instance vars:
rr.markets.get('ZRX-WETH') 
{
  id: string;
  baseTokenAddress: string;
  quoteTokenAddress: string;
  baseTokenDecimals: BigNumber;
  quoteTokenDecimals: BigNumber;
  minOrderSize: BigNumber;
  maxOrderSize: BigNumber;
  quoteIncrement: BigNumber;
  displayName: string;
}

// market class methods
rr.markets.get('ZRX-WETH').limitOrderAsync
rr.markets.get('REP-WETH').marketOrderAsync
rr.markets.get('REP-WETH').cancelOrderAsync
rr.markets.get('ZRX-WETH').getFillsAsync
rr.markets.get('ZRX-WETH').getCandlesAsync
rr.markets.get('ZRX-WETH').getTickerAsync
rr.markets.get('ZRX-WETH').getOrderBookAsync

// [WIP] Websockets 
// -----------------
rr.ws.subscribe('ZRX-WETH', 'baseTokenAddress:quoteTokenAddress') // book state changes (new, remove, fills)
```