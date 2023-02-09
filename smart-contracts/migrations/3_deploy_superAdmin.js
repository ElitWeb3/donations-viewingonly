// const DonationsNFTICO = artifacts.require('./DonationsSuperAdminICO.sol');
// const DonationsToken = artifacts.require('./DonationsToken.sol');

// module.exports = async function (deployer, network, accounts) {

//   const deployedToken = await DonationsToken.deployed();
//   const _token = deployedToken.address;
  
//   const _wallet = 'xdc8e732e7aa8c4581272a93d3b08a0bfeacc68769a';     // Replace with Admin address                                        // TODO: Replace me: 50 Million for ICO

  
//   await deployer.deploy(
//     DonationsNFTICO,
//     _token
//   );

//   const deployedICO = await DonationsNFTICO.deployed();
//   console.log(`*****deployedICO superadmin`, deployedICO.address);

//   /**********Add Minter********************* */
// //   await deployedToken.addMinter(deployedICO.address);
// //   await deployedToken.addMinter(_wallet);
// };

// const duration = {
//   seconds: function (val) { return val; },
//   minutes: function (val) { return val * this.seconds(60); },
//   hours: function (val) { return val * this.minutes(60); },
//   days: function (val) { return val * this.hours(24); },
//   weeks: function (val) { return val * this.days(7); },
//   months: function (val) { return val * this.days(30); },
//   years: function (val) { return val * this.days(365); },
// };

// const ether = (n) => new web3.utils.BN(web3.utils.toWei(n.toString(), 'ether'));