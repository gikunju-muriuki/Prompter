// UPDATED: client-side script to call Cloudflare Worker proxy

// REGISTER SERVICE WORKER
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('Service Worker Registered'))
        .catch(err => console.error('SW Registration Failed', err));

    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'RESTORE_SELECTION') {
            const savedCoin = event.data.coin;
            if (savedCoin && document.getElementById('coinSelect')) {
                document.getElementById('coinSelect').value = savedCoin;
            }
        }
    });
}

// 1. EXTENSIBLE COIN DATABASE
const cryptoDatabase = {
    "Bitcoin (BTC)": "Bitcoin's golden '₿' coin asset symbol",
    "Ethereum (ETH)": "Ethereum's crystalline, diamond-shaped geometric octahedron asset logo",
    "BNB (BNB)": "BNB's signature yellow and black interlocking diamond asset emblem",
    "XRP (XRP)": "XRP's sleek, modern minimalist triple-line 'X' structural currency logo",
    "Solana (SOL)": "Solana's vibrant green, cyan, and purple stacked gradient geometric bar logo"
};

// 2. INFINITE COMBINATORIAL ENGINE LOGIC
const coreMetaphors = [
    "A massive, unstoppable rocket ship powered directly by the coin logo blasting off smoothly from a cracked launchpad labeled 'Fiat System', leaving stunned onlookers behind.",
    "A sturdy, impenetrable superhero shield bearing the coin emblem effortlessly deflecting a heavy barrage of glowing arrows labeled 'Inflation' and 'Market Debt'.",
    "A sleek, futuristic hypercar branded with the coin asset logo crossing a finish line gracefully, leaving broken-down rusty cars labeled 'Bear Market' in a cloud of dust.",
    "A giant golden playground balance scale where the coin logo completely outweighs and lifts a massive, heavy iron anchor labeled 'Economic Volatility' high into the sky.",
    "A lush, glowing tropical island oasis beautifully shaped exactly like the coin logo, flourishing vibrantly in the middle of a dry, cracked desert landscape labeled 'Uncertainty'."
];

const contextSettings = [
    "The composition uses creative situational irony to visually deliver a sharp economic punchline.",
    "The scene uses a high-contrast minimalist background layout, drawing your eye straight to the relationship between the characters.",
    "The layout uses clever proportional balance, putting full visual focus directly onto the core message.",
    "The single-panel dynamic composition emphasizes dramatic contrast between stability and chaos.",
    "The visual arrangement relies on punchy situational setups to make the financial commentary immediately obvious."
];

const artisticFlairs = [
    "The art style features clean, bold comic ink outlines paired with vibrant, simple flat digital coloring.",
    "The design utilizes expressive, high-impact minimalist marker styling with solid high-contrast tones.",
    "The characters are highly expressive with comedic, exaggerated proportions and playful features.",
    "The cartoon figures boast distinct blocky shapes and funny, disproportionate comic anatomy.",
    "The aesthetic delivers an eye-catching look through highly structured single-panel editorial cartoon design elements."
];

// INITIALIZE USER INTERFACE ELEMENTS
const hfKeyInput = document.getElementById('hfKey'); // still used to save locally, but not sent to HF from client
const coinSelect = document.getElementById('coinSelect');
const generateBtn = document.getElementById('generateBtn');
const promptOutput = document.getElementById('promptOutput');
const copyBtn = document.getElementById('copyBtn');
const generateImgBtn = document.getElementById('generateImgBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const placeholderText = document.getElementById('placeholderText');
const generatedImage = document.getElementById('generatedImage');
const errorDisplay = document.getElementById('errorDisplay');

// Replace this with your deployed Cloudflare Worker URL:
const WORKER_URL = 'https://hf-proxy.gikunju.workers.dev/';

// Populate Dropdown
Object.keys(cryptoDatabase).forEach(coin => {
    let option = document.createElement('option');
    option.value = coin;
    option.textContent = coin;
    coinSelect.appendChild(option);
});

// Load saved selections from LocalStorage
if(localStorage.getItem('selectedCoin')) { coinSelect.value = localStorage.getItem('selectedCoin'); }
if(localStorage.getItem('hfApiKey')) { hfKeyInput.value = localStorage.getItem('hfApiKey'); }

// Track UI changes for Service Worker & local states
coinSelect.addEventListener('change', () => {
    localStorage.setItem('selectedCoin', coinSelect.value);
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SAVE_SELECTION', coin: coinSelect.value });
    }
});
hfKeyInput.addEventListener('input', () => { localStorage.setItem('hfApiKey', hfKeyInput.value); });

// PROMPT GENERATOR RUNNER
function generatePrompt() {
    const selectedCoin = coinSelect.value;
    const logoDesc = cryptoDatabase[selectedCoin];
    
    const metaphor = coreMetaphors[Math.floor(Math.random() * coreMetaphors.length)];
    const context = contextSettings[Math.floor(Math.random() * contextSettings.length)];
    const flair = artisticFlairs[Math.floor(Math.random() * artisticFlairs.length)];
    
    const fullPrompt = `A dynamic editorial cartoon in a clean landscape layout centered around a ${selectedCoin} theme. The artwork visibly showcases ${logoDesc}. ${metaphor} ${context} ${flair} In the upper corner, the handwritten artist signature reads "blog.god on STEEM". Simple, clean composition, highly creative and eye-catching.`;
    
    promptOutput.textContent = fullPrompt;
    promptOutput.style.display = 'block';
    copyBtn.style.display = 'block';
    generateImgBtn.style.display = 'block';
    errorDisplay.style.display = 'none';
}

generateBtn.addEventListener('click', generatePrompt);

// COPY TEXT FEATURE
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(promptOutput.textContent);
    alert('Prompt copied successfully!');
});

// FREE LIVE IMAGE GENERATION PIPELINE (via Cloudflare Worker proxy)
async function generateAIImage() {
    const promptText = promptOutput.textContent;

    if (!promptText || !promptText.trim()) {
        showError("Please generate a prompt first!");
        return;
    }

    // Reset layout UI states for generation step
    errorDisplay.style.display = 'none';
    placeholderText.style.display = 'none';
    generatedImage.style.display = 'none';
    loadingSpinner.style.display = 'block';
    generateImgBtn.disabled = true;

    try {
        // Send prompt to your Cloudflare Worker which holds the HF key securely
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: promptText })
        });

        if (!response.ok) {
            // try to decode JSON error returned by worker
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || `Server responded with status: ${response.status}`);
        }

        // Expect binary image back (worker forwards HF response)
        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);
        
        // Render generated image onto canvas panel
        generatedImage.src = objectURL;
        generatedImage.style.display = 'block';
        placeholderText.style.display = 'none';
    } catch (error) {
        console.error(error);
        showError(`Generation Failed: ${error.message}`);
        placeholderText.style.display = 'block';
    } finally {
        loadingSpinner.style.display = 'none';
        generateImgBtn.disabled = false;
    }
}

function showError(msg) {
    errorDisplay.textContent = msg;
    errorDisplay.style.display = 'block';
}

generateImgBtn.addEventListener('click', generateAIImage);
