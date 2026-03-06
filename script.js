// ==============================
// Global variables
// ==============================
let problems = [];
let currentFilter = { search: '', difficulty: '' };

// ==============================
// Detect base path dynamically
// ==============================
const BASE_PATH = (() => {
    if (window.location.hostname.includes('github.io')) {
        const parts = window.location.pathname.split('/');
        return `/${parts[1]}/`; // repo name for GitHub Pages
    }
    return './'; // local server or root domain
})();

// ==============================
// Page type detection
// ==============================
const isIndexPage = document.getElementById('problems-container') !== null;
const isProblemPage = document.getElementById('markdown-content') !== null;

// Initialize based on page
if (isIndexPage) {
    initIndexPage();
} else if (isProblemPage) {
    initProblemPage();
}

// ==============================
// INDEX PAGE FUNCTIONS
// ==============================
async function initIndexPage() {
    try {
        await loadProblems();
    } catch (error) {
        showLoadError(error);
    }
    setupDarkMode();
    setupFilters();
}

function showLoadError(error) {
    console.error('Failed to load problems:', error);

    const container = document.getElementById('problems-container');
    if (!container) return;

    container.innerHTML = `
        <div class="error-message">
            <h2>Unable to load problems</h2>
            <p>It looks like the site is being opened directly from the file system. To load the problem list, run a local web server (for example:</p>
            <pre><code>python -m http.server</code></pre>
            <p>Then open <code>http://localhost:8000</code> in your browser.</p>
        </div>
    `;
}

// ==============================
// Load problems dynamically
// ==============================
async function loadProblems() {
    // Fetch the file list from GitHub Pages workflow-generated JSON
    const configUrl = `${BASE_PATH}config/problems.json`;
    const configResponse = await fetch(configUrl);
    if (!configResponse.ok) throw new Error(`Failed to load problems JSON: ${configResponse.status}`);
    const config = await configResponse.json();
    const problemNames = config.problems;

    for (const name of problemNames) {
        try {
            const mdResponse = await fetch(`${BASE_PATH}content/${name}.md`);
            if (!mdResponse.ok) continue;
            const mdText = await mdResponse.text();
            const frontmatter = parseFrontmatter(mdText);
            problems.push({
                name,
                title: frontmatter.title || name,
                difficulty: frontmatter.difficulty || '',
                tags: frontmatter.tags || []
            });
        } catch (err) {
            console.error(`Failed to load problem ${name}:`, err);
        }
    }

    generateCards();
}

// ==============================
// Parse YAML frontmatter
// ==============================
function parseFrontmatter(text) {
    const lines = text.split('\n');
    if (lines[0] !== '---') return {};

    const endIndex = lines.indexOf('---', 1);
    if (endIndex === -1) return {};

    const frontmatterLines = lines.slice(1, endIndex);
    const data = {};

    frontmatterLines.forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();

            if (key === 'tags') {
                value = value.replace(/[\[\]]/g, '').split(',').map(tag => tag.trim());
            }

            data[key] = value;
        }
    });

    return data;
}

// ==============================
// Generate problem cards
// ==============================
function generateCards() {
    const container = document.getElementById('problems-container');
    container.innerHTML = '';

    if (problems.length === 0) {
        container.innerHTML = `
            <div class="error-message">
                <h2>No problems found</h2>
                <p>Please make sure you're running a server and that the workflow has generated problems.json.</p>
            </div>
        `;
        return;
    }

    problems.forEach(problem => {
        const card = document.createElement('a');
        card.className = 'problem-card';
        card.href = `${BASE_PATH}problem.html?name=${problem.name}`;

        card.innerHTML = `
            <h3>${problem.title}</h3>
            <span class="difficulty ${problem.difficulty}">${problem.difficulty}</span>
            <div class="tags">
                ${problem.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        `;

        container.appendChild(card);
    });

    filterCards();
}

