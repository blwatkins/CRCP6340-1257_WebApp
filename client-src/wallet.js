/*
 * Copyright (C) 2025 brittni watkins.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// Wallet connection functionality using ES6 modules
let userAddress = null;
let addressPreview = null;
const CONNECT_BUTTON_ID = 'wallet-connect';

// Initialize wallet functionality when DOM is ready
function initWallet() {
    const connectButton = document.getElementById(CONNECT_BUTTON_ID);

    if (connectButton) {
        connectButton.addEventListener('click', async () => {
            // Sample alert functionality as requested in the issue
            alert('Connect Wallet button clicked! Attempting to connect...');
            await connectWallet();
        });
    }
}

async function connectWallet() {
    const connectButton = document.getElementById(CONNECT_BUTTON_ID);

    if (window.ethereum && userAddress === null && addressPreview === null) {
        connectButton.disabled = true;

        await window.ethereum
            .request({ method: 'eth_requestAccounts' })
            .then((accounts) => {
                if (accounts.length > 0) {
                    userAddress = accounts[0];
                    addressPreview = userAddress.substring(0, 6) + '...' + userAddress.substring(userAddress.length - 4);
                    connectButton.innerHTML = addressPreview;

                    // Show success alert
                    alert(`Wallet connected successfully! Address: ${addressPreview}`);

                    return userAddress;
                }

                return undefined;
            }).catch((error) => {
                console.error(error);
                alert('Failed to connect wallet. Please try again.');
            });

        connectButton.disabled = false;
    } else if (!window.ethereum) {
        alert('No Ethereum wallet detected. Please install MetaMask or another compatible wallet.');
    }
}

// Export functions for potential use by other modules
export { initWallet, connectWallet };

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWallet);
} else {
    initWallet();
}
