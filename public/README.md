# 🌐 Web Interface Setup Guide

## Quick Start - Use Web Interface with MetaMask

### Step 1: Install MetaMask (if you haven't already)
- Download MetaMask Chrome extension: https://metamask.io/
- Create or import a wallet

### Step 2: Add Localhost Network to MetaMask
1. Open MetaMask
2. Click **Network dropdown** (top left)
3. Click **Add Network**
4. Fill in:
   - **Network Name**: Localhost 8545
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 31337
   - **Currency Symbol**: ETH
5. Click **Save**

### Step 3: Start Hardhat Node
Open PowerShell and run:
```bash
cd C:\BlockChain\AccessControlProject
npx hardhat node
```
Keep this terminal open! Don't close it.

### Step 4: Deploy Contracts
Open another PowerShell terminal:
```bash
cd C:\BlockChain\AccessControlProject
npx hardhat run scripts/deploy.js
```

**Copy these addresses:**
- VulnerableBank: 0x5FbDB2315678afecb367f032d93F642f64180aa3
- SecureBank: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

### Step 5: Open Web Interface
1. Go to: `C:\BlockChain\AccessControlProject\public`
2. Right-click on `index.html`
3. Select **Open with** → **Your Browser** (Chrome/Firefox)

### Step 6: Connect & Test
1. Click **"Connect MetaMask"** button
2. Approve the connection in MetaMask popup
3. When asked for contract addresses, paste:
   - VulnerableBank: 0x5FbDB2315678afecb367f032d93F642f64180aa3
   - SecureBank: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

### Step 7: Demonstrate the Vulnerability!
1. **Deposit 1 ETH** in VulnerableBank
2. Click **"Change Owner (Attack!)"** - It will work! ✅
3. Click **"Emergency Withdraw"** - Funds stolen! 💰
4. Try same in SecureBank - It will fail! ❌

---

## 🎬 Demo Flow for Your Report

### Perfect Demonstration:
1. Connect MetaMask ✓
2. Show both contracts loaded ✓
3. Deposit 10 ETH in VulnerableBank ✓
4. Try to become owner - Success (Vulnerability!) ✓
5. Withdraw all funds (Theft!) ✓
6. Show transaction log ✓
7. Try same in SecureBank - Fails with "Not owner!" ✓

---

## 📸 Screenshots to Take

1. **Connected wallet screen**
   - Show MetaMask connected
   - Show account address and balance

2. **VulnerableBank - Before Attack**
   - Balance: 10 ETH
   - Owner: deployer address

3. **VulnerableBank - After Ownership Change**
   - Owner now shows your address
   - Transaction log shows success

4. **VulnerableBank - After Withdrawal**
   - Balance: 0 ETH
   - Funds stolen! 💰

5. **SecureBank - Failed Attack**
   - Try to change owner
   - Get "Not owner!" error
   - Transaction log shows failure

6. **Transaction Log**
   - Full history of all interactions
   - Shows success and failure messages

---

## 🛠️ Troubleshooting

### MetaMask not showing popup?
- Make sure MetaMask is unlocked
- Make sure you're on Localhost 8545 network
- Clear browser cache and reload

### Can't connect to network?
- Make sure `npx hardhat node` is still running in terminal
- Don't close that terminal!

### Contract addresses not loading?
- Copy addresses exactly (including 0x)
- Don't add any extra spaces
- Make sure you deployed with `npx hardhat run scripts/deploy.js`

### Buttons not working?
- Make sure MetaMask is connected
- Make sure you're on Localhost 8545
- Check browser console for errors (F12)

---

## 💡 Tips

- **Different accounts**: Select different accounts in MetaMask to test as different users
- **Reload page**: If something seems stuck, reload the page
- **Check transaction log**: All interactions are logged for your report!
- **Take screenshots**: Screenshot everything for your presentation!

---

## 🎯 What Makes It Impressive

✅ Professional web interface
✅ Real blockchain interaction via MetaMask
✅ Live demonstration of vulnerability
✅ Clear UI showing vulnerable vs secure
✅ Transaction history logging
✅ Easy to understand and present

Good luck with your presentation! 🚀
