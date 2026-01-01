// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VulnerableBank
 * @dev This contract demonstrates a critical ACCESS CONTROL vulnerability
 * 
 * ⚠️ SECURITY FLAW: Missing access control on sensitive functions
 * Anyone can call changeOwner() and become the owner!
 * Anyone can then withdraw all funds!
 */
contract VulnerableBank {
    // State variables
    address public owner;
    mapping(address => uint256) public balances;
    uint256 public totalDeposits;
    
    // Events for logging
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    event OwnerChanged(address indexed oldOwner, address indexed newOwner);
    
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
     * ⚠️ CRITICAL VULNERABILITY: NO ACCESS CONTROL!
     * @dev Changes the owner of the contract
     * @param newOwner Address of the new owner
     * 
     * BUG: This function is missing the "onlyOwner" modifier
     * Result: ANYONE can call this and become the owner!
     */
    function changeOwner(address newOwner) public {
        
        
        address oldOwner = owner;
        owner = newOwner;
        
        emit OwnerChanged(oldOwner, newOwner);
    }
    
    /**
     * @dev Emergency withdraw for owner (should be owner-only but vulnerable via changeOwner)
     */
    function emergencyWithdraw() public {
        require(msg.sender == owner, "Only owner can emergency withdraw");
        
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
