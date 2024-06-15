const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require("../bc-poll/compile");

let accounts;
let pollContract;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy
  // the contract
  pollContract = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("PollContract", () => {
  it("deploys a contract", () => {
    console.log("accounts:", "\n", accounts, "\n");
    // console.log(pollContract);
    assert.ok(pollContract.options.address);
  });

  it("allows only owner to create a poll", async () => {
    const resultCreate = await pollContract.methods
      .createPoll(
        "Do you like dogs or cats?",
        "https://blockchain-poll.vsoft.be/images/Dog-and-cat.jpg",
        ["Cats", "Dogs", "None"].map(web3.utils.utf8ToHex)
      )
      .send({
        from: accounts[0],
        gas: "1000000",
      });

    const poll = await pollContract.methods.getPoll(0).call({
      from: accounts[1],
    });

    console.log("getPollResult:", "\n", poll, "\n");
    console.log("createPollResult:", "\n", resultCreate);

    assert.equal(poll[1], "Do you like dogs or cats?");
  });
});
