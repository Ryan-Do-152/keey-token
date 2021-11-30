const BuyKEEYTokens = artifacts.require("BuyKEEYTokens");

module.exports = function (deployer) {
  deployer.deploy(BuyKEEYTokens);
};
