pragma solidity ^0.4.2;

contract Election {
	// Model a candidate
	struct Candidate {
		uint id;
		string name;
		uint voteCount;
	}
	// Store account that has voted
	mapping(address => bool) public voters;
	// Store candidates
	// Fetch candidate
	mapping(uint => Candidate) public candidates;
	// Store candidates count
	uint public candidatesCount;

	// Vote Event
	event votedEvent (
		uint indexed _candidateId
	);

	function Election() public {
		// Add candidate once contract is deployed
		addCandidate("Candidate 1");
		addCandidate("Candidate 2");
	}

	// Add candidate
	function addCandidate(string _name) private {
		candidatesCount++;
		candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
	}

	// Cast vote
	function vote(uint _candidateId) public {
		// Require that an account has not voted
		require(!voters[msg.sender]);

		// Require a valid candidate
		require(_candidateId > 0 && _candidateId <= candidatesCount);

		// Record that account has voted
		voters[msg.sender] = true;
		
		// Cast a vote
		candidates[_candidateId].voteCount++;

		// Trigger voted event
		emit votedEvent(_candidateId);
	}
}
