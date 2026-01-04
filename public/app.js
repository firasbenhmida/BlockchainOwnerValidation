// ============================================
// ACCESS CONTROL DEMO - JAVASCRIPT
// ============================================

// Global variables
let provider;
let signer;
let userAddress;
let userBalance;

// Contract ABIs
const BANK_ABI = [
    "function owner() public view returns (address)",
    "function balances(address) public view returns (uint256)",
    "function deposit() public payable",
    "function withdraw(uint256 amount) public",
    "function getBalance(address user) public view returns (uint256)",
    "function changeOwner(address newOwner) public",
    "function emergencyWithdraw() public",
    "function getContractBalance() public view returns (uint256)"
];

// Contract addresses (will be set by user)
let vulnerableBankAddress = localStorage.getItem('vulnerableBankAddress');
let secureBankAddress = localStorage.getItem('secureBankAddress');

let vulnerableBank;
let secureBank;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Page loaded');
    setupEventListeners();
    
    // Check if contracts are already loaded
    if (vulnerableBankAddress && secureBankAddress) {
        document.getElementById('deployBtn').classList.remove('hidden');
    }
});

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    document.getElementById('connectBtn').addEventListener('click', connectWallet);
}

// ============================================
// WALLET CONNECTION
// ============================================

async function connectWallet() {
    try {
        console.log('🔗 Connecting to MetaMask...');
        
        // Check if MetaMask is installed
        if (!window.ethereum) {
            showError('MetaMask is not installed. Please install it and try again.');
            return;
        }

        // Request accounts
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0];
        console.log('✅ Connected account:', userAddress);

        // Create provider and signer
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();

        // Get balance
        const balance = await provider.getBalance(userAddress);
        userBalance = ethers.formatEther(balance);

        // Update UI
        updateConnectionStatus();
        
        // Show deploy button
        document.getElementById('deployBtn').classList.remove('hidden');
        document.getElementById('deployBtn').addEventListener('click', openAddressModal);

        // If contracts are loaded, show main section
        if (vulnerableBankAddress && secureBankAddress) {
            await loadContracts();
        }

    } catch (error) {
        console.error('❌ Connection error:', error);
        showError('Failed to connect to MetaMask: ' + error.message);
    }
}

function updateConnectionStatus() {
    const status = document.getElementById('connectionStatus');
    const accountInfo = document.getElementById('accountInfo');
    
    status.textContent = '✅ Connected';
    status.classList.remove('disconnected');
    status.classList.add('connected');
    
    document.getElementById('accountAddress').textContent = userAddress;
    document.getElementById('accountBalance').textContent = userBalance.substring(0, 6);
    accountInfo.classList.remove('hidden');
    
    document.getElementById('connectBtn').textContent = '✅ Connected';
    document.getElementById('connectBtn').disabled = true;
}

// ============================================
// LOAD CONTRACTS
// ============================================

async function openAddressModal() {
    document.getElementById('addressModal').classList.remove('hidden');
}

function closeAddressModal() {
    document.getElementById('addressModal').classList.add('hidden');
}

async function loadContractAddresses() {
    const vulnAddr = document.getElementById('vulnAddress').value.trim();
    const secAddr = document.getElementById('secAddress').value.trim();

    if (!vulnAddr || !secAddr) {
        alert('Please enter both contract addresses');
        return;
    }

    // Validate addresses
    if (!ethers.isAddress(vulnAddr) || !ethers.isAddress(secAddr)) {
        alert('Invalid address format');
        return;
    }

    vulnerableBankAddress = vulnAddr;
    secureBankAddress = secAddr;

    // Save to localStorage
    localStorage.setItem('vulnerableBankAddress', vulnAddr);
    localStorage.setItem('secureBankAddress', secAddr);

    closeAddressModal();
    await loadContracts();
}

async function loadContracts() {
    try {
        if (!signer) {
            showError('Wallet not connected. Please connect MetaMask first.');
            return;
        }

        console.log('📦 Loading contracts...');

        // Load contract instances
        vulnerableBank = new ethers.Contract(vulnerableBankAddress, BANK_ABI, signer);
        secureBank = new ethers.Contract(secureBankAddress, BANK_ABI, signer);

        // Show main section
        document.getElementById('connectionSection').style.display = 'none';
        document.getElementById('mainSection').classList.remove('hidden');
        document.getElementById('errorSection').classList.add('hidden');

        // Refresh data
        await refreshVulnerable();
        await refreshSecure();

        addLog('✅ Contracts loaded successfully', 'success');
        console.log('✅ Contracts loaded');

    } catch (error) {
        console.error('❌ Error loading contracts:', error);
        showError('Error loading contracts: ' + error.message);
    }
}

// ============================================
// REFRESH CONTRACT DATA
// ============================================

