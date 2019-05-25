// To se požene ob ukazu 'truffle migrate'
// Pametna pogodba se bo zapisala v omrežje Ethereum, naša koda pa bo dobila referenco do vmesnika

var Igralnica = artifacts.require("./Igralnica.sol");

module.exports = function(deployer) {
  deployer.deploy(Igralnica);
};
