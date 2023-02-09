import { assert } from "chai";
import EVMRevert from "./helpers/EVMRevert";
import { ether, wei, BN } from "./helpers/ether";
import { latestTime } from "./helpers/latestTime";
import { increaseTimeTo, duration } from "./helpers/increaseTime";

const BigNumber = web3.utils.BN;

require("chai")
  .use(require("chai-as-promised"))
  .use(require("chai-bignumber")(BigNumber))
  .should();

const DonationsNFTICO = artifacts.require("DonationsSuperAdminICO");
const DonationsToken = artifacts.require("DonationsToken");

contract("DonationsNFTICO", function([
  wallet,
  receiver1,
  receiver2,
  receiver3,
  receiver4,
  receiver5,
  _,
  creator,
  notWhiteListed,
]) {
  beforeEach(async function() {
    /******************* Token Configuration *******************/

    // Token config
    this.symbol = "DN";
    this.creator = creator;
    this.amount = "10"; // Percentage
    this.name = "Donations NFT";
    this.wallet = wallet;
    this.baseUri = "https://alien-babes-thumbnails.s3.us-east-2.amazonaws.com/";

    // Deploy Token
    this.tokenDonations = await DonationsToken.new(
      this.baseUri,
      this.amount,
      this.creator
    );

    this.crowdsale = await DonationsNFTICO.new(this.tokenDonations.address);
    // Add Whitelist
    await this.tokenDonations.addMinter(this.crowdsale.address);
    await this.crowdsale.addForMultiSign([receiver1,receiver2]);
  });

  describe("crowdsale", function() {
    it("check contract is minter", async function() {
      let isMinter = await this.tokenDonations.isMinter(this.crowdsale.address);
      isMinter.should.be.equal(true);
    });

    it("submit donations with arrays values", async function() {
      this.donationsAmount = [10000000000,20000000000];
      this.donationsFor = ["school","hospital"];
      this.tokenId = [1,2];
      this.walletAddress = [wallet, receiver1];
      this.isPercentage = false;
      await this.crowdsale.defineDonations(this.donationsAmount,this.donationsFor,this.walletAddress,this.tokenId,this.isPercentage);
      let donationsData = await this.crowdsale.donationsData("school");
      let donationsData2 = await this.crowdsale.donationsData("hospital");
      donationsData['accountAddress'].toLowerCase().should.equal(wallet.toLowerCase())
      donationsData2['accountAddress'].toLowerCase().should.equal(receiver1.toLowerCase())
    });
    it('donate & approve', async function () {
      this.donationsAmount = [10000000000,20000000000];
      this.donationsFor = ["school","hospital"];
      this.tokenId = [1,2];
      this.walletAddress = [wallet, receiver1];
      this.isPercentage = false;
      let value = 10000000000;
      let before = await web3.eth.getBalance(this.crowdsale.address);
      await this.crowdsale.defineDonations(this.donationsAmount,this.donationsFor,this.walletAddress,this.tokenId,this.isPercentage);
      await this.crowdsale.donateSimple(wallet,"school",{value,from:wallet});
      let after = await web3.eth.getBalance(this.crowdsale.address);
      parseInt(before+value).should.equal(parseInt(after));
    });

    it.only('donate & approve', async function () {
      this.donationsAmount = [10000000000,20000000000];
      this.donationsFor = ["school","hospital"];
      this.tokenId = [1,2];
      this.walletAddress = [wallet, receiver1];
      this.isPercentage = false;
      let value = 10000000000;
      let before = await web3.eth.getBalance(this.crowdsale.address);
      await this.crowdsale.defineDonations(this.donationsAmount,this.donationsFor,this.walletAddress,this.tokenId,this.isPercentage);
      await this.crowdsale.donateSimple(wallet,"school",{value,from:wallet});
      console.log("************ multiSign",await this.crowdsale.multiSign(wallet))
      console.log("************ multiSign",await this.crowdsale.multiSignatureAdmin(0))
      let after = await web3.eth.getBalance(this.crowdsale.address);
      parseInt(before+value).should.equal(parseInt(after));
    });

    // it('donate & get nft', async function () {
        // this.donationsAmount = [10000000000,20000000000];
        // this.donationsFor = ["school","hospital"];
        // this.tokenId = [1,2];
        // this.walletAddress = [wallet, receiver1];
        // this.isPercentage = false;
        // await this.crowdsale.defineDonations(this.donationsAmount,this.donationsFor,this.walletAddress,this.tokenId,this.isPercentage);
        // let buyNFT = await this.crowdsale.donateAndBuyNFT(wallet,10,"school",{value:10000000000,from:wallet});
        // buyNFT['receipt']['logs'][0]['args']['beneficiary'].toLowerCase().should.be.equal(wallet.toLowerCase());
    // });
    
    // it('donate & get nft by peresentage', async function () {
    //   this.donationsAmount = [5,3];
    //   this.donationsFor = ["school","hospital"];
    //   this.tokenId = [1,2];
    //   this.walletAddress = [wallet, receiver1];
    //   this.isPercentage = true;
    //   await this.crowdsale.defineDonations(this.donationsAmount,this.donationsFor,this.walletAddress,this.tokenId,this.isPercentage);
    //   let buyNFT = await this.crowdsale.donateAndBuyNFTByPerecentage(wallet,10,{value:10000000000,from:wallet});
    //   buyNFT['receipt']['logs'][0]['args']['beneficiary'].toLowerCase().should.be.equal(wallet.toLowerCase());
    // });

    // it('donate & get nft by peresentage reject', async function () {
    //   this.donationsAmount = [5,3];
    //   this.donationsFor = ["school","hospital"];
    //   this.tokenId = [1,2];
    //   this.walletAddress = [wallet, receiver1];
    //   this.isPercentage = true;
    //   console.log("********************* account 1",await web3.utils.fromWei(await web3.eth.getBalance(wallet),'ether'))
    //   console.log("********************* account 2",await web3.utils.fromWei(await web3.eth.getBalance(receiver1),'ether'))
    //   console.log("********************* account 3",await web3.utils.fromWei(await web3.eth.getBalance(receiver2),'ether'))
    //   await this.crowdsale.defineDonations(this.donationsAmount,this.donationsFor,this.walletAddress,this.tokenId,this.isPercentage);
    //   let buyNFT = await this.crowdsale.donateAndBuyNFTByPerecentage(receiver2,10,{value:web3.utils.toWei('30','ether'),from:receiver2});
    //   console.log("********************* account 1",await web3.utils.fromWei(await web3.eth.getBalance(wallet),'ether'))
    //   console.log("********************* account 2",await web3.utils.fromWei(await web3.eth.getBalance(receiver1),'ether'))
    //   console.log("********************* account 3",await web3.utils.fromWei(await web3.eth.getBalance(receiver2),'ether'))

    //   buyNFT['receipt']['logs'][0]['args']['beneficiary'].toLowerCase().should.be.equal(receiver2.toLowerCase());
    // });
    
  });
});