// ==============================
// Filters (search & difficulty)
// ==============================
function setupFilters() {
    const searchInput = document.getElementById('search');
    const difficultySelect = document.getElementById('difficulty');

    searchInput.addEventListener('input', e => {
        currentFilter.search = e.target.value.toLowerCase();
        filterCards();
    });

    difficultySelect.addEventListener('change', e => {
        currentFilter.difficulty = e.target.value;
        filterCards();
    });
}

function filterCards() {
    const cards = document.querySelectorAll('.problem-card');

    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.tag')).map(t => t.textContent.toLowerCase());
        const difficulty = card.querySelector('.difficulty').textContent;

        const matchesSearch = !currentFilter.search ||
            title.includes(currentFilter.search) ||
            tags.some(tag => tag.includes(currentFilter.search));

        const matchesDifficulty = !currentFilter.difficulty || difficulty === currentFilter.difficulty;

        card.style.display = (matchesSearch && matchesDifficulty) ? 'block' : 'none';
    });
}

// ==============================
// Dark mode toggle
// ==============================
function setupDarkMode() {
    const toggle = document.getElementById('dark-mode-toggle');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') document.body.classList.add('light');

    toggle.addEventListener('click', () => {
        document.body.classList.toggle('light');
        localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
    });
}

// ==============================
// PROBLEM PAGE FUNCTIONS
// ==============================
function initProblemPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const problemName = urlParams.get('name');
    if (!problemName) {
        document.getElementById('markdown-content').innerHTML = '<p>Problem not found.</p>';
        return;
    }

    loadProblem(problemName);
    setupBackButton();
    setupCopyButton();
}

async function loadProblem(name) {
    try {
        const mdResponse = await fetch(`${BASE_PATH}content/${name}.md`);
        if (!mdResponse.ok) throw new Error(`Failed to fetch markdown: ${mdResponse.status}`);
        const mdText = await mdResponse.text();

        const frontmatter = parseFrontmatter(mdText);
        document.getElementById('problem-title').textContent = frontmatter.title || name;
        const diffEl = document.getElementById('difficulty');
        diffEl.textContent = frontmatter.difficulty || '';
        diffEl.className = `difficulty ${frontmatter.difficulty || ''}`;
        document.getElementById('tags').innerHTML = (frontmatter.tags || []).map(t => `<span class="tag">${t}</span>`).join('');

        const fmEnd = mdText.indexOf('---', mdText.indexOf('---') + 1);
        const markdownContent = fmEnd !== -1 ? mdText.substring(fmEnd + 3).trim() : mdText;
        document.getElementById('markdown-content').innerHTML = marked.parse(markdownContent);

        const codeResp = await fetch(`${BASE_PATH}solutions/${name}.go`);
        if (!codeResp.ok) throw new Error(`Failed to fetch code: ${codeResp.status}`);
        const codeText = await codeResp.text();

        const codeBlock = document.getElementById('code-block');
        codeBlock.textContent = codeText;
        codeBlock.className = 'language-go';
        Prism.highlightElement(codeBlock);

    } catch (err) {
        console.error(err);
        document.getElementById('markdown-content').innerHTML = '<p>Error loading problem.</p>';
        document.getElementById('code-block').textContent = '// Error loading code';
    }
}

// ==============================
// Back button
// ==============================
function setupBackButton() {
    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', () => window.history.back());
}

// ==============================
// Copy code button
// ==============================
function setupCopyButton() {
    const copyButton = document.getElementById('copy-button');
    copyButton.addEventListener('click', async () => {
        const codeBlock = document.getElementById('code-block');
        try {
            await navigator.clipboard.writeText(codeBlock.textContent);
            const original = copyButton.textContent;
            copyButton.textContent = 'Copied!';
            copyButton.disabled = true;
            setTimeout(() => { copyButton.textContent = original; copyButton.disabled = false; }, 2000);
        } catch (err) {
            const ta = document.createElement('textarea');
            ta.value = codeBlock.textContent;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            copyButton.textContent = 'Copied!';
            setTimeout(() => copyButton.textContent = 'Copy Code', 2000);
        }
    });
}