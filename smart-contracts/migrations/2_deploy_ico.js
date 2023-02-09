const DonationsNFTICO = artifacts.require('./DonationsICO.sol');
// const DonationsToken = artifacts.require('./XRC1155/XRC1155.soll');

module.exports = async function (deployer, network, accounts) {

  // const deployedToken = await DonationsToken.deployed();
  const _token = "0x8e732e7aa8c4581272a93d3b08a0bfeacc68769a";
  // const _token = deployedToken.address;
  
  const _wallet1 = '0x8e732e7aa8c4581272a93d3b08a0bfeacc68769a';     // Replace with Admin address                                        // TODO: Replace me: 50 Million for ICO
  const _wallet2 = '0xeffb853f2ca0c5cb0a41548da63e751930a14047'; 
  const _wallet3 = '0x3630b84de0c90dca810d9ee8b679ec78ed5d7ffc'; 
  const _wallet4 = '0x65e9adb3ff8237927c10f6ae3d38bd578b412e59'; 
  const _wallet5 = '0x17c95df682fc239945a559f973a6830c77c7079b'; 
  
  await deployer.deploy(
    DonationsNFTICO,
    _token
  );

  const deployedICO = await DonationsNFTICO.deployed();
  console.log(`*****deployedICO`, deployedICO.address);

  /**********Add Minter********************* */
  // await deployedToken.addMinter(deployedICO.address);
  // await deployedToken.addMinter(_wallet1);
};

const duration = {
  seconds: function (val) { return val; },
  minutes: function (val) { return val * this.seconds(60); },
  hours: function (val) { return val * this.minutes(60); },
  days: function (val) { return val * this.hours(24); },
  weeks: function (val) { return val * this.days(7); },
  months: function (val) { return val * this.days(30); },
  years: function (val) { return val * this.days(365); },
};

const ether = (n) => new web3.utils.BN(web3.utils.toWei(n.toString(), 'ether'));