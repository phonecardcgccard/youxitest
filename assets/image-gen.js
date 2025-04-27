class ImageGenerator {
    constructor() {
        this.init();
    }

    init() {
        this.generateBtn = document.getElementById('generateBtn');
        this.prompt = document.getElementById('prompt');
        this.style = document.getElementById('style');
        this.size = document.getElementById('size');
        this.result = document.getElementById('result');
        this.loading = document.querySelector('.loading-spinner');

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateImage());
    }

    async generateImage() {
        if (!this.prompt.value.trim()) {
            alert('请输入图片描述');
            return;
        }

        this.showLoading();

        try {
            // 这里是模拟API调用
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // 模拟生成的图片
            const imgUrl = `https://picsum.photos/${this.size.value.split('x')[0]}`;
            
            this.displayResult(imgUrl);
        } catch (error) {
            console.error('生成图片失败:', error);
            alert('生成图片失败，请稍后重试');
        } finally {
            this.hideLoading();
        }
    }

    displayResult(imgUrl) {
        this.result.innerHTML = `
            <img src="${imgUrl}" alt="Generated image">
            <button class="btn" onclick="window.location.href='${imgUrl}'" style="margin-top: 1rem;">
                <i class="fas fa-download"></i> 下载图片
            </button>
        `;
    }

    showLoading() {
        this.loading.style.display = 'block';
        this.generateBtn.disabled = true;
    }

    hideLoading() {
        this.loading.style.display = 'none';
        this.generateBtn.disabled = false;
    }
}

// 初始化图片生成器
document.addEventListener('DOMContentLoaded', () => {
    window.imageGenerator = new ImageGenerator();
});

