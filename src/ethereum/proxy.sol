pragma solidity >=0.5.8;

import {CErc20, CToken} from "./cDAI.sol";
import {Dai} from "./dai.sol";


contract ProxyContract  {

    CErc20 cDAI = CErc20(0x6D7F0754FFeb405d23C51CE938289d4835bE3b14); // get a handle for the corresponding cDAI contract
    Dai DAI = Dai(0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa); // get a handle for the underlying asset contract
    uint public totalUsersStake;
    uint underlyingBalance;
    uint currentEarnings;
    address owner = msg.sender;
    mapping (address => uint) public DAIbalance;

    constructor()
        public
    {
        DAI.approve(address(cDAI), uint(-1));
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function changeOwner(address _newOwner)
        public
        onlyOwner
    {
        owner = _newOwner;
    }

    /**
     * @notice Sender supplies DAI that is proxied into the compound market
     * @dev owner does not have access to any user funds
     * @param amount The amount of DAI to supply
     */
    function addFunds(uint amount)
        public
    {
        require(amount > 0, "transaction must include DAI");
        DAIbalance[msg.sender] = DAIbalance[msg.sender] + amount;
        totalUsersStake = totalUsersStake + amount;
        DAI.transferFrom(msg.sender, address(this), amount);
        cDAI.mint(amount);
    }

     /**
     * @notice Sender can withdraw staked DAI at any time
     * @dev Owner does not have access to any user funds
     * @param amount The amount of DAI to supply
     */
    function removeFunds(uint amount)
        public
    {
        require(DAIbalance[msg.sender] >= amount, "insufficient-balance");
        DAIbalance[msg.sender] = DAIbalance[msg.sender] - amount;
        totalUsersStake = totalUsersStake - amount;
        cDAI.redeemUnderlying(amount);
        DAI.transfer(msg.sender, amount);
    }

    /**
     * @notice allows owner to withdraw accrued interest on staked funds
     * @dev underlyingBalance is cDAI to DAI calculation
     * @dev currentEarnings is total DAI minus all staked DAI
     */
    function ownerDraw()
        public
        onlyOwner
    {
        underlyingBalance = cDAI.balanceOfUnderlying(address(this));
        currentEarnings = underlyingBalance - totalUsersStake;
        cDAI.redeemUnderlying(currentEarnings);
        DAI.transfer(owner, currentEarnings);
    }
}
