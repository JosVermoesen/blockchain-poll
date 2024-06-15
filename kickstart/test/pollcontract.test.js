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
    // console.log("accounts:", "\n", accounts, "\n");
    // console.log(pollContract);
    assert.ok(pollContract.options.address);
  });

  it("allows only owner to create a poll", async () => {
    let resultCreate = await pollContract.methods
      .createPoll(
        "Do you like dogs or cats?",
        "https://blockchain-poll.vsoft.be/images/Dog-and-cat.jpg",
        ["Cats", "Dogs", "None"].map(web3.utils.utf8ToHex)
      )
      .send({
        from: accounts[0],
        gas: "1000000",
      });
    // console.log("createPollResult:", "\n", resultCreate);

    let createdPoll = await pollContract.methods.getPoll(0).call({
      from: accounts[1],
    });
    // console.log("createdPoll:", "\n", createdPoll, "\n");
    assert.equal(createdPoll[1], "Do you like dogs or cats?");

    resultCreate = await pollContract.methods
      .createPoll(
        "Preferred breakfast?",
        "https://blockchain-poll.vsoft.be/images/breakfast.jpg",
        ["English", "Continental", "Full Scottish"].map(web3.utils.utf8ToHex)
      )
      .send({
        from: accounts[0],
        gas: "1000000",
      });
    // console.log("createPollResult:", "\n", resultCreate);

    createdPoll = await pollContract.methods.getPoll(1).call({
      from: accounts[1],
    });
    // console.log("createdPoll:", "\n", createdPoll, "\n");
    assert.equal(createdPoll[1], "Preferred breakfast?");

    let voteResult = await pollContract.methods
      .vote(0, 2)
      .send({ from: accounts[1], gas: "1000000" });
    // console.log("voteResult0:", "\n", voteResult, "\n");

    voteResult = await pollContract.methods
      .vote(1, 0)
      .send({ from: accounts[1], gas: "1000000" });
    // console.log("voteResult1:", "\n", voteResult, "\n");

    totalPolls = await pollContract.methods.getTotalPolls().call();
    console.log("getTotalPollsResult:", "\n", totalPolls, "\n");
  });
});
