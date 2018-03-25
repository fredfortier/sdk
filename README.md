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

## Using the SDK

`npm install radar-relay-sdk`

```javascript
import RadarRelaySDK from 'radar-relay-sdk';

const rrsdk = new RadarRelaySDK();
rrsdk.initialize('http://localhost:8545'); // unlocked node RPC endpoint


// initialize
// ----------
// called automatically on initialize
// but can be called at any point
// each will trigger an event (see events below)
rrsdk.setEthereumNetworkIdAsync
rrsdk.setEthereumConnectionAsync
rrsdk.setAccount
rrsdk.setApiEndpoint
rrsdk.fetchMarketData

// events
// ------
// anything that triggers state change (like changing the network, or a fill)
// fires an event that you can listen to
rrsdk.events.on(
  'marketDataUpdated | ethereumNetworkIdUpdated | zeroExUpdated | ethereumNetworkUpdated | accountUpdated | apiEndpointUpdated | pendingTransaction | minedTransaction'
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
rrsdk.markets['ZRX-WETH'] = {
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
rrsdk.markets['ZRX-WETH'].limitOrderAsync
rrsdk.markets['REP-WETH'].marketOrderAsync
rrsdk.markets['ZRX-WETH'].getFillsAsync
rrsdk.markets['ZRX-WETH'].getCandlesAsync
rrsdk.markets['ZRX-WETH'].getTickerAsync
rrsdk.markets['ZRX-WETH'].getOrderBookAsync

// Websockets (WIP)
// -----------------
rrsdk.ws.subscribe('ZRX_WETH', 'book') // book state changes (like prunes, cancels, fills, etc.)
rrsdk.ws.subscribe('ZRX_WETH', 'candles')
rrsdk.ws.subscribe('ZRX_WETH', 'ticker') // specifically fills
```