async function refreshVulnerable() {
    try {
        const owner = await vulnerableBank.owner();
        const balance = await vulnerableBank.getContractBalance();
        const userBalance = await vulnerableBank.getBalance(userAddress);

        document.getElementById('vuln-owner').textContent = owner;
        document.getElementById('vuln-balance').textContent = ethers.formatEther(balance).substring(0, 6);
        document.getElementById('vuln-user-balance').textContent = ethers.formatEther(userBalance).substring(0, 6);
        document.getElementById('vuln-status').textContent = '✅ Connected';

    } catch (error) {
        console.error('Error refreshing vulnerable bank:', error);
        document.getElementById('vuln-status').textContent = '❌ Error';
    }
}

async function refreshSecure() {
    try {
        const owner = await secureBank.owner();
        const balance = await secureBank.getContractBalance();
        const userBalance = await secureBank.getBalance(userAddress);

        document.getElementById('sec-owner').textContent = owner;
        document.getElementById('sec-balance').textContent = ethers.formatEther(balance).substring(0, 6);
        document.getElementById('sec-user-balance').textContent = ethers.formatEther(userBalance).substring(0, 6);
        document.getElementById('sec-status').textContent = '✅ Connected';

    } catch (error) {
        console.error('Error refreshing secure bank:', error);
        document.getElementById('sec-status').textContent = '❌ Error';
    }
}

// ============================================
// VULNERABLE BANK FUNCTIONS
// ============================================

async function vulnDeposit() {
    try {
        addLog('💰 Depositing 1 ETH to VulnerableBank...', 'info');
        const tx = await vulnerableBank.deposit({ value: ethers.parseEther('1') });
        addLog('⏳ Transaction pending: ' + tx.hash, 'info');
        await tx.wait();
        addLog('✅ Deposit successful in VulnerableBank!', 'success');
        await refreshVulnerable();
    } catch (error) {
        addLog('❌ Deposit failed: ' + error.message, 'error');
    }
}

async function vulnWithdraw() {
    try {
        const balance = await vulnerableBank.getBalance(userAddress);
        if (balance == 0) {
            addLog('⚠️ You have no balance to withdraw', 'error');
            return;
        }
        addLog('💸 Withdrawing from VulnerableBank...', 'info');
        const tx = await vulnerableBank.withdraw(balance);
        addLog('⏳ Transaction pending: ' + tx.hash, 'info');
        await tx.wait();
        addLog('✅ Withdrawal successful!', 'success');
        await refreshVulnerable();
    } catch (error) {
        addLog('❌ Withdrawal failed: ' + error.message, 'error');
    }
}

// Global variable to track which contract is being used
let currentContractType = null;

async function vulnChangeOwner() {
    currentContractType = 'vulnerable';
    openNewOwnerModal();
}

async function executeVulnChangeOwner(newOwnerAddress) {
    try {
        addLog('🚨 ATTACK: Trying to change owner in VulnerableBank to ' + newOwnerAddress + '...', 'error');
        const tx = await vulnerableBank.changeOwner(newOwnerAddress);
        addLog('⏳ Transaction pending: ' + tx.hash, 'info');
        await tx.wait();
        addLog('❌ VULNERABILITY CONFIRMED: Successfully changed owner to ' + newOwnerAddress + '! Anyone can do this!', 'error');
        await refreshVulnerable();
    } catch (error) {
        addLog('⚠️ Change owner failed: ' + error.message, 'error');
    }
}

async function vulnEmergencyWithdraw() {
    try {
        addLog('💸 Emergency withdrawing from VulnerableBank...', 'info');
        const tx = await vulnerableBank.emergencyWithdraw();
        addLog('⏳ Transaction pending: ' + tx.hash, 'info');
        await tx.wait();
        addLog('💰 Emergency withdrawal successful! (If you were owner)', 'success');
        await refreshVulnerable();
    } catch (error) {
        addLog('⚠️ Emergency withdraw failed: ' + error.message, 'error');
    }
}

// ============================================
// SECURE BANK FUNCTIONS
// ============================================

async function secDeposit() {
    try {
        addLog('💰 Depositing 1 ETH to SecureBank...', 'info');
        const tx = await secureBank.deposit({ value: ethers.parseEther('1') });
        addLog('⏳ Transaction pending: ' + tx.hash, 'info');
        await tx.wait();
        addLog('✅ Deposit successful in SecureBank!', 'success');
        await refreshSecure();
    } catch (error) {
        addLog('❌ Deposit failed: ' + error.message, 'error');
    }
}

