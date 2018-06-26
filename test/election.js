// Tests for out smart contract
var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) {

	var electionInstance; // Declare electionInstance to have global scope

	it("Contract initializes with two candidates", function() {
		return Election.deployed().then(function(i) {
			return i.candidatesCount();
		}).then(function(count) {
			assert.equal(count, 2);
		});
	});

	it("Contract initializes candidates with the correct values", function() {
		return Election.deployed().then(function(i) {
			electionInstance = i;
			return electionInstance.candidates(1);
		}).then(function(candidate) {
			assert.equal(candidate[0], 1, "Contains the correct id");
			assert.equal(candidate[1], "Candidate 1", "Contains the correct name");
			assert.equal(candidate[2], 0, "Contains the correct vote count");
			return electionInstance.candidates(2);
		}).then(function(candidate) {
			assert.equal(candidate[0], 2, "Contains the correct id");
			assert.equal(candidate[1], "Candidate 2", "Contains the correct name");
			assert.equal(candidate[2], 0, "Contains the correct vote count");
		});
	});
});
