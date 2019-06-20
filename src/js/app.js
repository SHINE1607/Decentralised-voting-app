App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  instance: null,

  //function to init the contract
  init: function() {
    return App.initWeb3();
  },

  //function to ninstialise the provider
  initWeb3: function() {
    //if the metamask has already provided with provider
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');

    }
    web3 =  new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    //reading the json file from the election.json file 
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);
      //calling the function to listen for events 
      App.listenforEvents();

      return App.render();
    });
  },

  render: function() {
    var electionInstance;
    
    var loader = document.getElementById("loader");
    var content = document.getElementById("content");

    loader.style.display  = "block";
    content.style.display  = "none";

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        //defing the current account to vote 
        App.account = account;
        
        $("#accountAddress").html("Your Account address: " + account);
      }
    });

    // Load contract data
    //deploying the contract  and creating an instance of it 
    App.contracts.Election.deployed().then(function(instance) {
      console.log("shine")
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function(candidatesCount) {

        var candidatesResults = $("#candidatesResults");
        candidatesResults.empty();

        var candidatesSelect = $('#candidatesSelect');
        candidatesSelect.empty();

      for (var i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];
          // Render candidate Result
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
          candidatesResults.append(candidateTemplate);

          var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
        candidatesSelect.append(candidateOption);
        });
      }
      return electionInstance.voters(App.account);
      
    //ahs voted is boolean value retuned by the voters mapping
    }).then(hasVoted => {
      if(hasVoted){
        //form is hidden and the user cant vote twice 
        $("form").hide;
      }
      loader.style.display = "none";
      content.style.display = "block";
      $("#errorAlert").hide();
      $("#successAlert").hide();
    }).catch(function(error) {

      console.warn(error);
    });
  },

  castVote: () => {
    candidateId = document.getElementById("candidatesSelect").value;
    App.contracts.Election.deployed().then(instance => {
      electionInstance = instance
      return instance.vote(candidateId)
    }).then((result) => {
      console.log(result)
      $("#errorAlert").hide();

      $("#successAlert").show();

    }).catch(err =>{  
      $("#errorAlert").show();

      console.log(err.message);
    })
  },

  listenforEvents :() => {
    console.log("the evnets are listened!!!")
    App.contracts.Election.deployed(instance =>{
        instance.votedEvent({}, {
          fromBlock:0,
          toBlock : "latest"
        }).watch((error, event) => {
          console.log("event Triggered");
          App.render()

        }).catch(err =>{
          console.log(err)
        })
    })
  }
      
      
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});