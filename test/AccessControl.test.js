const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * ACCESS CONTROL VULNERABILITY AUDIT - Test Suite
 * 
 * This test suite demonstrates:
 * 1. VulnerableBank: Missing access control allows attackers to steal funds
 * 2. SecureBank: Proper access control prevents unauthorized access
 */
describe("Access Control Vulnerability Audit", function () {
  
  let vulnerableBank, secureBank;
  let owner, user1, attacker;
  
  // Setup: Deploy both contracts before each test
  beforeEach(async function () {
    // Get test accounts
    [owner, user1, attacker] = await ethers.getSigners();
    
    console.log("\n🔐 Test Accounts:");
    console.log("   Owner:", owner.address);
    console.log("   User1:", user1.address);
    console.log("   Attacker:", attacker.address);
    
    // Deploy VulnerableBank
    const VulnerableBank = await ethers.getContractFactory("VulnerableBank");
    vulnerableBank = await VulnerableBank.deploy();
    await vulnerableBank.waitForDeployment();
    
    // Deploy SecureBank
    const SecureBank = await ethers.getContractFactory("SecureBank");
    secureBank = await SecureBank.deploy();
    await secureBank.waitForDeployment();
    
    console.log("\n📦 Contracts Deployed:");
    console.log("   VulnerableBank:", await vulnerableBank.getAddress());
    console.log("   SecureBank:", await secureBank.getAddress());
  });
  
  // ========================================
  // PART 1: VULNERABLE BANK TESTS
  // ========================================
  
  describe("⚠️  VulnerableBank - Access Control Vulnerability", function () {
    
    it("Should deploy with correct owner", async function () {
      expect(await vulnerableBank.owner()).to.equal(owner.address);
      console.log("   ✓ Owner correctly set to deployer");
    });
    
    it("Should allow users to deposit ETH", async function () {
      const depositAmount = ethers.parseEther("1.0");
      
      await vulnerableBank.connect(user1).deposit({ value: depositAmount });
      
      expect(await vulnerableBank.getBalance(user1.address)).to.equal(depositAmount);
      expect(await vulnerableBank.getContractBalance()).to.equal(depositAmount);
      
      console.log("   ✓ User1 deposited 1 ETH successfully");
    });
    
    it("🚨 CRITICAL: Attacker CAN change owner (VULNERABILITY!)", async function () {
      console.log("\n   🎯 ATTACK SCENARIO 1: Unauthorized Owner Change");
      console.log("   ➤ Original owner:", await vulnerableBank.owner());
      
      // ATTACK: Attacker tries to become owner
      const attackTx = await vulnerableBank.connect(attacker).changeOwner(attacker.address);
      await attackTx.wait();
      
      // VERIFY: Attacker is now the owner!
      const newOwner = await vulnerableBank.owner();
      expect(newOwner).to.equal(attacker.address);
      
      console.log("   ➤ New owner:", newOwner);
      console.log("   ❌ VULNERABILITY CONFIRMED: Attacker successfully became owner!");
    });
    
    it("🚨 CRITICAL: Attacker can steal all funds after becoming owner", async function () {
      console.log("\n   🎯 ATTACK SCENARIO 2: Complete Fund Theft");
      
      // Step 1: User deposits funds
      const depositAmount = ethers.parseEther("10.0");
      await vulnerableBank.connect(user1).deposit({ value: depositAmount });
      console.log("   ➤ User1 deposited:", ethers.formatEther(depositAmount), "ETH");
      
      const balanceBefore = await ethers.provider.getBalance(attacker.address);
      console.log("   ➤ Attacker balance before:", ethers.formatEther(balanceBefore), "ETH");
      
      // Step 2: Attacker becomes owner (exploiting missing access control)
      await vulnerableBank.connect(attacker).changeOwner(attacker.address);
      console.log("   ➤ Attacker became owner ✓");
      
      // Step 3: Attacker withdraws all funds using emergencyWithdraw
      await vulnerableBank.connect(attacker).emergencyWithdraw();
      console.log("   ➤ Attacker withdrew all funds ✓");
      
      // Verify: Contract is empty, attacker has the funds
      expect(await vulnerableBank.getContractBalance()).to.equal(0);
      
      const balanceAfter = await ethers.provider.getBalance(attacker.address);
      console.log("   ➤ Attacker balance after:", ethers.formatEther(balanceAfter), "ETH");
      console.log("   ➤ Profit:", ethers.formatEther(balanceAfter - balanceBefore), "ETH");
      
      console.log("   ❌ VULNERABILITY CONFIRMED: Complete fund theft successful!");
    });
    
    it("Should show the attack step-by-step", async function () {
      console.log("\n   📋 STEP-BY-STEP ATTACK DEMONSTRATION:");
      
      // Setup
      await vulnerableBank.connect(owner).deposit({ value: ethers.parseEther("5.0") });
      console.log("   1️⃣  Owner deposited 5 ETH");
      
      await vulnerableBank.connect(user1).deposit({ value: ethers.parseEther("3.0") });
      console.log("   2️⃣  User1 deposited 3 ETH");
      
      console.log("   3️⃣  Contract now has:", 
        ethers.formatEther(await vulnerableBank.getContractBalance()), "ETH");
      
      // Attack
      console.log("   4️⃣  Attacker calls changeOwner()...");
      await vulnerableBank.connect(attacker).changeOwner(attacker.address);
      console.log("   5️⃣  ✓ Success! Attacker is now owner");
      
      console.log("   6️⃣  Attacker calls emergencyWithdraw()...");
      await vulnerableBank.connect(attacker).emergencyWithdraw();
      console.log("   7️⃣  ✓ Success! All funds stolen");
      
      expect(await vulnerableBank.getContractBalance()).to.equal(0);
      console.log("   8️⃣  Contract balance now: 0 ETH");
      console.log("   ❌ ATTACK COMPLETE: All funds stolen!");
    });
  });
  
  // ========================================
  // PART 2: SECURE BANK TESTS
  // ========================================
  
  describe("✅ SecureBank - Proper Access Control", function () {
    
    it("Should deploy with correct owner", async function () {
      expect(await secureBank.owner()).to.equal(owner.address);
      console.log("   ✓ Owner correctly set to deployer");
    });
    
    it("Should allow users to deposit ETH", async function () {
      const depositAmount = ethers.parseEther("1.0");
      
      await secureBank.connect(user1).deposit({ value: depositAmount });
      
      expect(await secureBank.getBalance(user1.address)).to.equal(depositAmount);
      expect(await secureBank.getContractBalance()).to.equal(depositAmount);
      
      console.log("   ✓ User1 deposited 1 ETH successfully");
    });
    
    it("✅ SECURE: Attacker CANNOT change owner (Protected!)", async function () {
      console.log("\n   🛡️  SECURITY TEST 1: Unauthorized Owner Change Blocked");
      console.log("   ➤ Original owner:", await secureBank.owner());
      
      // ATTACK ATTEMPT: Attacker tries to become owner
      await expect(
        secureBank.connect(attacker).changeOwner(attacker.address)
      ).to.be.revertedWith("Not owner!");
      
      // VERIFY: Owner unchanged
      expect(await secureBank.owner()).to.equal(owner.address);
      
      console.log("   ➤ Attacker tried to change owner...");
      console.log("   ➤ Result: ❌ Transaction REVERTED with 'Not owner!'");
      console.log("   ➤ Owner still:", await secureBank.owner());
      console.log("   ✅ SECURITY CONFIRMED: Access control working correctly!");
    });
    
    it("✅ SECURE: Only owner can change owner", async function () {
      console.log("\n   🛡️  SECURITY TEST 2: Owner Can Change Owner");
      
      // Owner changes ownership (should work)
      await secureBank.connect(owner).changeOwner(user1.address);
      
      expect(await secureBank.owner()).to.equal(user1.address);
      console.log("   ➤ Owner successfully transferred to User1");
      console.log("   ✅ Access control allows legitimate owner actions");
    });
    
    it("✅ SECURE: Attacker cannot steal funds", async function () {
      console.log("\n   🛡️  SECURITY TEST 3: Fund Theft Prevention");
      
      // Setup: Deposit funds
      await secureBank.connect(user1).deposit({ value: ethers.parseEther("10.0") });
      console.log("   ➤ User1 deposited 10 ETH");
      
      const balanceBefore = await secureBank.getContractBalance();
      console.log("   ➤ Contract balance:", ethers.formatEther(balanceBefore), "ETH");
      
      // ATTACK ATTEMPT 1: Try to become owner
      await expect(
        secureBank.connect(attacker).changeOwner(attacker.address)
      ).to.be.revertedWith("Not owner!");
      console.log("   ➤ Step 1: changeOwner() blocked ✓");
      
      // ATTACK ATTEMPT 2: Try to withdraw (even though not owner)
      await expect(
        secureBank.connect(attacker).emergencyWithdraw()
      ).to.be.revertedWith("Not owner!");
      console.log("   ➤ Step 2: emergencyWithdraw() blocked ✓");
      
      // VERIFY: Funds are safe
      expect(await secureBank.getContractBalance()).to.equal(balanceBefore);
      console.log("   ➤ Contract balance unchanged:", ethers.formatEther(balanceBefore), "ETH");
      console.log("   ✅ SECURITY CONFIRMED: Funds are safe!");
    });
    
    it("Should demonstrate complete attack prevention", async function () {
      console.log("\n   📋 COMPLETE ATTACK PREVENTION DEMONSTRATION:");
      
      // Setup
      await secureBank.connect(owner).deposit({ value: ethers.parseEther("5.0") });
      console.log("   1️⃣  Owner deposited 5 ETH");
      
      await secureBank.connect(user1).deposit({ value: ethers.parseEther("3.0") });
      console.log("   2️⃣  User1 deposited 3 ETH");
      
      console.log("   3️⃣  Contract now has:", 
        ethers.formatEther(await secureBank.getContractBalance()), "ETH");
      
      // Attack attempt
      console.log("   4️⃣  Attacker tries to call changeOwner()...");
      await expect(
        secureBank.connect(attacker).changeOwner(attacker.address)
      ).to.be.revertedWith("Not owner!");
      console.log("   5️⃣  ❌ BLOCKED! Error: 'Not owner!'");
      
      console.log("   6️⃣  Owner is still:", await secureBank.owner());
      console.log("   7️⃣  Contract balance still:", 
        ethers.formatEther(await secureBank.getContractBalance()), "ETH");
      console.log("   ✅ ATTACK PREVENTED: Funds remain safe!");
    });
  });
  
  // ========================================
  // PART 3: SIDE-BY-SIDE COMPARISON
  // ========================================
  
  describe("📊 Side-by-Side Comparison", function () {
    
    it("Should show the difference in security", async function () {
      console.log("\n   ═══════════════════════════════════════════════════");
      console.log("   📊 VULNERABILITY COMPARISON");
      console.log("   ═══════════════════════════════════════════════════");
      
      // Test VulnerableBank
      console.log("\n   ❌ VulnerableBank:");
      const vuln1 = await vulnerableBank.connect(attacker).changeOwner(attacker.address);
      await vuln1.wait();
      console.log("      changeOwner() by attacker: ✓ SUCCESS (VULNERABLE!)");
      
      // Test SecureBank
      console.log("\n   ✅ SecureBank:");
      try {
        await secureBank.connect(attacker).changeOwner(attacker.address);
        console.log("      changeOwner() by attacker: ✓ SUCCESS");
      } catch (error) {
        console.log("      changeOwner() by attacker: ❌ REVERTED (SECURE!)");
        console.log("      Error message:", error.message.includes("Not owner") ? "'Not owner!'" : error.message);
      }
      
      console.log("\n   ═══════════════════════════════════════════════════");
      console.log("   📝 CONCLUSION:");
      console.log("   • VulnerableBank: Missing access control = HIGH RISK");
      console.log("   • SecureBank: Proper access control = SECURE");
      console.log("   ═══════════════════════════════════════════════════\n");
    });
  });
});
