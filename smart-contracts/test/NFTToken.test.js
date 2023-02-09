// import Web3 from 'web3';
import { ether, BN } from './helpers/ether';
import EVMRevert from './helpers/EVMRevert';
import { latestTime, sleep } from './helpers/latestTime';
import { increaseTimeTo, duration } from './helpers/increaseTime';
import { assert } from 'chai';

const BigNumber = web3.utils.BN;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const DonationsToken = artifacts.require('DonationsToken');

contract('DonationsToken', function ([_admin, _, receiver1, receiver2, creator, community, genesisOwner1, genesisOwner2, genesisOwner3]) {

  beforeEach(async function () {
    this.symbol = 'CAB';
    this.creator = creator;
    this.royaltyPercent = '10';
    this.name = 'Crypto Alien Babes';
    this.baseUri = 'https://alien-babes-thumbnails.s3.us-east-2.amazonaws.com/'


    /* Deploy Token */
    this.tokenChronicleVerse = await DonationsToken.new(this.baseUri,this.royaltyPercent, this.creator);

    // this.rareNFT = 111;
  });

  describe('Mint a Tokens', function () {
    beforeEach(async function () {
      let tokenIDs = 1;
      await this.tokenChronicleVerse.mintTokens(receiver1, tokenIDs, 100);
    });

    it('should have check owner', async function () {
      let checkOwner = await this.tokenChronicleVerse.balanceOf(receiver1, 1);
      parseInt(BN(checkOwner)) > 0;
    });

    it('should have receiver1', async function () {
      let ownerTokens = await this.tokenChronicleVerse.balanceOf(receiver1, 2);
      parseInt(BN(ownerTokens)) > 0;

    });

    it('should let user mint NFT', async function () {
      let tokenIDs = 1;
      await this.tokenChronicleVerse.mintTokens(receiver1, tokenIDs, 100);
    });

    it('should not let user mint NFT', async function () {
      await this.tokenChronicleVerse.mintTokens(receiver1, 1, 10, { from: receiver1 }).should.be.rejectedWith(EVMRevert);
    });
  });

});