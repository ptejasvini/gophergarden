// Global variables
let problems = [];
let currentFilter = { search: '', difficulty: '' };

// Check which page we're on
const isIndexPage = document.getElementById('problems-container') !== null;
const isProblemPage = document.getElementById('markdown-content') !== null;

// Initialize based on page
if (isIndexPage) {
    initIndexPage();
} else if (isProblemPage) {
    initProblemPage();
}

// Index page initialization
function initIndexPage() {
    loadProblems();
    setupDarkMode();
    setupFilters();
}

// Load problems from markdown files
async function loadProblems() {
    // Hardcoded list of problem names (in a real app, this could be generated or from a config)
    const problemNames = ['two-sum', 'swap-without-temp'];

    for (const name of problemNames) {
        try {
            const response = await fetch(`content/${name}.md`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const text = await response.text();
            const frontmatter = parseFrontmatter(text);
            if (frontmatter.title) {
                problems.push({
                    name,
                    title: frontmatter.title,
                    difficulty: frontmatter.difficulty,
                    tags: frontmatter.tags || []
                });
            }
        } catch (error) {
            console.error(`Failed to load problem ${name}:`, error);
        }
    }

    generateCards();
}

// Parse frontmatter manually (simple YAML parser)
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
                // Parse tags array
                value = value.replace(/[\[\]]/g, '').split(',').map(tag => tag.trim());
            }

            data[key] = value;
        }
    });

    return data;
}

// Generate problem cards
function generateCards() {
    const container = document.getElementById('problems-container');
    container.innerHTML = '';

    problems.forEach(problem => {
        const card = document.createElement('a');
        card.className = 'problem-card';
        card.href = `problem.html?name=${problem.name}`;

        card.innerHTML = `
            <h3>${problem.title}</h3>
            <span class="difficulty ${problem.difficulty}">${problem.difficulty}</span>
            <div class="tags">
                ${problem.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        `;

        container.appendChild(card);
    });

    // Apply current filters
    filterCards();
}

// Setup search and difficulty filters
function setupFilters() {
    const searchInput = document.getElementById('search');
    const difficultySelect = document.getElementById('difficulty');

    searchInput.addEventListener('input', (e) => {
        currentFilter.search = e.target.value.toLowerCase();
        filterCards();
    });

    difficultySelect.addEventListener('change', (e) => {
        currentFilter.difficulty = e.target.value;
        filterCards();
    });
}

// Filter cards based on search and difficulty
function filterCards() {
    const cards = document.querySelectorAll('.problem-card');

    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
        const difficulty = card.querySelector('.difficulty').textContent;

        const matchesSearch = !currentFilter.search ||
            title.includes(currentFilter.search) ||
            tags.some(tag => tag.includes(currentFilter.search));

        const matchesDifficulty = !currentFilter.difficulty ||
            difficulty === currentFilter.difficulty;

        card.style.display = (matchesSearch && matchesDifficulty) ? 'block' : 'none';
    });
}

// Setup dark mode toggle
function setupDarkMode() {
    const toggle = document.getElementById('dark-mode-toggle');

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light');
    }

    // Toggle event
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('light');
        const currentTheme = document.body.classList.contains('light') ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
    });
}

// Placeholder for problem page (to be implemented in Phase 5)
function initProblemPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const problemName = urlParams.get('name');

    if (!problemName) {
        document.getElementById('markdown-content').innerHTML = '<p>Problem not found. Please provide a valid problem name.</p>';
        return;
    }

    loadProblem(problemName);
    setupBackButton();
    setupCopyButton();
}

// Load and render problem content
async function loadProblem(name) {
    try {
        // Fetch markdown content
        const mdResponse = await fetch(`/content/${name}.md`);
        if (!mdResponse.ok) {
            throw new Error(`Failed to fetch markdown: ${mdResponse.status}`);
        }
        const mdText = await mdResponse.text();

        // Parse frontmatter
        const frontmatter = parseFrontmatter(mdText);

        // Update page elements
        document.getElementById('problem-title').textContent = frontmatter.title || 'Untitled Problem';
        const difficultyEl = document.getElementById('difficulty');
        difficultyEl.textContent = frontmatter.difficulty || '';
        difficultyEl.className = `difficulty ${frontmatter.difficulty || ''}`;

        const tagsContainer = document.getElementById('tags');
        tagsContainer.innerHTML = (frontmatter.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('');

        // Extract and render markdown content (after frontmatter)
        const contentStartIndex = mdText.indexOf('---', mdText.indexOf('---') + 1) + 3;
        const markdownContent = mdText.substring(contentStartIndex).trim();
        document.getElementById('markdown-content').innerHTML = marked.parse(markdownContent);

        // Fetch and render Go code
        const codeResponse = await fetch(`solutions/${name}.go`);
        if (!codeResponse.ok) {
            throw new Error(`Failed to fetch code: ${codeResponse.status}`);
        }
        const codeText = await codeResponse.text();

        const codeBlock = document.getElementById('code-block');
        codeBlock.textContent = codeText;
        codeBlock.className = 'language-go';

        // Highlight code with Prism
        Prism.highlightElement(codeBlock);

    } catch (error) {
        console.error('Error loading problem:', error);
        document.getElementById('markdown-content').innerHTML = '<p>Sorry, there was an error loading the problem content.</p>';
        document.getElementById('code-block').textContent = '// Error loading code';
    }
}

// Setup back button
function setupBackButton() {
    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', () => {
        window.history.back();
    });
}

// Setup copy to clipboard button
function setupCopyButton() {
    const copyButton = document.getElementById('copy-button');
    copyButton.addEventListener('click', async () => {
        const codeBlock = document.getElementById('code-block');
        const code = codeBlock.textContent;

        try {
            await navigator.clipboard.writeText(code);
            // Provide user feedback
            const originalText = copyButton.textContent;
            copyButton.textContent = 'Copied!';
            copyButton.disabled = true;
            setTimeout(() => {
                copyButton.textContent = originalText;
                copyButton.disabled = false;
            }, 2000);
        } catch (error) {
            console.error('Failed to copy code:', error);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = code;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            copyButton.textContent = 'Copied!';
            setTimeout(() => copyButton.textContent = 'Copy Code', 2000);
        }
    });
}