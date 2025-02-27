/**
 * 台灣長照居家服務量表計算器
 * 主要JavaScript文件，負責加載量表數據和處理用戶互動
 */

// 定義全局變量來保存各量表數據
const scaleData = {
    adl: null,
    iadl: null, 
    mna: null,
    fallRisk: null
};

// 頁面加載完成後初始化應用
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    bindEventHandlers();
});

/**
 * 初始化應用
 */
async function initApp() {
    try {
        // 顯示加載中訊息
        showLoadingMessage('正在加載量表數據...');
        
        // 載入ADL量表數據（其他量表暫未實現）
        await loadScaleData('adl');
        
        // 初始化界面
        initializeScaleUI('adl');
        
        // 隱藏加載訊息
        hideLoadingMessage();
    } catch (error) {
        console.error('初始化應用失敗:', error);
        hideLoadingMessage();
        showErrorMessage('加載量表數據失敗，請刷新頁面重試。');
    }
}

/**
 * 加載指定量表的數據
 * @param {string} scaleName - 量表名稱 (adl, iadl, mna, fallRisk)
 * @returns {Promise} - 加載完成的Promise
 */
async function loadScaleData(scaleName) {
    try {
        // 嘗試從JSON文件加載數據
        const response = await fetch(`data/${scaleName}-sample.json`);
        
        if (!response.ok) {
            throw new Error(`無法加載${scaleName}量表數據 (${response.status})`);
        }
        
        const data = await response.json();
        scaleData[scaleName] = data;
        
        console.log(`${scaleName}量表數據加載成功:`, data);
        return data;
    } catch (error) {
        console.error(`加載${scaleName}量表數據失敗:`, error);
        throw error;
    }
}

/**
 * 初始化量表界面
 * @param {string} scaleName - 量表名稱
 */
