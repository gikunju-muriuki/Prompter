// Client-side script: calls your Cloudflare Worker (https://hf-proxy.gikunju.workers.dev)
// Note: the Hugging Face API key must remain on the Worker (server-side).

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

const sceneSubjects = [
    "a fortress of digital wealth",
    "a floating city of economic resilience",
    "a surreal mountain citadel",
    "a neon underground vault",
    "a shattered stock market skyline",
    "a glowing solar temple",
    "a moonlit blockchain observatory",
    "a glass monolith surrounded by lightning storms",
    "a mythic arena of impossible finance",
    "a ruined empire rebuilt by crypto innovation",
    "a giant floating coin temple over the clouds",
    "an electric desert skyline with impossible architecture",
    "a dreamlike market district in perpetual motion",
    "a crystal harbor full of glowing trade vessels",
    "a futuristic vault suspended in a storm",
    "a sacred garden of coins and data streams",
    "a cathedral of trust built on impossible mathematics",
    "a floating market above the clouds",
    "a techno-religious shrine of blockchain light",
    "a luxury tower built from digital certainty",
    "a cracked empire rising from financial chaos",
    "a luminous data forest with endless corridors",
    "a cathedral of capital in the middle of a storm",
    "a hidden civilization powered by scarcity and trust",
    "a surreal city built from one impossible idea",
    "a volcanic citadel of sentiment and momentum",
    "a high-security vault hidden inside a dream",
    "a moonlit observatory tracking tomorrow's markets",
    "a futuristic archipelago of financial myth",
    "a glittering canyon of impossible wealth",
    "a hall of mirrors made from speculative energy"
];

const narrativeFrames = [
    "rising above a collapsing fiat system",
    "standing defiant against inflation and panic",
    "capturing the exact moment the market shifts",
    "turning volatility into momentum",
    "creating a surreal balance of chaos and stability",
    "shielding the future from economic uncertainty",
    "outpacing a field of broken legacy systems",
    "drawing power from a hidden source of trust",
    "projecting a new kind of global confidence",
    "glowing like a final answer to uncertainty",
    "turning fear into long-term conviction",
    "smashing through a wall of market doubt",
    "making scarcity feel legendary",
    "redefining what strength looks like in a chaotic economy",
    "turning panic into a visual landmark",
    "becoming a symbol of unstoppable momentum",
    "redefining wealth as a living myth",
    "turning pressure into iconic power",
    "turning uncertainty into a masterpiece of confidence",
    "establishing power in the middle of the noise",
    "turning skepticism into wonder",
    "turning digital certainty into a legend",
    "weaponizing clarity against misinformation",
    "becoming a beacon of economic sovereignty",
    "rising as the new center of gravity",
    "making every risk feel strategically beautiful",
    "reclaiming the future from panic",
    "glowing as a promise no one can deny",
    "making the impossible look inevitable",
    "becoming a monument of conviction"
];

const environmentalModifiers = [
    "in a dramatic thunderstorm of market pressure",
    "in the middle of a glowing aurora",
    "under a cinematic golden-hour sky",
    "inside a futuristic glass canyon",
    "amidst impossible floating islands",
    "inside a desert of collapsed legacy systems",
    "beneath storm clouds charged with electricity",
    "in a quiet cathedral of digital trust",
    "surrounded by impossible crystal towers",
    "over a vast ocean of data streams",
    "inside a suspended high-security vault",
    "at the edge of a collapsing moonlit skyline",
    "inside a surreal trading metropolis",
    "beneath a red-hot industrial sunrise",
    "beyond a horizon of broken assumptions",
    "above a field of radiant energy bars",
    "inside a luminous cryptic monument",
    "under a sky full of powdered silver clouds",
    "in a city suspended between myth and data",
    "in a sunrise that looks almost divine",
    "next to a shattered bridge of old financial thinking",
    "within a cavern of glowing trade engines",
    "through a field of cold, reflective thunder",
    "among floating monuments of future capital",
    "inside a dreamlike financial skyline",
    "between layers of impossible architecture",
    "beneath a midnight horizon of electric motion",
    "at the edge of a world made of precision and noise",
    "inside a cathedral of speculative light",
    "in a valley where every structure tells a story"
];

const visualStyles = [
    "clean editorial cartoon composition",
    "high-detail cinematic illustration",
    "bold comic-book ink outlines with flat colors",
    "surreal painterly realism",
    "minimalist infographic energy",
    "dramatic neon cyberpunk framing",
    "storybook fantasy realism",
    "polished luxury brand poster styling",
    "gritty industrial cinematic design",
    "vibrant digital watercolor fusion",
    "retro-futurist poster art",
    "arcade-style heroic composition",
    "high-contrast editorial illustration",
    "luxury concept art with premium lighting",
    "graphic novel style with exaggerated motion",
    "ink-and-paint fantasy worldbuilding",
    "soft luxury product visualization",
    "high-gloss cinematic poster design",
    "ornate mythic concept art",
    "hyper-detailed worldbuilding illustration",
    "brutalist futuristic poster composition",
    "expressive modern editorial art",
    "rich mythic realism in a premium frame",
    "ultra-clean brand campaign illustration",
    "explosive action-film storytelling art",
    "designer comic cover composition",
    "cinematic tableau with layered symbolism",
    "premium ad campaign styling",
    "vivid animated-world poster design",
    "storybook realism with collectible energy"
];

