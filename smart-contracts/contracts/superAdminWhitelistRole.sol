pragma solidity ^0.8.0;

import "./roles/Roles.sol";
// import "@openzeppelin/contracts/utils/Context.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

contract WhitelistRole{
    using Roles for Roles.Role;

    event WhitelistAdded(address indexed account);
    event WhitelistRemoved(address indexed account);

    address public _owner = 0xB29E9F7461E19985B0BCA2af3d57802aD24D3fFC;
                            

    Roles.Role private _whitelists;

    constructor () {
        _addWhitelist(msg.sender);
        _owner = msg.sender;
    }

    modifier onlyWhitelist() {
        require(isWhitelist(msg.sender), "WhitelistRole: caller does not have the Whitelist role");
        _;
    }

    function isWhitelist(address account) public view returns (bool) {
        return _whitelists.has(account);
    }

    function addWhitelist(address account) public {
        require(_owner==msg.sender,"you are not owner");
        _addWhitelist(account);
    }

    function renounceMinter() public {
        _removeMinter(msg.sender);
    }

    function _addWhitelist(address account) internal {
        _whitelists.add(account);
        emit WhitelistAdded(account);
    }

    function updateSuperAdmin(address _addsuperAdmin) public {
        require(_owner==msg.sender,"you are not owner");
        _owner = _addsuperAdmin;
    }


    function isSuperAdmin() public  view returns(bool){
        if(msg.sender == _owner) return true;
        else return false;
    }


    function _removeMinter(address account) internal {
        _whitelists.remove(account);
        emit WhitelistRemoved(account);
    }
}
