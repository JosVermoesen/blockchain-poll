const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'pollcontract.sol');
const source = fs.readFileSync(campaignPath, 'utf8');
const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);

for (let contract in output) {
  contractName = contract.replace(':', '');
  fs.outputJsonSync(
    path.resolve(buildPath, contractName + '.json'),
    output[contract]
  );
  const { interface, bytecode } = solc.compile(source, 1).contracts[
    ':' + contractName
  ];
  // console.log(interface);

  fs.outputFileSync(
    path.resolve(buildPath, contractName + 'ABI.json'),
    interface
  );
}