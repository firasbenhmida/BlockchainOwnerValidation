const { ethers } = require("hardhat");

/**
 * Deploy script for Access Control Audit Project
 * Deploys both VulnerableBank and SecureBank contracts
 */
async function main() {
  console.log("\n═══════════════════════════════════════════════════");
  console.log("🚀 ACCESS CONTROL AUDIT - DEPLOYMENT SCRIPT");
  console.log("═══════════════════════════════════════════════════\n");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  
  console.log("📋 Deployment Information:");
  console.log("   Deployer address:", deployer.address);
  console.log("   Deployer balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");
  console.log();
  
  // ========================================
  // Deploy VulnerableBank
  // ========================================
  console.log("📦 Deploying VulnerableBank...");
  const VulnerableBank = await ethers.getContractFactory("VulnerableBank");
  const vulnerableBank = await VulnerableBank.deploy();
  await vulnerableBank.waitForDeployment();
  
  const vulnerableBankAddress = await vulnerableBank.getAddress();
  console.log("   ✅ VulnerableBank deployed to:", vulnerableBankAddress);
  console.log("   ⚠️  WARNING: This contract has access control vulnerabilities!");
  console.log();
  
  // ========================================
  // Deploy SecureBank
  // ========================================
  console.log("📦 Deploying SecureBank...");
  const SecureBank = await ethers.getContractFactory("SecureBank");
  const secureBank = await SecureBank.deploy();
  await secureBank.waitForDeployment();
  
  const secureBankAddress = await secureBank.getAddress();
  console.log("   ✅ SecureBank deployed to:", secureBankAddress);
  console.log("   🛡️  This contract is properly secured with access control!");
  console.log();
  
  // ========================================
  // Verify Ownership
  // ========================================
  console.log("🔐 Verifying Contract Ownership:");
  const vulnOwner = await vulnerableBank.owner();
  const secureOwner = await secureBank.owner();
  
  console.log("   VulnerableBank owner:", vulnOwner);
  console.log("   SecureBank owner:", secureOwner);
  console.log();
  
  // ========================================
  // Summary
  // ========================================
  console.log("═══════════════════════════════════════════════════");
  console.log("✅ DEPLOYMENT COMPLETE");
  console.log("═══════════════════════════════════════════════════");
  console.log("\n📝 Contract Addresses (SAVE THESE!):");
  console.log("   VulnerableBank:", vulnerableBankAddress);
  console.log("   SecureBank:", secureBankAddress);
  console.log("\n� WEB INTERFACE INSTRUCTIONS:");
  console.log("   1. Open public/index.html in your browser");
  console.log("   2. Click 'Connect MetaMask' button");
  console.log("   3. Paste these addresses when prompted:");
  console.log("      • VulnerableBank: " + vulnerableBankAddress);
  console.log("      • SecureBank: " + secureBankAddress);
  console.log("   4. Click buttons to interact with the contracts!");
  console.log("\n✅ Or run tests:");
  console.log("   npx hardhat test");
  console.log("\n═══════════════════════════════════════════════════\n");
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment Error:", error);
    process.exit(1);
  });
