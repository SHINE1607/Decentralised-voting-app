pragma solidity >=0.5;


contract Election {
    // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Read/write candidates
    mapping(uint => Candidate) public candidates;
    //store the accounts that have voted
    mapping(address => bool) public voters;
    // Store Candidates Count
    uint public candidatesCount;
    address currentVoter;

    constructor() public {
        //creatin new candidtaes
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    event votedEvent(
        uint indexed _candidateId
    );

    function addCandidate (string memory  _name) private {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    //voting function
    function vote(uint _candidateId) public{

        //require tyhey hav not voted before
        require((!voters[msg.sender]), "Srry your vote already Counted!!");

        //require a avalid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Srry You are not not a valid candidate");

        //record the voters unique vote
        voters[msg.sender] = true;

        // update candidate vote Count
        candidates[_candidateId].voteCount ++;

        //triggering the event
        emit votedEvent(_candidateId);
    }

    function getCurrentVoter () public view returns(address){
        return msg.sender;
    }


}