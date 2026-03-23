// main.js

// Run on page load to detect if MetaMask is available
window.addEventListener('DOMContentLoaded', () => {
    if (!window.ethereum) {
        document.getElementById('status').innerText = "MetaMask not detected! Please install it.";
    } else {
        // Set initial placeholder in sender dropdown
        const senderSelect = document.getElementById('sender');
        senderSelect.innerHTML = "<option value=''>Connect MetaMask to see accounts</option>";
    }
});

// Connect to MetaMask
async function connectMetaMask() {
    if (window.ethereum) {
        try {
            // Request access to accounts
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            document.getElementById('status').innerText = "MetaMask Connected!";
            populateSenderAccounts(accounts);

            // Listen for account changes
            ethereum.on('accountsChanged', function(accounts) {
                if (accounts.length === 0) {
                    // User disconnected all accounts
                    document.getElementById('status').innerText = "No account connected!";
                    document.getElementById('sender').innerHTML = "<option value=''>Connect MetaMask to see accounts</option>";
                } else {
                    // Update dropdown with new account
                    populateSenderAccounts(accounts);
                    document.getElementById('status').innerText = "MetaMask Account Changed!";
                }
            });

        } catch (error) {
            console.error(error);
            document.getElementById('status').innerText = "Connection Rejected!";
        }
    } else {
        alert("MetaMask not detected! Please install it.");
    }
}

// Populate sender dropdown
function populateSenderAccounts(accounts) {
    const senderSelect = document.getElementById('sender');
    senderSelect.innerHTML = ""; // Clear previous options
    if (accounts.length === 0) {
        const option = document.createElement("option");
        option.value = "";
        option.text = "No accounts available";
        senderSelect.appendChild(option);
    } else {
        accounts.forEach((account, index) => {
            const option = document.createElement("option");
            option.value = account;
            option.text = `Account ${index + 1} - ${account}`;
            senderSelect.appendChild(option);
        });
    }
}

// Send ETH transaction
async function sendTransaction() {
    const sender = document.getElementById('sender').value;
    const recipient = document.getElementById('recipient').value;
    const amount = document.getElementById('amount').value;

    if (!sender) {
        alert("Please select a sender account!");
        return;
    }

    if (!recipient || !amount) {
        alert("Please enter recipient and amount!");
        return;
    }

    try {
        // Convert ETH → Wei in hex
        const valueHex = (BigInt(amount * 1e18)).toString(16);

        const tx = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
                from: sender,
                to: recipient,
                value: valueHex,
                gas: '0x5208' // 21000 gas
            }]
        });

        document.getElementById('status').innerText = "Transaction Sent! Tx Hash: " + tx;

    } catch (error) {
        console.error(error);
        document.getElementById('status').innerText = "Transaction Failed!";
    }
}