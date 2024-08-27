# KickStartPoll

The way to code a solidity contract, compile it, test it and finally deploy it, is inspired from [Stephen Grider's](https://www.udemy.com/user/sgslo/) course "Ethereum and Solidity: The Complete Developer's Guide"

This project was generated with npm.
Make directory and run `npm init` inside the project root, give it a name, accept most proposals, just answer for test script: mocha

```json
"name": "kickstart",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "mocha"
  },
```

## Development Tools used for this app

- [NodeJS](https://nodejs.org/)
- [Visual Studio Code](https://code.visualstudio.com/)

## NPM packages used for this app

install command:
`npm i ganache mocha solc@0.4.26 fs-extra web3@4.10.0`

## Compiling 1

- Move into ethereum directory
- `node compile.js`

## Compiling 2

- Move into ethereum directory
- `node compile4JSON.js`

## Testing

- Be sure to be in main directory
- Be sure using mocha for test scripts in package.json file.
- `npm run test`

## Sepolia

- Get daily free ETH on <https://faucets.chain.link/sepolia>
- Testnet on <https://sepolia.etherscan.io/>
- Check older testnet on <https://goerli.etherscan.io/> (deprecated)

## Infura API

Getting access to the API network
<https://infura.io>

## Your secrets for deploy.js

Add your personal secrets key and account to secrets.js

```js
const metamask = "put here the string with your 12 secrets words";

const sepolia = "your goerli.infura.io https string";

module.exports = { metamask, sepolia };
```

### NPM package to install

install command:
`npm i @truffle/hdwallet-provider`

## Varia

<https://andersbrownworth.com/blockchain/hash>

<https://eth-converter.com/>

<https://iancoleman.io/bip39/>
