class AIToolsSuite {
    constructor() {
        this.tools = [];
        this.isLoading = false;
    }

    async init() {
        try {
            await this.loadTools();
            this.setupEventListeners();
            this.renderTools();
        } catch (error) {
            console.error('初始化失败:', error);
            this.showError('加载工具失败，请刷新页面重试');
        }
    }

    async loadTools() {
        try {
            const response = await fetch('assets/data/tools.json');
            if (!response.ok) throw new Error('工具数据加载失败');
            const data = await response.json();
            this.tools = data.tools;
        } catch (error) {
            throw new Error('加载工具数据时出错: ' + error.message);
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.tool-card') || e.target.closest('.tool-card')) {
                const card = e.target.closest('.tool-card');
                const toolId = card.dataset.toolId;
                this.handleToolClick(toolId);
            }
        });

        window.addEventListener('load', () => {
            this.hideLoading();
        });
    }

    renderTools() {
        const container = document.querySelector('.tools-grid');
        if (!container) return;

        container.innerHTML = this.tools.map(tool => this.createToolCard(tool)).join('');
    }

    createToolCard(tool) {
        return `
            <div class="tool-card" data-tool-id="${tool.id}">
                <img src="${tool.icon}" alt="${tool.name}" class="tool-icon">
                <h3>${tool.name}</h3>
                <p>${tool.description}</p>
                <button class="btn" onclick="handleToolClick('${tool.id}')">
                    Try Now
                </button>
            </div>
        `;
    }

    async handleToolClick(toolId) {
        this.showLoading();
        try {
            const tool = this.tools.find(t => t.id === toolId);
            if (!tool) throw new Error('工具不存在');
            
            window.location.href = `/tools/${toolId}`;
        } catch (error) {
            this.showError('启动工具失败，请稍后重试');
        }
    }

    showLoading() {
        this.isLoading = true;
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        document.body.appendChild(spinner);
    }

    hideLoading() {
        this.isLoading = false;
        const spinner = document.querySelector('.loading-spinner');
        if (spinner) spinner.remove();
    }

    showError(message) {
        alert(message);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    const app = new AIToolsSuite();
    app.init();
});
