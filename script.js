// Client-side script: calls your Cloudflare Worker (https://hf-proxy.gikunju.workers.dev)
// This version focuses generation on comic/editorial cartoon prompts (single-panel, landscape, minimal, punchline-driven)
// - Preserves UI and image-generation worker integration
// - Produces varied, non-repetitive comic/cartoon prompts
// - Enforces artist credit "blog.god on STEEM" and landscape layout when requested

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

// -------------------- Content Data (comic/cartoon focused) --------------------
const cryptoDatabase = {
    "Bitcoin (BTC)": "Bitcoin's golden '₿' coin asset symbol",
    "Ethereum (ETH)": "Ethereum's crystalline, diamond-shaped geometric octahedron asset logo",
    "BNB (BNB)": "BNB's signature yellow and black interlocking diamond asset emblem",
    "XRP (XRP)": "XRP's sleek, modern minimalist triple-line 'X' structural currency logo",
    "Solana (SOL)": "Solana's vibrant green, cyan, and purple stacked gradient geometric bar logo"
};

// Pools tuned to produce single-panel editorial cartoon prompts
const punchlineSubjects = [
    "a coin as heroic protagonist",
    "the coin as an everyday object with a twist",
    "a coin confronting a bureaucratic symbol",
    "a coin and a tiny weary human trader",
    "a coin as a petty villain turned comic hero",
    "the coin oversized in an ordinary scene",
    "a coin turning a mundane device into a spectacle",
    "a coin perched on a comically small pedestal",
    "a coin riding a broken-down market cart",
    "a coin as a whimsical island centerpiece"
];

// Visual and style fragments that map to the original app's comic/cartoon brief
const lineWork = [
    "expressive slightly-loose ink outlines",
    "clean confident ink outlines with minimal cross-hatching",
    "bold contour lines with restrained cross-hatching for shadowing",
    "energetic sketchy ink lines kept readable"
];

const characterDesign = [
    "exaggerated comedic features: oversized noses, blocky shapes, disproportionate limbs",
    "simplified caricatured characters with clear silhouettes",
    "playful cartoon anatomy emphasizing emotion and gesture",
    "stylized figures with small legs and large upper bodies for humor"
];

const coloration = [
    "flat high-contrast marker/digital colors, minimal shading",
    "limited palette with bold blocks of color, little texture",
    "solid color fields and spot-color highlights to focus the punchline",
    "simple two- or three-color scheme for immediate readability"
];

const composition = [
    "single-panel landscape layout, minimalist background",
    "single-panel horizontal composition focusing on situational irony",
    "one-panel editorial cartoon, clear foreground punchline",
    "single-frame comic strip layout, wide landscape" 
];

const cameraAndFraming = [
    "medium shot focusing on characters and action",
    "wide landscape view that keeps scene simple and readable",
    "tight framing that centers the logo and interaction",
    "three-quarter view to show context without clutter"
];

const arabVibeModifiers = [
    "Arab vibe: cultural styling cues in clothing and architecture, tasteful and respectful",
    "Middle Eastern street scene touches: decorative tiles, simple market stalls",
    "Arab aesthetic accents: keffiyeh-pattern hints, warm desert tones"
];

const editorialNotes = [
    "avoid complication; keep the scene simple but catchy",
    "focus on a single ironic relationship or visual gag",
    "no verbose captions — rely on visual punchline",
    "avoid busy backgrounds and excessive detail"
];

// Words/phrases to avoid literally in generated prompt (user requested)
const forbiddenPhrases = [
    "line work:",
    "character design:",
    "coloration:",
    "composition:",
    "the artist's name",
    "avoid words"
];

// Utility / dedupe
const seenPrompts = new Set();
function normalizePrompt(text) {
    return (text || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function randomPick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Build a prompt that honors the original comic/cartoon brief and the user's example
function buildComicPrompt(selectedCoin, logoDesc, options = {}) {
    // options: { arabVibe: boolean, strictMinimal: boolean }
    const arab = options.arabVibe ? randomPick(arabVibeModifiers) : '';

    // select fragments ensuring we keep to simple readable language (avoid bullet labels)
    const subject = randomPick(punchlineSubjects);
    const lw = randomPick(lineWork);
    const cd = randomPick(characterDesign);
    const col = randomPick(coloration);
    const comp = randomPick(composition);
    const cam = randomPick(cameraAndFraming);
    const note = randomPick(editorialNotes);

    // assemble using short clear sentences; ensure artist credit and landscape layout
    let prompt = `Create a ${comp} in editorial cartoon / single-panel comic style centered on ${selectedCoin} (include the ${selectedCoin.split(' ')[0]} logo visually). Keep it simple, catchy, and easy to read.`;

    prompt += ` Line work: ${lw}. Character design: ${cd}. Colors: ${col}. Framing: ${cam}. ${note}.`;

    if (arab) prompt += ` Cultural vibe: ${arab}.`;

    // Artist credit and layout explicit requirement
    prompt += ` Use landscape layout. Credit: blog.god on STEEM.`;

    // Post-process: remove any forbidden phrases if they accidentally got included
    forbiddenPhrases.forEach(fp => {
        const re = new RegExp(fp, 'ig');
        prompt = prompt.replace(re, '');
    });

    // Normalize extra whitespace
    prompt = prompt.replace(/\s+/g, ' ').trim();

    return prompt;
}

function generateUniqueComicPrompt(selectedCoin, logoDesc, options = {}) {
    for (let i = 0; i < 60; i++) {
        const p = buildComicPrompt(selectedCoin, logoDesc, options);
        const n = normalizePrompt(p);
        if (seenPrompts.has(n)) continue;
        seenPrompts.add(n);
        return p;
    }
    // fallback
    return `Create a single-panel editorial cartoon in landscape layout centered on ${selectedCoin} (include the ${selectedCoin.split(' ')[0]} logo). Simple, catchy, flat colors, clear ink outlines, and credit to blog.god on STEEM.`;
}

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

// -------------------- Prompt generation (UI hook) --------------------
function generatePrompt() {
    const selectedCoin = coinSelect.value || Object.keys(cryptoDatabase)[0];
    const logoDesc = cryptoDatabase[selectedCoin] || '';

    // default options: keep arab vibe off unless coin is XRP (example)
    const options = { arabVibe: selectedCoin.startsWith('XRP') };

    const prompt = generateUniqueComicPrompt(selectedCoin, logoDesc, options);

    promptOutput.textContent = prompt;
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
            const errJson = await resp.json().catch(() => null);
            const errMsg = errJson && (errJson.error || JSON.stringify(errJson)) || `Server responded with status ${resp.status}`;
            throw new Error(errMsg);
        }

        const contentType = resp.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            const json = await resp.json().catch(() => null);
            const errMsg = json && (json.error || JSON.stringify(json)) || 'Unknown JSON response';
            throw new Error(errMsg);
        }

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
