[![https://nodei.co/npm/pegnet.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/pegnet.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/pegnet)

[![Node version](https://img.shields.io/node/v/[pegnet].svg?style=flat)](http://nodejs.org/download/)

# PEGNET

Typescript-based library for interacting with the Pegnet stablecoin network in Node.js.

## Installation
```
yarn add pegnet
```
or
```
npm install pegnet
```

This is sufficient to get you up and running to query Pegnet.  

>*WRITING TRANSACTIONS IS IN ACTIVE DEVELOPMENT AND NOT YET SUPPORTED. However, when it is...*
> If you also want to write transactions to Pegnet, you must specify which Factom server and wallet to use.  For local development, use the [Factom Development Stack](https://github.com/PaulBernier/factom-dev-stack).  For test/live, configure the library as specified in Configuration below.


## Usage
```
const { Pegnet } = require('pegnet');
const pegnet = new Pegnet(config);
```

### Configuration
By default, this package will connect to the publicly-hosted pNode for Pegnet queries.

These values can be set by passing a config object when instantiating:

    pegnetd: string;  // instance of pegnetd
    server?: string;  // instance of factom
    wallet?: string;  // instance of factom-wallet
    walletUser?: string;  // wallet username
    walletPass?: string;  // wallet password
    pegnetChain?: string;  // hash of pegnet chain on the factom server specified above

### Methods
All of the GET methods specified here are currently supported: https://github.com/pegnet/pegnetd/wiki/API
The names of the functions are simply camel case versions of those specified by the API docs, so for example, `get-pegnet-balances` becomes `getPegnetBalances()`.  See `pegnet.test.ts` for examples of usage.

## Important links
Specific to Pegnet and `pegnetd`
- https://pegnetd.com
- https://github.com/pegnet/pegnetd/wiki

For creating pegnet transactions
- https://factomize.com/how-to-setup-the-pegnet-ecosystem-for-conversions-and-transfers/
- https://docs.factomprotocol.org/start/hello-world-examples/javascript
- https://github.com/PaulBernier/factom-dev-stack
- https://hackmd.io/EfSzduXqQ8yyD9vBYK3E-w?view


## Contributing
Contributors and pull requests are welcome.

### Testing
`yarn test` compiles Typescript files and runs mocha tests. Good for simple query tests.

`yarn test:all` compiles Typescript files, starts local factom, runs mocha tests.  For reading data and writing transactions.

## Donations
FCT: FA2GkH2DH6m8cdoPQyWBtoNdwr1qAV9vERVYVQjcXaGmrxTRbpjw

ETH: 0x44E0117d895375479773A1f1F60B952110F25a0a

BTC: bc1qn89rkcz7j4gtt3he2hm5dkxvz286we5mmw0tjs