const lightingMoods = [
    "golden sunlight spilling across the scene",
    "cold blue cinematic illumination",
    "electric cyan glow reflecting off every surface",
    "soft sunrise haze warming the composition",
    "volcanic amber light bursting through the atmosphere",
    "deep moody shadows with sharp contrast",
    "iridescent neon reflections everywhere",
    "blazing dusk tones and cinematic rim light",
    "dreamlike moonlit clarity",
    "ultra-saturated studio lighting",
    "a storm-lit halo around the subject",
    "soft atmospheric haze with dramatic depth",
    "reflective chrome highlights and golden sparks",
    "magical twilight glow with rich color separation",
    "sharp directional spotlight focus",
    "rainy glass reflections with intense contrast",
    "silver moonlight with delicate texture",
    "warm amber editorial glow",
    "cold corridor lighting with immersive depth",
    "bright studio-light perfection with luxe polish",
    "electric violet softness",
    "harsh sunrise contrast with cinematic grit",
    "golden energy bloom across every surface",
    "glowing prism colors with luxury styling",
    "luminous dusk shadows and rich atmospheric depth",
    "subtle light leaks for a premium editorial feel",
    "high-key studio clarity with expensive color",
    "deep shadow contrast with radiant highlights",
    "snowy white-blue glow for a premium futuristic look"
];

const cameraAngles = [
    "wide cinematic establishing shot",
    "low-angle heroic perspective",
    "dynamic overhead drone view",
    "close-up macro detail shot",
    "a tilted Dutch angle for tension",
    "supersized front-facing framing",
    "slow-parallax environmental composition",
    "dramatic side profile composition",
    "immersive first-person perspective",
    "ultra-wide battlefield framing",
    "tight portrait framing on the symbol",
    "high-detail symmetrical composition",
    "deep-focus layered visual storytelling",
    "hero shot with maximal impact",
    "wide-angle poster layout",
    "dramatic closeup with heavy contrast",
    "low, intimate framing for emotional weight",
    "cinematic profile with strong silhouette",
    "top-down architectural composition",
    "overhead perspective with symbolic clarity",
    "front-facing brand-shot framing",
    "seen from a distant, awe-filled vantage point",
    "shot from a steep angle with dramatic pressure",
    "candid field composition with narrative tension",
    "isometric framing that feels premium and designed",
    "micro-detail closeup showing craftsmanship",
    "wide panoramic storytelling frame",
    "tight composition with strong foreground focus",
    "single-point perspective with dramatic depth"
];

const finishNotes = [
    "with layered symbolism and strong storytelling",
    "with fluid motion and impossible architecture",
    "with confident visual hierarchy and bold contrast",
    "with premium polished detail and emotional intensity",
    "with a crisp layout that instantly communicates the idea",
    "with surreal perspective and visual tension",
    "with incredibly rich worldbuilding and symbolic detail",
    "with vivid color contrast and editorial storytelling",
    "with cinematic pacing and high-impact composition",
    "with premium art direction and layered narrative clues",
    "with exacting balance between chaos and control",
    "with visual narrative clarity and dramatic emphasis",
    "with layered metaphors and symbolic storytelling",
    "with a unique modern art direction and polished finish",
    "with unforgettable contrast and visual presence",
    "with absurdly strong iconic framing",
    "with atmospheric richness and premium worldbuilding",
    "with confident art direction and rich visual drama",
    "with gorgeous color separation and emotional clarity",
    "with unmistakable commercial-grade polish",
    "with iconic storytelling and memorable composition",
    "with striking energy, rhythm, and clarity",
    "with a premium cinematic finish",
    "with luxurious detail and maximal visual punch",
    "with elegant conceptual design and emotional weight",
    "with premium editorial polish and narrative depth",
    "with a sculpted sense of presence and power",
    "with beautifully balanced tension and visual clarity",
    "with giant-scale symbolic framing"
];

const seenPrompts = new Set();

function normalizePrompt(text) {
    return (text || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function randomPick(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateUniquePromptVariant(selectedCoin, logoDesc) {
    const scene = randomPick(sceneSubjects);
    const narrative = randomPick(narrativeFrames);
    const environment = randomPick(environmentalModifiers);
    const style = randomPick(visualStyles);
    const lighting = randomPick(lightingMoods);
    const camera = randomPick(cameraAngles);
    const finish = randomPick(finishNotes);

    const prompt = `
A ${style} centered on ${selectedCoin} and the idea of ${scene}. The artwork visibly showcases ${logoDesc}. ${narrative} ${environment}. ${lighting}, ${camera}, ${finish}.
`.trim();

    const normalized = normalizePrompt(prompt);

    if (seenPrompts.has(normalized)) {
        return null;
    }

    seenPrompts.add(normalized);
    return prompt;
}

function generatePrompt() {
    const selectedCoin = coinSelect.value || Object.keys(cryptoDatabase)[0];
    const logoDesc = cryptoDatabase[selectedCoin] || "";

    let fullPrompt = null;

    // Try many times to avoid duplicates, but keep it fast
    for (let i = 0; i < 120; i++) {
        fullPrompt = generateUniquePromptVariant(selectedCoin, logoDesc);
        if (fullPrompt) break;
    }

    if (!fullPrompt) {
        fullPrompt = `A cinematic editorial illustration centered on ${selectedCoin}. The artwork visibly showcases ${logoDesc}. A bold, iconic representation of financial strength, resilience, and market confidence, using rich composition, striking contrast, and premium storytelling.`;
    }

    promptOutput.textContent = fullPrompt;
    promptOutput.style.display = 'block';
    copyBtn.style.display = 'block';
    generateImgBtn.style.display = 'block';
    errorDisplay.style.display = 'none';
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