async function secWithdraw() {
    try {
        const balance = await secureBank.getBalance(userAddress);
        if (balance == 0) {
            addLog('⚠️ You have no balance to withdraw', 'error');
            return;
        }
        addLog('💸 Withdrawing from SecureBank...', 'info');
        const tx = await secureBank.withdraw(balance);
        addLog('⏳ Transaction pending: ' + tx.hash, 'info');
        await tx.wait();
        addLog('✅ Withdrawal successful!', 'success');
        await refreshSecure();
    } catch (error) {
        addLog('❌ Withdrawal failed: ' + error.message, 'error');
    }
}

async function secChangeOwner() {
    currentContractType = 'secure';
    openNewOwnerModal();
}

async function executeSecChangeOwner(newOwnerAddress) {
    try {
        addLog('🔒 Trying to change owner in SecureBank to ' + newOwnerAddress + ' (should fail)...', 'info');
        const tx = await secureBank.changeOwner(newOwnerAddress);
        addLog('⏳ Transaction pending: ' + tx.hash, 'info');
        await tx.wait();
        addLog('❌ Unexpected: Change owner succeeded to ' + newOwnerAddress, 'error');
        await refreshSecure();
    } catch (error) {
        if (error.message.includes('Not owner')) {
            addLog('✅ SECURITY CONFIRMED: Access denied - "Not owner!" error', 'success');
        } else {
            addLog('✅ SECURITY WORKING: Transaction failed with error: ' + error.message, 'success');
        }
    }
}

async function secEmergencyWithdraw() {
    try {
        addLog('💸 Trying to emergency withdraw from SecureBank...', 'info');
        const tx = await secureBank.emergencyWithdraw();
        addLog('⏳ Transaction pending: ' + tx.hash, 'info');
        await tx.wait();
        addLog('💰 Emergency withdrawal successful! (Only owner)', 'success');
        await refreshSecure();
    } catch (error) {
        addLog('🛡️ Emergency withdraw blocked (only owner allowed): ' + error.message, 'success');
    }
}

// ============================================
// TRANSACTION LOG
// ============================================

function addLog(message, type = 'info') {
    const log = document.getElementById('transactionLog');
    
    // Remove "waiting" message if it exists
    const emptyMsg = log.querySelector('.log-empty');
    if (emptyMsg) {
        emptyMsg.remove();
    }

    // Create log entry
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    
    const timestamp = new Date().toLocaleTimeString();
    entry.innerHTML = `<span class="log-timestamp">[${timestamp}]</span> ${escapeHtml(message)}`;
    
    log.insertBefore(entry, log.firstChild);
    
    // Keep only last 50 entries
    while (log.children.length > 50) {
        log.removeChild(log.lastChild);
    }

    console.log(`[${type.toUpperCase()}]`, message);
}

function clearLog() {
    const log = document.getElementById('transactionLog');
    log.innerHTML = '<p class="log-empty">Log cleared. Waiting for interactions...</p>';
}

// ============================================
// ERROR HANDLING
// ============================================

function showError(message) {
    document.getElementById('errorSection').classList.remove('hidden');
    document.getElementById('mainSection').classList.add('hidden');
    document.getElementById('errorMessage').textContent = message;
    console.error('❌', message);
}

// ============================================
// NEW OWNER MODAL FUNCTIONS
// ============================================

function openNewOwnerModal() {
    const modal = document.getElementById('newOwnerModal');
    const addressHint = document.getElementById('currentAddressHint');
    const inputField = document.getElementById('newOwnerAddress');
    
    // Set the current address hint
    addressHint.textContent = userAddress;
    
    // Clear previous input
    inputField.value = '';
    
    // Show modal
    modal.classList.remove('hidden');
}

function closeNewOwnerModal() {
    const modal = document.getElementById('newOwnerModal');
    modal.classList.add('hidden');
}

async function confirmChangeOwner() {
    const newOwnerAddress = document.getElementById('newOwnerAddress').value.trim();
    
    // Validate address
    if (!newOwnerAddress) {
        alert('Please enter a valid address');
        return;
    }
    
    if (!ethers.isAddress(newOwnerAddress)) {
        alert('Invalid Ethereum address format');
        return;
    }
    
    // Close modal
    closeNewOwnerModal();
    
    // Execute based on contract type
    if (currentContractType === 'vulnerable') {
        await executeVulnChangeOwner(newOwnerAddress);
    } else if (currentContractType === 'secure') {
        await executeSecChangeOwner(newOwnerAddress);
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// LISTEN FOR ACCOUNT/CHAIN CHANGES
// ============================================

if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            console.log('⚠️ No accounts found. Please connect MetaMask.');
            location.reload();
        } else {
            console.log('Account changed:', accounts[0]);
            location.reload();
        }
    });

    window.ethereum.on('chainChanged', (chainId) => {
        console.log('Chain changed:', chainId);
        location.reload();
    });
}
