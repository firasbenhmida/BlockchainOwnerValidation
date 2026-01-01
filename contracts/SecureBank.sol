// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SecureBank
 * @dev This contract demonstrates PROPER access control implementation
 * 
 * ✅ SECURITY FIX: Added onlyOwner modifier to protect sensitive functions
 * ✅ Only the owner can call changeOwner()
 * ✅ Prevents unauthorized access to critical functions
 */
contract SecureBank {
    // State variables
    address public owner;
    mapping(address => uint256) public balances;
    uint256 public totalDeposits;
    
    // Events for logging
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    event OwnerChanged(address indexed oldOwner, address indexed newOwner);
    
    /**
     * @dev Modifier to restrict function access to owner only
     * This is the SECURITY FIX that prevents the vulnerability
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner!");
        _; 
    }
    
    /**
     * @dev Constructor - sets the deployer as initial owner
     */
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Allows users to deposit ETH into their account
     */
    function deposit() public payable {
        require(msg.value > 0, "Must deposit some ETH");
        
        balances[msg.sender] += msg.value;
        totalDeposits += msg.value;
        
        emit Deposit(msg.sender, msg.value);
    }
    
    /**
     * @dev Allows users to withdraw their balance
     * @param amount Amount of ETH to withdraw
     */
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] -= amount;
        totalDeposits -= amount;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Withdrawal(msg.sender, amount);
    }
    
    /**
     * @dev Get balance of a specific user
     * @param user Address of the user
     * @return Balance of the user
     */
    function getBalance(address user) public view returns (uint256) {
        return balances[user];
    }
    
    /**
     * ✅ SECURITY FIX: Added onlyOwner modifier
     * @dev Changes the owner of the contract
     * @param newOwner Address of the new owner
     * 
     * FIX: Only the current owner can call this function
     * Result: Attackers get "Not owner!" error when trying to call this
     */
    function changeOwner(address newOwner) public onlyOwner {
        // ✅ Protected by onlyOwner modifier
        // ✅ Only msg.sender == owner can execute this
        
        require(newOwner != address(0), "New owner cannot be zero address");
        
        address oldOwner = owner;
        owner = newOwner;
        
        emit OwnerChanged(oldOwner, newOwner);
    }
    
    /**
     * @dev Emergency withdraw for owner only
     */
    function emergencyWithdraw() public onlyOwner {
        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "No funds to withdraw");
        
        (bool success, ) = owner.call{value: contractBalance}("");
        require(success, "Transfer failed");
    }
    
    /**
     * @dev Get total contract balance
     */
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Fallback function to receive ETH
     */
    receive() external payable {
        balances[msg.sender] += msg.value;
        totalDeposits += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
}
