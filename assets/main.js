class AIToolsSuite {
    constructor() {
        this.tools = [];
        this.isLoading = false;
        this.init();
    }

    async init() {
        try {
            await this.loadTools();
            this.setupEventListeners();
        } catch (error) {
            console.error('初始化失败:', error);
            this.showError('加载工具失败，请刷新页面重试');
        }
    }

    async loadTools() {
        try {
            const response = await fetch('/assets/data/tools.json');
            if (!response.ok) {
                throw new Error('工具数据加载失败');
            }
            const data = await response.json();
            this.tools = data.tools;
            return this.tools;
        } catch (error) {
            console.error('加载工具数据时出错:', error);
            return [];
        }
    }

    setupEventListeners() {
        // 工具卡片点击事件
        document.querySelectorAll('.tool-card').forEach(card => {
            const tryButton = card.querySelector('.btn[onclick^="handleToolClick"]');
            const demoButton = card.querySelector('.btn[onclick^="showDemo"]');
            
            if (tryButton) {
                const toolId = tryButton.getAttribute('onclick').match(/'([^']+)'/)[1];
                tryButton.onclick = (e) => {
                    e.preventDefault();
                    this.handleToolClick(toolId);
                };
            }
            
            if (demoButton) {
                const toolId = demoButton.getAttribute('onclick').match(/'([^']+)'/)[1];
                demoButton.onclick = (e) => {
                    e.preventDefault();
                    this.showDemo(toolId);
                };
            }
        });

        // 获取开始按钮
        const getStartedBtn = document.querySelector('.btn[onclick="getStarted()"]');
        if (getStartedBtn) {
            getStartedBtn.onclick = (e) => {
                e.preventDefault();
                this.getStarted();
            };
        }

        // 平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    async handleToolClick(toolId) {
        this.showLoading();
        try {
            const tool = this.tools.find(t => t.id === toolId);
            if (!tool) throw new Error('工具不存在');
            
            // 模拟加载延迟
            await new Promise(resolve => setTimeout(resolve, 1000));
            window.location.href = `/tools/${toolId}.html`;
        } catch (error) {
            this.showError('启动工具失败，请稍后重试');
        } finally {
            this.hideLoading();
        }
    }

    async showDemo(toolId) {
        this.showLoading();
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            window.location.href = `/demos/${toolId}.html`;
        } catch (error) {
            this.showError('加载演示失败，请稍后重试');
        } finally {
            this.hideLoading();
        }
    }

    getStarted() {
        this.showLoading();
        setTimeout(() => {
            window.location.href = '/register.html';
            this.hideLoading();
        }, 1000);
    }

    showLoading() {
        const loading = document.querySelector('.loading');
        if (loading) {
            loading.style.display = 'flex';
        }
    }

    hideLoading() {
        const loading = document.querySelector('.loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    showError(message) {
        alert(message);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.aiSuite = new AIToolsSuite();
});
