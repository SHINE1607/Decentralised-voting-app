var Election = artifacts.require("./Election.sol");

module.exports = function(deployer) {
  console.log("shine")
  deployer.deploy(Election);
};