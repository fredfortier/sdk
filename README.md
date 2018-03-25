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
import RadarRelaySDK from 'radar-relay-sdk';

const rrsdk = new RadarRelaySDK();

// unlocked node RPC endpoint,  API endpoint
rrsdk.initialize('http://localhost:8545', 'http://localhost:8080'); 


// initialize
// ----------
// called automatically on initialize
// but can be called at any point
// each will trigger an event (see events below)
rrsdk.setEthereumConnectionAsync
rrsdk.setEthereumNetworkIdAsync
rrsdk.setAccount
rrsdk.setApiEndpoint
rrsdk.fetchMarketData
rrsdk.updateZeroEx
rrsdk.updateTradeExecutor
rrsdk.updateMarkets

// events
// ------
// anything that triggers state change (like changing the network, or a fill)
// fires an event that you can listen to
rrsdk.events.on(
  'marketDataUpdated | ethereumNetworkIdUpdated | zeroExUpdated | ethereumNetworkUpdated | accountUpdated | apiEndpointUpdated | transactionPending | transactionMined'
)
rrsdk.events.emit('see_above' | 'or you can emit anything', with, some, data)

// account data
// -------------
rrsdk.account.getEthBalanceAsync
rrsdk.account.transferEthAsync
rrsdk.account.wrapEthAsync
rrsdk.account.unwrapEthAsync
rrsdk.account.getTokenBalanceAsync
rrsdk.account.getTokenAllowanceAsync
rrsdk.account.setTokenAllowanceAsync
rrsdk.account.getFillsAsync
rrsdk.account.getOrdersAsync

// markets
// -------
// markets are marketId mapped Market classes with all 
// the same methods and the following instance vars:
rrsdk.markets.get('ZRX-WETH') 
{
    baseTokenAddress
    quoteTokenAddress
    baseTokenDecimals
    quoteTokenDecimals
    baseMinSize
    baseMaxSize
    quoteIncrement // analogous to the current "precision"
    displayName
}

// market class methods
rrsdk.markets.get('ZRX-WETH').limitOrderAsync
rrsdk.markets.get('REP-WETH').marketOrderAsync
rrsdk.markets.get('ZRX-WETH').getFillsAsync
rrsdk.markets.get('ZRX-WETH').getCandlesAsync
rrsdk.markets.get('ZRX-WETH').getTickerAsync
rrsdk.markets.get('ZRX-WETH').getOrderBookAsync

// [WIP] Websockets 
// -----------------
rrsdk.ws.subscribe('ZRX-WETH', 'baseTokenAddress:quoteTokenAddress') // book state changes (new, remove, fills)
```