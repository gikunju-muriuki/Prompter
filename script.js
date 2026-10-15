// Client-side script: calls your Cloudflare Worker (https://hf-proxy.gikunju.workers.dev)
// Note: the Hugging Face API key must remain on the Worker (server-side).

// REGISTER SERVICE WORKER (keeps saved coin selection behavior)
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

// -------------------- Content Data --------------------
const cryptoDatabase = {
    "Bitcoin (BTC)": "Bitcoin's golden '₿' coin asset symbol",
    "Ethereum (ETH)": "Ethereum's crystalline, diamond-shaped geometric octahedron asset logo",
    "BNB (BNB)": "BNB's signature yellow and black interlocking diamond asset emblem",
    "XRP (XRP)": "XRP's sleek, modern minimalist triple-line 'X' structural currency logo",
    "Solana (SOL)": "Solana's vibrant green, cyan, and purple stacked gradient geometric bar logo"
};

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

// -------------------- UI Elements --------------------
const coinSelect = document.getElementById('coinSelect');
const generateBtn = document.getElementById('generateBtn');
const promptOutput = document.getElementById('promptOutput');
const copyBtn = document.getElementById('copyBtn');
const generateImgBtn = document.getElementById('generateImgBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const placeholderText = document.getElementById('placeholderText');
const generatedImage = document.getElementById('generatedImage');
const errorDisplay = document.getElementById('errorDisplay');

// Replace with your deployed Cloudflare Worker URL (root POST works)
const WORKER_URL = 'https://hf-proxy.gikunju.workers.dev';

// Populate dropdown
Object.keys(cryptoDatabase).forEach(coin => {
    const option = document.createElement('option');
    option.value = coin;
    option.textContent = coin;
    coinSelect.appendChild(option);
});

// Load saved selection if present
if (localStorage.getItem('selectedCoin')) {
    coinSelect.value = localStorage.getItem('selectedCoin');
}

// Save selection
coinSelect.addEventListener('change', () => {
    localStorage.setItem('selectedCoin', coinSelect.value);
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SAVE_SELECTION', coin: coinSelect.value });
    }
});

// -------------------- Prompt generation --------------------
function generatePrompt() {
    const selectedCoin = coinSelect.value || Object.keys(cryptoDatabase)[0];
    const logoDesc = cryptoDatabase[selectedCoin] || '';

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

// Copy prompt
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(promptOutput.textContent)
        .then(() => alert('Prompt copied successfully!'))
        .catch(() => alert('Copy failed'));
});

// -------------------- Image generation (via Worker) --------------------
async function generateAIImage() {
    const promptText = promptOutput.textContent && promptOutput.textContent.trim();
    if (!promptText) {
        showError('Please generate a prompt first!');
        return;
    }

    // UI state
    errorDisplay.style.display = 'none';
    placeholderText.style.display = 'none';
    generatedImage.style.display = 'none';
    loadingSpinner.style.display = 'block';
    generateImgBtn.disabled = true;

    try {
        const resp = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: promptText })
        });

        if (!resp.ok) {
            // Try to parse JSON error from worker (common)
            const errJson = await resp.json().catch(() => null);
            const errMsg = errJson && (errJson.error || JSON.stringify(errJson)) || `Server responded with status ${resp.status}`;
            throw new Error(errMsg);
        }

        // Determine response type: image binary or JSON
        const contentType = resp.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            const json = await resp.json().catch(() => null);
            const errMsg = json && (json.error || JSON.stringify(json)) || 'Unknown JSON response';
            throw new Error(errMsg);
        }

        // Assume binary image
        const blob = await resp.blob();
        const objectURL = URL.createObjectURL(blob);
        generatedImage.src = objectURL;
        generatedImage.style.display = 'block';
        placeholderText.style.display = 'none';
    } catch (err) {
        console.error('Generate error:', err);
        showError(`Generation Failed: ${err.message}`);
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
