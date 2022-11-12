# NgBlockchainPoll

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.5.

## Getting started for developers

- [Install NodeJS](https://nodejs.org/). Hint: eventually install and use [nvm](https://medium.com/@Joachim8675309/installing-node-js-with-nvm-4dc469c977d9) for easy installing and/or switching between node versions
- Clone this repository: `git clone https://github.com/JosVermoesen/ng-blockchain-poll`.
- Run `npm install` inside the project root.
- Run `ng serve` or `npm start` in a terminal from the project root.
- Profit. :tada:

## Development Tools used for this app

- [NodeJS](https://nodejs.org/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Angular CLI](https://www.npmjs.com/package/@angular/cli): `npm i -g @angular/cli`
- [Remix for ethereum](https://remix.ethereum.org/)
- [Ganache](https://trufflesuite.com/ganache/)
- [Metamask](https://metamask.io/)

## NPM packages used for this app

### 1. bootstrap and bootswatch

`npm i bootstrap bootswatch` to install bootstrap and the open source bootswatch themes

#### set in file styles.scss your prefered theme:

```scss
@import "~bootswatch/dist/sandstone/bootstrap.min.css";

// Or use variables, e.g.:
// $h1-font-size: 3rem;
// @import "~bootswatch/dist/[theme]/variables";
// @import "~bootstrap/scss/bootstrap";
// @import "~bootswatch/dist/[theme]/bootswatch";
```

### 2. Apex charting

`npm i apexcharts` to install open source [Apex charting](https://apexcharts.com/) component.

### 3. Web3

`npm i web3 web3-eth-contract` to install the [web3 ethereum](https://github.com/topics/ethereum?q=ethereum%2Fweb3) service component and the web3 contract package.

#### add in file polyfill.ts:

```ts
import "zone.js"; // Included with Angular CLI.

import * as process from "process";
import { Buffer } from "buffer";

window.process = process;
(window as any).global = window;
global.Buffer = global.Buffer || Buffer;
```

#### add in file angular.json extra options;

```json
"allowedCommonJsDependencies": [
    "hash.js",
    "web3-utils"
],
```

#### for building, increase budgets in angular.json;

```json
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "3mb",
    "maximumError": "4mb"
  },
  {
    "type": "anyComponentStyle",
    "maximumWarning": "2kb",
    "maximumError": "4kb"
  }
],
```

### 4. Angular 12+

- `npm i stream-browserify`
- `npm i assert`
- `npm i crypto-browserify`
- `npm i stream-http`
- `npm i https-browserify`
- `npm i os-browserify`
- `npm i url`: see [node-url on github](https://github.com/defunctzombie/node-url#readme), [nodejs documentation](https://nodejs.org/api/url.html)

- or just install all in one command stroke:
  `npm i stream-browserify assert crypto-browserify stream-http https-browserify os-browserify url`

#### add in tsconfig.json:

```json
"compilerOptions": {
    "paths": {
      "stream": [
        "./node_modules/stream-browserify"
      ],
      "assert": [
        "./node_modules/assert"
      ],
      "crypto": [
        "./node_modules/crypto-browserify"
      ],
      "http": [
        "./node_modules/stream-http"
      ],
      "https": [
        "./node_modules/https-browserify"
      ],
      "os": [
        "./node_modules/os-browserify"
      ],
      "url": [
        "./node_modules/url"
      ],
    },
```

#### poll.sol code to compile and deploy with Remix:

```c++
// SPDX-License-Identifier: MIT
pragma solidity ^0.4.26;

contract PollContract {

    struct Poll {
        uint256 id;
        string question;
        string thumbnail;
        uint64[] votes;
        bytes32[] options;
    }

    struct Voter {
        address id;
        uint256[] votedIds;
        mapping(uint256 => bool) votedMap;
    }

    Poll[] private polls;
    mapping(address => Voter) private voters;

    event PollCreated(uint256 _pollId);
    event PollVoted(uint256 _pollId);

    function createPoll(string memory _question, string memory _thumb, bytes32[] memory  _options) public {
        require(bytes(_question).length > 0, "Empty question");
        require(_options.length > 1, "At least 2 options required");

        uint256 pollId = polls.length;

        Poll memory newPoll = Poll({
            id: pollId,
            question: _question,
            thumbnail: _thumb,
            options: _options,
            votes: new uint64[](_options.length)
        });

        polls.push(newPoll);
        emit PollCreated(pollId);
    }

    function getPoll(uint256 _pollId) external view returns(uint256, string memory, string memory, uint64[] memory, bytes32[] memory) {
        require(_pollId < polls.length && _pollId >= 0, "No poll found");
        return (
            polls[_pollId].id,
            polls[_pollId].question,
            polls[_pollId].thumbnail,
            polls[_pollId].votes,
            polls[_pollId].options
        );
    }

    function vote(uint256 _pollId, uint64 _vote) external {
        require(_pollId < polls.length, "Poll does not exist");
        require(_vote < polls[_pollId].options.length, "Invalid vote");
        require(voters[msg.sender].votedMap[_pollId] == false, "You already voted");

        polls[_pollId].votes[_vote] +=1 ;

        voters[msg.sender].votedIds.push(_pollId);
        voters[msg.sender].votedMap[_pollId] = true;

        emit PollVoted(_pollId);
    }

    function getVoter(address _id) external view returns(address, uint256[] memory) {
        return (
            voters[_id].id,
            voters[_id].votedIds
        );
    }

    function getTotalPolls() external view returns(uint256) {
        return polls.length;
    }
}
```

## Angular Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
