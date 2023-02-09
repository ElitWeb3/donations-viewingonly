// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;

pragma solidity ^0.8.0;


import "./utils/SafeMath.sol";
import "./XRC1155/IXRC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract DonationsICO is Ownable,ReentrancyGuard {
    using SafeMath for uint256;
    using Strings for uint256;

    bool isPerecentageMethod;
    string[] forDonationsName;

    IXRC1155 _ERC1155Token;

    string name;

    address ownerAddress = 0x1E50558eb01AB012B6c34DdD1Bf886FCfE114c1f;

    /********************* SET Donations Amount ******************/

    struct accountsWithDetails{
        address payable accountAddress;
        string forDonation;
        uint256 tokenId;
        uint256 donationStartRange;
        uint256 donationEndRange;
    }

    mapping(string=>accountsWithDetails) public donationsData;

    /********************* SET CONSTRACTOR ******************/
    constructor(
        IXRC1155 _token,
        string memory _name
    )
        public
    {
        _ERC1155Token = _token;
        name = _name;
    }


    /**
     * Event for token purchase logging
     * @param purchaser who paid for the tokens
     * @param beneficiary who got the tokens
     */
    event TokensPurchased(
        address indexed purchaser,
        address indexed beneficiary,
        uint256 mintAmount,
        string indexed donationType,
        string isPercentage
    );


    function donateAndBuyNFT(address beneficiary,uint256 _mintAmount,string memory _donationType) public payable nonReentrant {
        uint256 weiAmount = msg.value;
        require(isPerecentageMethod == false,"Donate: you can't mused this method");
        require(weiAmount >= donationsData[_donationType].donationStartRange,"amount must be equal to donation amount");
        require(weiAmount <= donationsData[_donationType].donationEndRange,"amount must be equal to donation amount");

        uint256 persentangeTransferToowner = weiAmount.div(100).mul(10);
        uint256 otherAmount = weiAmount.div(100).mul(90);
        payable(ownerAddress).send(persentangeTransferToowner);
        donationsData[_donationType].accountAddress.send(otherAmount);
        // _ERC1155Token.mintTokens(beneficiary,donationsData[_donationType].tokenId,_mintAmount);
        _ERC1155Token.mint(donationsData[_donationType].tokenId,beneficiary,_mintAmount);
        emit TokensPurchased(_msgSender(),donationsData[_donationType].accountAddress,_mintAmount,_donationType,"false");
    }

    function donateAndBuyNFTByPerecentage(address beneficiary,uint256 _mintAmount) public payable nonReentrant {
         uint256 weiAmount = msg.value;
        require(isPerecentageMethod == true,"Donate: you can't used this method");
        // require(weiAmount >= getDonationPercentage(),"amount must be equal to donation amount");
        for (uint256 index = 0; index < forDonationsName.length; index++) {
            string memory donationType = forDonationsName[index];
            uint256 myPrecious = (weiAmount).div(forDonationsName.length); 
            donationsData[donationType].accountAddress.send(myPrecious);
            // _ERC1155Token.mintTokens(beneficiary,donationsData[donationType].tokenId,_mintAmount);
            _ERC1155Token.mint(donationsData[donationType].tokenId,beneficiary,_mintAmount);
            emit TokensPurchased(_msgSender(),donationsData[donationType].accountAddress,_mintAmount,donationType,"true");

        }
    }


    function defineDonations(uint256[] memory _donationsStartRange,uint256[] memory _donationsEndRange,string[] memory _donationsFor,address[] memory _address,uint256[] memory _donationsId, bool isPercentage) public onlyOwner{
        require(
            _donationsStartRange.length <= 10 &&  _donationsEndRange.length <= 10 && _donationsFor.length <=10 && _address.length <=10 && _donationsId.length <=10
            , "Donations: you can add maximum 10 records");
        for (uint256 index = 0; index < _donationsStartRange.length; index++) {
            require(keccak256(abi.encodePacked(donationsData[_donationsFor[index]].forDonation)) != keccak256(abi.encodePacked(_donationsFor[index])),
                 "donation already added");

            donationsData[_donationsFor[index]]=accountsWithDetails(payable(_address[index]), _donationsFor[index], _donationsId[index],
            _donationsStartRange[index],_donationsEndRange[index]);
        }
        forDonationsName = _donationsFor;
        if(isPercentage==true){
            setPerecentage(isPercentage);
        }
    }

    function updateDonation(uint256 _donationsStartRange,uint256 _donationsEndRange,string memory _donationsFor,address _address,uint256 _donationsId, bool isPercentage) public onlyOwner{
        
        require(keccak256(abi.encodePacked(donationsData[_donationsFor].forDonation)) == keccak256(abi.encodePacked(_donationsFor)), "donation type not found" );

        donationsData[_donationsFor].forDonation = _donationsFor;
        donationsData[_donationsFor].donationStartRange = _donationsStartRange;
        donationsData[_donationsFor].donationEndRange = _donationsEndRange;
        donationsData[_donationsFor].accountAddress = payable(_address);
        donationsData[_donationsFor].tokenId = _donationsId;

        if(isPercentage==true) setPerecentage(isPercentage);

    }


    function setPerecentage(bool isPercentage) internal onlyOwner {
        isPerecentageMethod = isPercentage;
    }

    function getDonationTypes() public view
        returns (string[] memory)
    {
        string[] memory donatior = new string[](forDonationsName.length);
        for (uint256 i; i < forDonationsName.length; i++) {
            donatior[i] = forDonationsName[i];
        }
        return donatior;
    }

    // function getDonationPercentage() public view
    //     returns (uint256)
    // {
    //     uint256 totalPercentage;
    //     string[] memory donatior = new string[](forDonationsName.length);
    //     for (uint256 i; i < forDonationsName.length; i++) {
    //         uint256 getTotal = donationsData[forDonationsName[i]].donationAmount;
    //         totalPercentage = totalPercentage + getTotal;
    //     }
    //     return totalPercentage;
    // }

    function updateTokenAddress(IXRC1155 _token) public onlyOwner {
        _ERC1155Token = _token;
    }
}