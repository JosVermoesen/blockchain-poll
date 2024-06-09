const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { interface, bytecode } = require("./compile");

const secrets = require("./../secrets/secrets");
const provider = new HDWalletProvider(secrets.metamask, secrets.sepolia);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ gas: "1000000", from: accounts[0] });

  console.log(interface);
  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};
deploy();

// Contract was deployed to:
// 0x8531d5814Bdc767CafbacB8b97029B9314148663 08/06/2024
// 0xAd511E843EeEee5538be46C0a723b86fF4235df8 09/06/2024
