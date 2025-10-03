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

export class WalletManager {
    constructor() {
        this.userAddress = null;
        this.addressPreview = null;
        this.connectButton = null;
        this.CONNECT_BUTTON_ID = 'wallet-connect';

        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupWallet());
        } else {
            this.setupWallet();
        }
    }

    setupWallet() {
        this.connectButton = document.getElementById(this.CONNECT_BUTTON_ID);

        if (this.connectButton) {
            this.connectButton.addEventListener('click', async () => {
                // Show browser alert as requested for testing webpack bundling
                alert('Wallet connection initiated with webpack bundling and ES6 modules!');
                await this.connectWallet();
            });
        }
    }

    async connectWallet() {
        if (window.ethereum && this.userAddress === null && this.addressPreview === null) {
            this.connectButton.disabled = true;

            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

                if (accounts.length > 0) {
                    this.userAddress = accounts[0];
                    this.addressPreview = this.userAddress.substring(0, 6) + '...' + this.userAddress.substring(this.userAddress.length - 4);
                    this.connectButton.innerHTML = this.addressPreview;
                }
            } catch (error) {
                console.error('Wallet connection error:', error);
                alert('Failed to connect wallet: ' + error.message);
            } finally {
                this.connectButton.disabled = false;
            }
        }
    }
}
