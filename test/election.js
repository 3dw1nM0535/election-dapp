// Tests for out smart contract
var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) {

	var electionInstance; // Declare electionInstance to have global scope
	var candidateId;

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

	it("Allow a voter to cast a vote", function() {
		return Election.deployed().then(function(i) {
			electionInstance = i;
			candidateId = 1;
			return electionInstance.vote(candidateId, { from: accounts[0] });
		}).then(function(receipt) {
			return electionInstance.voters(accounts[0]);
		}).then(function(voted) {
			assert(voted, "Voter is marked as voted");
			return electionInstance.candidates(candidateId);
		}).then(function(candidate) {
			var voteCount = candidate[2];
			assert.equal(voteCount, 1, "Increments candidates vote count by 1");
		});
	});

	it("Throws an exception for an invalid candidate", function() {
		return Election.deployed().then(function(i) {
			electionInstance = i;
			return electionInstance.vote(99, { from: accounts[1] });
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, "Error message must contain revert");
			return electionInstance.candidates(1);
		}).then(function(candidate1) {
			var voteCount = candidate1[2];
			assert.equal(voteCount, 1, "Candidate 1 did not receive votes");
			return electionInstance.candidates(2);
		}).then(function(candidate2) {
			var voteCount = candidate2[2];
			assert.equal(voteCount, 0, "Candidate 2 did not receive votes");
		});
	});

	it("Throws an exception for double voting", function() {
		return Election.deployed().then(function(i) {
			electionInstance = i;
			candidateId = 2;
			electionInstance.vote(candidateId, { from: accounts[1] });
			return electionInstance.candidates(candidateId);
		}).then(function(candidate) {
			var voteCount = candidate[2];
			assert.equal(voteCount, 1, "Accepts first vote");

			// Try to vote again
			return electionInstance.vote(candidateId, { from: accounts[1] });
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, "Error message must contain revert");
			return electionInstance.candidates(1);
		}).then(function(candidate1) {
			var voteCount = candidate1[2];
			assert.equal(voteCount, 1, "Candidate 1 did not receive votes");
			return electionInstance.candidates(2);
		}).then(function(candidate2) {
			var voteCount = candidate2[2];
			assert.equal(voteCount, 1, "Candidate 2 did not receive votes");
		});
	});
});
