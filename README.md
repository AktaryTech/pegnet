[![https://nodei.co/npm/pegnet.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/pegnet.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/pegnet)

[![Node version](https://img.shields.io/node/v/pegnet.svg?style=flat)](http://nodejs.org/download/)

# PEGNET

Typescript-based library for interacting with the Pegnet stablecoin network in Node.js.

*This library is not (currently) for [mining](https://github.com/pegnet/PegNet/wiki/Mining).*

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
By default, this package will connect to the publicly-hosted (pNode)[www.pegnetd.com] for Pegnet queries. You can alternatively choose to install and use a locally-running (pegnetd)[https://github.com/pegnet/pegnetd].

These values can be set by passing a config object when instantiating:

    pegnetd?: string;  // instance of pegnetd. Defaults to pegnetd.com.
    server?: string;  // instance of factom.  Defaults to localhost.
    wallet?: string;  // instance of factom-wallet.  Defaults to localhost.
    walletUser?: string;  // wallet username
    walletPass?: string;  // wallet password
    pegnetChain?: string;  // hash of pegnet chain on the factom server specified above

### Methods
All of the GET methods specified here are currently supported: https://github.com/pegnet/pegnetd/wiki/API
The names of the functions are simply camel case versions of those specified by the API docs, so for example, `get-pegnet-balances` becomes `getPegnetBalances()`.  See `pegnet.test.ts` for examples of usage.

## Important links
Specific to Pegnet and `pegnetd`
- https://github.com/pegnet/pegnetd
- https://pegnetd.com
- https://github.com/pegnet/pegnetd/wiki

For creating pegnet transactions
- https://factomize.com/how-to-setup-the-pegnet-ecosystem-for-conversions-and-transfers/
- https://docs.factomprotocol.org/start/hello-world-examples/javascript
- https://github.com/PaulBernier/factom-dev-stack
- https://hackmd.io/EfSzduXqQ8yyD9vBYK3E-w?view
- https://github.com/pegnet/pegnet/blob/develop/Docker.md


## Contributing
Contributors and pull requests are welcome.

### Testing
`yarn test` compiles Typescript files and runs mocha tests. Good for simple query tests.

`yarn test:all` compiles Typescript files, starts local factom, runs mocha tests.  For reading data and writing transactions.

