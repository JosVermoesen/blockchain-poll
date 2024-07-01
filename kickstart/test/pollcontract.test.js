const assert = require("assert");
const ganache = require("ganache");
const { Web3 } = require("web3");
const ethers = require("ethers");
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

  let answer1;
  let answer2;
  let answer3;

  it("only owner can create polls", async () => {
    answer1 = ethers.encodeBytes32String("Cats");
    answer2 = ethers.encodeBytes32String("Dogs");
    answer3 = ethers.encodeBytes32String("None");
    console.log("answer1:", answer1);
    console.log("answer2:", answer2);
    console.log("answer3:", answer3);

    let resultCreate = await pollContract.methods
      .createPoll(
        "Do you like dogs or cats?",
        "https://blockchain-poll.vsoft.be/images/Dog-and-cat.jpg",
        [answer1, answer2, answer3]
      )
      .send({
        from: accounts[0],
        gas: "1000000",
      });
    // console.log("createPollResult:", "\n", resultCreate);

    let createdPoll = await pollContract.methods.getPoll(0).call({
      from: accounts[1],
    });
    assert.equal(createdPoll[1], "Do you like dogs or cats?");
    // console.log("createdPoll:", "\n", createdPoll, "\n");

    answer1 = ethers.encodeBytes32String("Pancakes");
    answer2 = ethers.encodeBytes32String("Waffles");
    answer3 = ethers.encodeBytes32String("Cereal");
    answerArray = [answer1, answer2, answer3];
    console.log("answerArray:", answerArray);

    resultCreate = await pollContract.methods
      .createPoll(
        "Preferred breakfast?",
        "https://blockchain-poll.vsoft.be/images/breakfast.jpg",
        [answer1, answer2, answer3]
      )
      .send({
        from: accounts[0],
        gas: "1000000",
      });
    // console.log("createPollResult:", "\n", resultCreate);

    createdPoll = await pollContract.methods.getPoll(1).call({
      from: accounts[1],
    });
    assert.equal(createdPoll[1], "Preferred breakfast?");
    // console.log("createdPoll:", "\n", createdPoll, "\n");

    let voteResult = await pollContract.methods
      .vote(0, 2)
      .send({ from: accounts[1], gas: "1000000" });
    // console.log("voteResult0:", "\n", voteResult, "\n");

    voteResult = await pollContract.methods
      .vote(1, 0)
      .send({ from: accounts[1], gas: "1000000" });
    // console.log("voteResult1:", "\n", voteResult, "\n");

    totalPolls = await pollContract.methods.getTotalPolls().call();
    assert.equal(totalPolls, 2);
  });
});
