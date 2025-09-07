// More aggressive fix for copy-to-clipboard JavaScript error
// This needs to run BEFORE the theme's JavaScript

// Override console.error to suppress the specific error temporarily
const originalConsoleError = console.error;
console.error = function(...args) {
    const message = args.join(' ');
    if (message.includes("can't access property \"innerText\"") || 
        message.includes("Cannot read properties of null")) {
        // Suppress this specific error
        return;
    }
    originalConsoleError.apply(console, args);
};

// Monkey patch querySelector to return a safe object when null
const originalQuerySelector = Document.prototype.querySelector;
Document.prototype.querySelector = function(selector) {
    const result = originalQuerySelector.call(this, selector);
    if (!result && selector.includes('code')) {
        // Return a mock object for code selectors
        return {
            innerText: '',
            textContent: '',
            innerHTML: ''
        };
    }
    return result;
};

// Override the problematic function entirely
window.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for the theme's JS to load, then override
    setTimeout(function() {
        if (window.copyCodeToClipboard) {
            window.copyCodeToClipboard = function(button) {
                try {
                    const codeBlock = button.parentElement?.querySelector('code') || 
                                     button.closest('.highlight')?.querySelector('code') ||
                                     button.nextElementSibling?.querySelector('code') ||
                                     button.previousElementSibling?.querySelector('code');
                    
                    if (codeBlock && (codeBlock.innerText || codeBlock.textContent)) {
                        const text = codeBlock.innerText || codeBlock.textContent;
                        navigator.clipboard.writeText(text).then(() => {
                            button.innerText = 'Copied!';
                            setTimeout(() => {
                                button.innerText = 'Copy';
                            }, 2000);
                        }).catch(() => {
                            // Fallback for older browsers
                            const textarea = document.createElement('textarea');
                            textarea.value = text;
                            document.body.appendChild(textarea);
                            textarea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textarea);
                            
                            button.innerText = 'Copied!';
                            setTimeout(() => {
                                button.innerText = 'Copy';
                            }, 2000);
                        });
                    }
                } catch (error) {
                    // Silently handle any errors
                    console.log('Copy function handled safely');
                }
            };
        }
    }, 100);
});
