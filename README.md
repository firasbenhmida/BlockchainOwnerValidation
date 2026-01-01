# Blockchain Owner Validation - Access Control Vulnerability Audit

A comprehensive security audit demonstrating a critical access control vulnerability in Ethereum smart contracts and its secure implementation.

## 🎯 Project Overview

This project demonstrates a **critical access control vulnerability** where unauthorized users can take complete ownership of a smart contract and steal all funds. It includes both vulnerable and secure implementations, along with comprehensive testing and an interactive web demonstration.

### 🎥 Demo Video
[![Watch Demo](https://img.youtube.com/vi/JUdRTMknOAo/0.jpg)](https://youtu.be/JUdRTMknOAo)

## 🚨 Vulnerability Demonstrated

**Issue**: Missing access control on the `changeOwner()` function  
**Impact**: Any user can become the contract owner and drain all funds  
**Severity**: CRITICAL  
**Cost to Exploit**: ~$1 (only gas fees)

## 📁 Project Structure

```
BlockchainOwnerValidation/
├── contracts/
│   ├── VulnerableBank.sol    # Vulnerable contract (no access control)
│   └── SecureBank.sol         # Secure contract (with onlyOwner modifier)
├── test/
│   └── AccessControl.test.js  # 12 comprehensive tests
├── scripts/
│   └── deploy.js              # Deployment script
├── public/
│   ├── index.html             # Web interface
│   ├── app.js                 # MetaMask integration
│   └── style.css              # Professional styling
├── hardhat.config.js          # Hardhat configuration
└── package.json               # Dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x+
- npm 9.x+
- MetaMask browser extension

### Installation

```bash
# Clone the repository
git clone https://github.com/00hbc000/BlockchainOwnerValidation.git
cd BlockchainOwnerValidation

# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test
```

## 🧪 Testing

Run the complete test suite (12 tests):

```bash
npx hardhat test
```

**Test Coverage:**
- ✅ VulnerableBank: 5 tests proving vulnerability exploitation
- ✅ SecureBank: 5 tests proving attack prevention
- ✅ Comparative analysis: 1 test
- ✅ Helper utilities: 1 test

**Expected Result:** All 12 tests pass

## 🌐 Web Interface Demo

### Start the Demo

1. **Start Hardhat Node**
```bash
npx hardhat node
```

2. **Deploy Contracts** (in a new terminal)
```bash
npx hardhat run scripts/deploy.js --network localhost
```

3. **Start Web Server** (in a new terminal)
```bash
cd public
python -m http.server 8080
```

4. **Configure MetaMask**
   - Network: Localhost 8545
   - Chain ID: 1337
   - RPC URL: http://127.0.0.1:8545
   - Import test accounts using private keys from Hardhat

5. **Open Browser**
   - Navigate to `http://localhost:8080`
   - Connect MetaMask

### Demo Scenario

**🔴 VulnerableBank Attack:**
1. Owner deposits 1 ETH
2. Attacker calls `changeOwner()` → **SUCCESS** ✅
3. Attacker calls `emergencyWithdraw()` → **All funds stolen** 💸

**🟢 SecureBank Protection:**
1. Owner deposits 1 ETH
2. Attacker calls `changeOwner()` → **REJECTED** ❌ ("Not owner!")
3. Funds remain safe 🔒

## 🔒 Security Solution

### The Fix: `onlyOwner` Modifier

```solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Not owner!");
    _;
}

function changeOwner(address newOwner) public onlyOwner {
    require(newOwner != address(0), "Invalid address");
    owner = newOwner;
    emit OwnerChanged(newOwner);
}
```

**Benefits:**
- ✅ Simple implementation
- ✅ Reusable across functions
- ✅ Industry standard (OpenZeppelin)
- ✅ Minimal gas overhead (~200 gas)

## 📊 Contracts Comparison

| Feature | VulnerableBank | SecureBank |
|---------|---------------|------------|
| `onlyOwner` modifier | ❌ No | ✅ Yes |
| Access control | ❌ None | ✅ Protected |
| Attack possible | ✅ Yes | ❌ No |
| Fund theft risk | 🔴 CRITICAL | 🟢 SECURE |

## 🛠️ Technology Stack

- **Blockchain**: Ethereum
- **Smart Contracts**: Solidity 0.8.20
- **Framework**: Hardhat 2.22.0
- **Testing**: Ethers.js v6 + Chai
- **Frontend**: HTML5, CSS3, JavaScript
- **Wallet**: MetaMask integration

## 📝 Contract Addresses (Local Network)

| Contract | Address |
|----------|---------|
| VulnerableBank | `0x5FbDB2315678afecb367f032d93F642f64180aa3` |
| SecureBank | `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` |

## 🎓 Learning Outcomes

This project demonstrates:
1. **Critical Access Control Vulnerability** - Real-world security flaw
2. **Exploitation Techniques** - How attackers compromise contracts
3. **Secure Implementation** - Industry-standard protection patterns
4. **Comprehensive Testing** - Proving both vulnerability and fix
5. **Interactive Demo** - Visual proof of concept

## 👥 Authors

- **Mohamed Firas Ben Hmida**
- **Houssem Eddine Ben Chaabane**

## 🏫 Institution

**TEK-UP University**

## 📜 License

MIT License - See LICENSE file for details

## ⚠️ Disclaimer

This project is for **educational purposes only**. The vulnerable contract demonstrates real security flaws and should **never** be deployed to mainnet with real funds.

## 🔗 Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethereum Smart Contract Best Practices](https://consensys.github.io/smart-contract-best-practices/)

---

**⭐ Star this repository if you found it helpful!**
