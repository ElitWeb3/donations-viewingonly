// File: contracts/roles/Roles.sol

pragma solidity ^0.8.0;

/**
 * @title Roles
 * @dev Library for managing addresses assigned to a Role.
 */
library Roles {
    struct Role {
        mapping (address => bool) bearer;
    }

    /**
     * @dev Give an account access to this role.
     */
    function add(Role storage role, address account) internal {
        require(!has(role, account), "Roles: account already has role");
        role.bearer[account] = true;
    }

    /**
     * @dev Remove an account's access to this role.
     */
    function remove(Role storage role, address account) internal {
        require(has(role, account), "Roles: account does not have role");
        role.bearer[account] = false;
    }

    /**
     * @dev Check if an account has this role.
     * @return bool
     */
    function has(Role storage role, address account) internal view returns (bool) {
        require(account != address(0), "Roles: account is the zero address");
        return role.bearer[account];
    }
}

// File: contracts/superAdminWhitelistRole.sol

pragma solidity ^0.8.0;
// import "@openzeppelin/contracts/utils/Context.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

contract WhitelistRole{
    using Roles for Roles.Role;

    event WhitelistAdded(address indexed account);
    event WhitelistRemoved(address indexed account);

    address public _owner = 0xCf85dCC5D11fE7A6A702c9Da04eAE8045173B06E;
                            

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

    function removeWhitelist(address account) public {
        _removeMinter(account);
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