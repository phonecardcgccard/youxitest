const AITools = {
    init() {
        this.setupEventListeners();
        this.loadTools();
    },

    setupEventListeners() {
        document.querySelectorAll('.tool-card').forEach(card => {
            card.addEventListener('click', () => this.handleToolClick(card));
        });
    },

    async loadTools() {
        try {
            const response = await fetch('assets/data/tools.json');
            const tools = await response.json();
            this.renderTools(tools);
        } catch (error) {
            console.error('Error loading tools:', error);
        }
    },

    renderTools(tools) {
        const container = document.querySelector('.tool-grid');
        tools.forEach(tool => {
            const card = this.createToolCard(tool);
            container.appendChild(card);
        });
    },

    createToolCard(tool) {
        const card = document.createElement('div');
        card.className = 'tool-card';
        card.innerHTML = `
            <img src="${tool.icon}" alt="${tool.name}" class="tool-icon">
            <h3>${tool.name}</h3>
            <p>${tool.description}</p>
            <button class="try-button" data-tool="${tool.id}">Try Now</button>
        `;
        return card;
    },

    handleToolClick(card) {
        const toolId = card.querySelector('.try-button').dataset.tool;
        window.location.href = `/tools/${toolId}`;
    }
};

document.addEventListener('DOMContentLoaded', () => AITools.init());
