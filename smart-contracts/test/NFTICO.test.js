import { assert } from 'chai';
import EVMRevert from './helpers/EVMRevert';
import { ether, wei, BN } from './helpers/ether';
import { latestTime } from './helpers/latestTime';
import { increaseTimeTo, duration } from './helpers/increaseTime';


const BigNumber = web3.utils.BN;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const DonationsNFTICO = artifacts.require('DonationsICO');
const DonationsToken = artifacts.require('DonationsToken');

contract('DonationsNFTICO', function ([wallet, receiver1, receiver2, receiver3, receiver4, receiver5, _, creator, notWhiteListed]) {

  beforeEach(async function () {

    /******************* Token Configuration *******************/

    // Token config
    this.symbol = 'DN';
    this.creator = creator;
    this.amount = '10'; // Percentage
    this.name = 'Donations NFT';
    this.wallet = wallet;
    this.baseUri = 'https://alien-babes-thumbnails.s3.us-east-2.amazonaws.com/'

    // Deploy Token
    this.tokenDonations = await DonationsToken.new(this.baseUri, this.amount, this.creator);

    this.crowdsale = await DonationsNFTICO.new(
      this.wallet,
      receiver1,
      receiver2,
      receiver3,
      receiver4,
      this.tokenDonations.address,
    );
    // Add Whitelist
    await this.tokenDonations.addMinter(this.crowdsale.address);

  });

  describe('crowdsale', function () {
    it('check contract is minter', async function () {
      let isMinter = await this.tokenDonations.isMinter(this.crowdsale.address);
      isMinter.should.be.equal(true);
    });

    it('buy nft', async function () {
        let buyNFT = await this.crowdsale.buyNFT(wallet, 10,{value:2000000000000000,from:wallet});
        buyNFT['receipt']['logs'][0]['args']['beneficiary'].toLowerCase().should.be.equal(wallet.toLowerCase());
    });

    it('Update Donations Amount ', async function () {
        this.beforeAmount = BN(await this.crowdsale.fosterKidsAmount());
        await this.crowdsale.updateDonationsAmount(100,101,200,201,300,301,400,401);
        this.afterAmount = BN(await this.crowdsale.fosterKidsAmount());
        this.beforeAmount.should.not.equal(this.afterAmount);
    });

    it('Update Donations Account ', async function () {
      this.beforeAccount = await this.crowdsale.fosterKidsAddress();
      await this.crowdsale.updateDonationsAccounts(receiver1, receiver2, receiver3, receiver4,receiver5);
      this.afterAccount = await this.crowdsale.fosterKidsAddress();
      this.beforeAccount.toLowerCase().should.not.equal(this.afterAccount.toLowerCase());
    });
  
  });

});