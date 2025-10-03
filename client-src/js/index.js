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

// Import ES6 modules
import { WalletManager } from './wallet.js';
import { ContactForm } from './contact-email.js';
import { SplashScreen } from './splash.js';

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize wallet manager
    const walletManager = new WalletManager();

    // Initialize contact form (only if on contact page)
    if (document.getElementById('contact-form')) {
        const contactForm = new ContactForm();
    }

    // Initialize splash screen (only if splash canvas exists)
    if (document.getElementById('splashCanvas')) {
        const splashScreen = new SplashScreen();
    }
});

// Make modules available globally for debugging if needed
window.WebAppModules = {
    WalletManager,
    ContactForm,
    SplashScreen
};