function initializeScaleUI(scaleName) {
    const data = scaleData[scaleName];
    
    if (!data) {
        console.error(`${scaleName}量表數據不存在`);
        return;
    }
    
    // 設置量表標題和描述
    document.getElementById('scale-title').textContent = data.title || `${scaleName.toUpperCase()}量表`;
    
    const descriptionElement = document.getElementById('scale-description');
    if (descriptionElement && data.description) {
        descriptionElement.textContent = data.description;
    }
    
    // 獲取量表容器
    const scaleContainer = document.getElementById('scale-container');
    scaleContainer.innerHTML = ''; // 清空容器
    
    // 創建表單
    const form = document.createElement('form');
    form.id = `${scaleName}-form`;
    form.className = 'scale-form';
    
    // 創建量表項目
    data.items.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'card mb-3 scale-item';
        
        // 項目標題
        const itemHeader = document.createElement('div');
        itemHeader.className = 'card-header bg-primary bg-opacity-75 text-white';
        itemHeader.innerHTML = `<h5 class="mb-0">${index + 1}. ${item.title}</h5>`;
        itemDiv.appendChild(itemHeader);
        
        // 項目選項
        const itemBody = document.createElement('div');
        itemBody.className = 'card-body';
        
        // 創建選項
        item.options.forEach((option, optIndex) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'form-check mb-2';
            
            const input = document.createElement('input');
            input.type = 'radio';
            input.className = 'form-check-input';
            input.name = `item_${index}`;
            input.id = `item_${index}_opt_${optIndex}`;
            input.value = option.score;
            
            const label = document.createElement('label');
            label.className = 'form-check-label';
            label.htmlFor = `item_${index}_opt_${optIndex}`;
            label.textContent = `${option.text} (${option.score}分)`;
            
            optionDiv.appendChild(input);
            optionDiv.appendChild(label);
            itemBody.appendChild(optionDiv);
        });
        
        itemDiv.appendChild(itemBody);
        form.appendChild(itemDiv);
    });
    
    // 添加按鈕
    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'd-flex justify-content-between mb-4';
    
    const calculateBtn = document.createElement('button');
    calculateBtn.type = 'button';
    calculateBtn.className = 'btn btn-primary';
    calculateBtn.id = 'calculate-btn';
    calculateBtn.innerHTML = '<i class="fas fa-calculator me-2"></i>計算得分';
    
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'btn btn-secondary';
    resetBtn.id = 'reset-btn';
    resetBtn.innerHTML = '<i class="fas fa-undo me-2"></i>重新填寫';
    
    buttonDiv.appendChild(calculateBtn);
    buttonDiv.appendChild(resetBtn);
    form.appendChild(buttonDiv);
    
    // 添加結果區域
    const resultDiv = document.createElement('div');
    resultDiv.id = 'result-container';
    resultDiv.className = 'card mb-4 d-none';
    
    const resultHeader = document.createElement('div');
    resultHeader.className = 'card-header bg-success text-white';
    resultHeader.innerHTML = '<h5 class="mb-0"><i class="fas fa-clipboard-check me-2"></i>評估結果</h5>';
    
    const resultBody = document.createElement('div');
    resultBody.className = 'card-body';
    resultBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h5>基本信息</h5>
                <p><strong>評估日期：</strong><span id="result-date"></span></p>
                <p><strong>總分：</strong><span id="result-score"></span>/<span id="result-max-score"></span></p>
                <p><strong>依賴程度：</strong><span id="result-level" class="fw-bold"></span></p>
            </div>
            <div class="col-md-6">
                <h5>評估說明</h5>
                <p id="result-description"></p>
            </div>
        </div>
        <div class="text-end mt-3">
            <button type="button" class="btn btn-info" id="print-btn">
                <i class="fas fa-print me-2"></i>列印結果
            </button>
        </div>
    `;
    
    resultDiv.appendChild(resultHeader);
    resultDiv.appendChild(resultBody);
    
    // 將表單和結果區域添加到容器
    scaleContainer.appendChild(form);
    scaleContainer.appendChild(resultDiv);
}

/**
 * 綁定事件處理函數
 */
function bindEventHandlers() {
    // 綁定量表選擇器的點擊事件
    document.querySelectorAll('.scale-selector').forEach(selector => {
        selector.addEventListener('click', async function(event) {
            event.preventDefault();
            
            // 移除所有選擇器的活動狀態
            document.querySelectorAll('.scale-selector').forEach(s => {
                s.classList.remove('active');
            });
            
            // 添加當前選擇器的活動狀態
            this.classList.add('active');
            
            // 獲取選擇的量表名稱
            const scaleName = this.getAttribute('data-scale');
            
            // 如果量表數據尚未加載，則進行加載
            if (!scaleData[scaleName]) {
                try {
                    showLoadingMessage(`正在加載${scaleName}量表數據...`);
                    await loadScaleData(scaleName);
                    hideLoadingMessage();
                } catch (error) {
                    hideLoadingMessage();
                    showErrorMessage(`加載${scaleName}量表數據失敗，此量表可能尚未實現。`);
                    return;
                }
            }
            
            // 初始化量表界面
            initializeScaleUI(scaleName);
        });
    });
    
    // 使用事件委託綁定動態創建的按鈕事件
    document.addEventListener('click', function(event) {
        // 計算按鈕
        if (event.target.id === 'calculate-btn' || event.target.closest('#calculate-btn')) {
            calculateScore();
        }
        
        // 重置按鈕
        if (event.target.id === 'reset-btn' || event.target.closest('#reset-btn')) {
            resetForm();
        }
        
        // 列印按鈕
        if (event.target.id === 'print-btn' || event.target.closest('#print-btn')) {
            printResult();
        }
    });
}

/**
 * 計算量表得分
 */
function calculateScore() {
    // 獲取當前活動的量表
    const activeScaleSelector = document.querySelector('.scale-selector.active');
    if (!activeScaleSelector) {
        showErrorMessage('無法確定當前量表');
        return;
    }
    
    const scaleName = activeScaleSelector.getAttribute('data-scale');
    const form = document.getElementById(`${scaleName}-form`);
    
    if (!form) {
        showErrorMessage('找不到量表表單');
        return;
    }
    
    // 添加按鈕加載動畫
    const calculateBtn = document.getElementById('calculate-btn');
    calculateBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>計算中...';
    calculateBtn.disabled = true;
    
    // 檢查是否所有項目都已選擇
    const itemCount = scaleData[scaleName].items.length;
    let missingItems = [];
    
    for (let i = 0; i < itemCount; i++) {
        const radioButtons = form.querySelectorAll(`input[name="item_${i}"]`);
        let itemSelected = false;
        
        radioButtons.forEach(radio => {
            if (radio.checked) {
                itemSelected = true;
            }
        });
        
        if (!itemSelected) {
            missingItems.push(i + 1);
        }
    }
    
    if (missingItems.length > 0) {
        showErrorMessage(`請完成所有評估項目，尚未選擇的項目：${missingItems.join(', ')}`);
        // 恢復按鈕狀態
        calculateBtn.innerHTML = '<i class="fas fa-calculator me-2"></i>計算得分';
        calculateBtn.disabled = false;
        return;
    }
    
    // 模擬短暫延遲以增強用戶體驗
    setTimeout(() => {
        // 計算總分
        let totalScore = 0;
        for (let i = 0; i < itemCount; i++) {
            const selectedOption = form.querySelector(`input[name="item_${i}"]:checked`);
            if (selectedOption) {
                totalScore += parseInt(selectedOption.value, 10);
            }
        }
        
        // 顯示結果
        const resultContainer = document.getElementById('result-container');
        resultContainer.style.opacity = '0';
        resultContainer.classList.remove('d-none');
        
        // 填充結果
        document.getElementById('result-date').textContent = new Date().toLocaleDateString('zh-TW');
        document.getElementById('result-score').textContent = totalScore;
        document.getElementById('result-max-score').textContent = scaleData[scaleName].maxScore;
        
        // 計算依賴程度
        const dependencyLevel = getDependencyLevel(totalScore);
        document.getElementById('result-level').textContent = dependencyLevel.level;
        document.getElementById('result-description').textContent = dependencyLevel.description;
        
        // 添加結果卡片淡入效果
        setTimeout(() => {
            resultContainer.style.transition = 'opacity 0.5s ease-in-out';
            resultContainer.style.opacity = '1';
            
            // 滾動到結果區域
            resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // 恢復按鈕狀態
            calculateBtn.innerHTML = '<i class="fas fa-calculator me-2"></i>計算得分';
            calculateBtn.disabled = false;
            
            // 提示音效（可選）
            // 如果需要添加提示音，可以取消下面的註釋
            // const audio = new Audio('sounds/complete.mp3');
            // audio.play();
        }, 300);
    }, 500);
}
/**
 * 根據總分判斷依賴程度
 * @param {number} totalScore - 總分
 * @returns {Object} - 包含依賴程度和說明的對象
 */
function getDependencyLevel(totalScore) {
    if (totalScore <= 20) {
        return { level: "完全依賴", description: "需要完全的日常生活協助", isHighDependency: true };
    } else if (totalScore <= 40) {
        return { level: "嚴重依賴", description: "需要大量的日常生活協助", isHighDependency: true };
    } else if (totalScore <= 60) {
        return { level: "顯著依賴", description: "需要部分的日常生活協助", isHighDependency: true };
    } else {
        return { level: "功能獨立", description: "可自理日常生活", isHighDependency: false };
    }
}

/**
 * 重置表單
 */
function resetForm() {
    const activeScaleSelector = document.querySelector('.scale-selector.active');
    if (!activeScaleSelector) return;
    
    const scaleName = activeScaleSelector.getAttribute('data-scale');
    const form = document.getElementById(`${scaleName}-form`);
    
    if (form) {
        form.reset();
        document.getElementById('result-container').classList.add('d-none');
    }
}

/**
 * 列印結果
 */
function printResult() {
    window.print();
}

/**
 * 顯示加載訊息
 * @param {string} message - 加載訊息
 */
function showLoadingMessage(message) {
    let loadingElement = document.getElementById('loading-message');
    
    if (!loadingElement) {
        loadingElement = document.createElement('div');
        loadingElement.id = 'loading-message';
        loadingElement.className = 'alert alert-info';
        document.getElementById('scale-container').prepend(loadingElement);
    }
    
    loadingElement.innerHTML = `
        <div class="d-flex align-items-center">
            <div class="spinner-border spinner-border-sm me-2" role="status">
                <span class="visually-hidden">加載中...</span>
            </div>
            <div>${message}</div>
        </div>
    `;
    
    loadingElement.style.display = 'block';
}

/**
 * 隱藏加載訊息
 */
function hideLoadingMessage() {
    const loadingElement = document.getElementById('loading-message');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

/**
 * 顯示錯誤訊息
 * @param {string} message - 錯誤訊息
 */
function showErrorMessage(message) {
    let errorElement = document.getElementById('error-message');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = 'error-message';
        errorElement.className = 'alert alert-danger';
        document.getElementById('scale-container').prepend(errorElement);
    }
    
    errorElement.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-exclamation-circle me-2"></i>
            <div>${message}</div>
        </div>
    `;
    
    errorElement.style.display = 'block';
    
    // 5秒後自動隱藏
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
} 