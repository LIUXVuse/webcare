/**
 * 台灣長照居家服務量表計算器 - 主程式
 * 
 * 此檔案負責處理整體應用的邏輯，包括：
 * 1. 量表選擇和切換
 * 2. 初始化各個計算器模組
 * 3. 通用功能和工具函數
 */

// 等待 DOM 載入完成
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

/**
 * 初始化應用程式
 */
function initializeApp() {
    console.log('台灣長照居家服務量表計算器已啟動');
    
    // 初始化量表選擇器
    initializeCalculatorSelector();
    
    // 初始化各個量表計算器
    // 目前僅有 ADL 量表，未來將添加更多
    initializeADLCalculator();
}

/**
 * 初始化量表選擇器功能
 */
function initializeCalculatorSelector() {
    const calculatorButtons = document.querySelectorAll('.calculator-buttons button');
    
    calculatorButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按鈕的 active 狀態
            calculatorButtons.forEach(btn => btn.classList.remove('active'));
            
            // 為當前按鈕添加 active 狀態
            this.classList.add('active');
            
            // 獲取要顯示的計算器 ID
            const calculatorId = this.getAttribute('data-calculator');
            
            // 隱藏所有計算器
            document.querySelectorAll('.calculator').forEach(calc => {
                calc.classList.remove('active');
            });
            
            // 顯示選中的計算器
            document.getElementById(`${calculatorId}-calculator`).classList.add('active');
        });
    });
}

/**
 * 格式化日期為 YYYY-MM-DD 格式
 * @param {Date} date - 日期物件
 * @returns {string} 格式化後的日期字符串
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

/**
 * 設置今天的日期為日期輸入框的預設值
 * @param {string} elementId - 日期輸入框的 ID
 */
function setTodayAsDefault(elementId) {
    const today = new Date();
    const formattedDate = formatDate(today);
    document.getElementById(elementId).value = formattedDate;
}

/**
 * 顯示計算結果區域
 * @param {string} resultId - 結果區域的 ID
 */
function showResult(resultId) {
    const resultElement = document.getElementById(resultId);
    resultElement.style.display = 'block';
    
    // 平滑滾動到結果區域
    resultElement.scrollIntoView({ behavior: 'smooth' });
}

/**
 * 隱藏計算結果區域
 * @param {string} resultId - 結果區域的 ID
 */
function hideResult(resultId) {
    document.getElementById(resultId).style.display = 'none';
}

/**
 * 顯示警告訊息
 * @param {string} message - 警告訊息
 */
function showWarning(message) {
    alert(message);
}

/**
 * 檢查表單是否填寫完整
 * @param {HTMLFormElement} form - 表單元素
 * @param {Array<string>} requiredFields - 必填欄位的名稱陣列
 * @returns {boolean} 表單是否完整
 */
function validateForm(form, requiredFields) {
    for (const field of requiredFields) {
        const elements = form.elements[field];
        
        if (!elements) continue;
        
        // 如果是單選或多選框
        if (elements instanceof RadioNodeList) {
            let checked = false;
            for (const element of elements) {
                if (element.checked) {
                    checked = true;
                    break;
                }
            }
            
            if (!checked) {
                return false;
            }
        } 
        // 如果是普通輸入框
        else if (elements.value.trim() === '') {
            return false;
        }
    }
    
    return true;
} 