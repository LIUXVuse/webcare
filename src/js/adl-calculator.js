/**
 * 日常生活功能量表 (ADL) 計算器
 * 
 * 此檔案實現 ADL 量表計算器的功能，包括：
 * 1. 動態加載ADL量表數據
 * 2. 表單驗證
 * 3. 分數計算
 * 4. 結果顯示與解釋
 * 5. 列印功能
 */

// ADL量表數據
let adlData = null;

/**
 * 初始化 ADL 計算器
 */
async function initializeADLCalculator() {
    console.log('ADL 計算器初始化');
    
    // 嘗試載入ADL量表數據
    try {
        await loadADLData();
    } catch (error) {
        console.error('無法載入ADL量表數據:', error);
        // 使用預設數據
        useDefaultADLData();
    }
    
    // 設置今日日期為預設值
    setTodayAsDefault('adl-date');
    
    // 添加計算按鈕的事件監聽器
    const calculateButton = document.getElementById('calculate-adl');
    calculateButton.addEventListener('click', calculateADL);
    
    // 添加重置按鈕的事件監聽器
    const resetButton = document.querySelector('#adl-form button[type="reset"]');
    resetButton.addEventListener('click', () => {
        hideResult('adl-result');
        setTodayAsDefault('adl-date');
    });
    
    // 添加列印按鈕的事件監聽器
    const printButton = document.getElementById('print-adl');
    printButton.addEventListener('click', printADLResult);
}

/**
 * 嘗試載入ADL量表數據
 */
async function loadADLData() {
    try {
        const response = await fetch('/public/data/日常生活活動功能量表(ADL).json');
        if (!response.ok) {
            throw new Error(`HTTP錯誤：${response.status}`);
        }
        adlData = await response.json();
        console.log('成功載入ADL量表數據:', adlData);
    } catch (error) {
        console.warn('載入ADL數據時出錯，將使用預設數據:', error);
        useDefaultADLData();
    }
}

/**
 * 使用預設的ADL量表數據
 */
function useDefaultADLData() {
    adlData = {
        title: "日常生活功能量表(ADL)",
        description: "評估個案在日常生活活動中的自理能力",
        items: [
            {
                id: 1,
                name: "進食",
                maxScore: 10,
                options: [
                    { score: 0, description: "需要他人餵食" },
                    { score: 5, description: "需要協助切食物、塗奶油等" },
                    { score: 10, description: "可自行進食" }
                ]
            },
            {
                id: 2,
                name: "移位",
                maxScore: 15,
                options: [
                    { score: 0, description: "完全無法自行移位" },
                    { score: 5, description: "需要極大協助（一或二人協助）" },
                    { score: 10, description: "需要輕度協助" },
                    { score: 15, description: "可自行移位" }
                ]
            },
            {
                id: 3,
                name: "個人衛生",
                maxScore: 5,
                options: [
                    { score: 0, description: "需要協助" },
                    { score: 5, description: "可自行完成" }
                ]
            },
            {
                id: 4,
                name: "如廁",
                maxScore: 10,
                options: [
                    { score: 0, description: "完全依賴他人" },
                    { score: 5, description: "需要部分協助" },
                    { score: 10, description: "可自行如廁" }
                ]
            },
            {
                id: 5,
                name: "洗澡",
                maxScore: 5,
                options: [
                    { score: 0, description: "需要協助" },
                    { score: 5, description: "可自行完成" }
                ]
            },
            {
                id: 6,
                name: "平地行走",
                maxScore: 15,
                options: [
                    { score: 0, description: "無法行走" },
                    { score: 5, description: "需要輪椅、可獨立操作" },
                    { score: 10, description: "需要一人協助" },
                    { score: 15, description: "可獨立行走" }
                ]
            },
            {
                id: 7,
                name: "上下樓梯",
                maxScore: 10,
                options: [
                    { score: 0, description: "無法上下樓梯" },
                    { score: 5, description: "需要協助" },
                    { score: 10, description: "可獨立完成" }
                ]
            },
            {
                id: 8,
                name: "穿脫衣物",
                maxScore: 10,
                options: [
                    { score: 0, description: "需要完全協助" },
                    { score: 5, description: "需要部分協助" },
                    { score: 10, description: "可獨立完成" }
                ]
            },
            {
                id: 9,
                name: "大便控制",
                maxScore: 10,
                options: [
                    { score: 0, description: "完全失禁" },
                    { score: 5, description: "偶爾失禁" },
                    { score: 10, description: "可自行控制" }
                ]
            },
            {
                id: 10,
                name: "小便控制",
                maxScore: 10,
                options: [
                    { score: 0, description: "完全失禁或留置導尿管" },
                    { score: 5, description: "偶爾失禁" },
                    { score: 10, description: "可自行控制" }
                ]
            }
        ],
        scoringGuide: {
            levels: [
                { minScore: 0, maxScore: 20, level: "完全依賴" },
                { minScore: 21, maxScore: 40, level: "重度依賴" },
                { minScore: 41, maxScore: 60, level: "中度依賴" },
                { minScore: 61, maxScore: 80, level: "輕度依賴" },
                { minScore: 81, maxScore: 100, level: "獨立" }
            ]
        }
    };
    
    console.log('使用預設ADL數據:', adlData);
}

/**
 * 計算 ADL 分數並顯示結果
 */
function calculateADL() {
    const form = document.getElementById('adl-form');
    
    // 檢查是否已加載數據
    if (!adlData) {
        showWarning('無法加載評估數據，請刷新頁面再試');
        return;
    }
    
    // 獲取所有評估項目的字段名
    const requiredFields = ['name', 'date'];
    adlData.items.forEach(item => {
        requiredFields.push(item.name.toLowerCase().replace(/\s+/g, '_'));
    });
    
    // 驗證表單
    if (!validateForm(form, requiredFields)) {
        showWarning('請完成所有評估項目');
        return;
    }
    
    // 獲取姓名和日期
    const name = document.getElementById('adl-name').value;
    const date = document.getElementById('adl-date').value;
    
    // 計算總分
    let totalScore = 0;
    adlData.items.forEach(item => {
        const fieldName = item.name.toLowerCase().replace(/\s+/g, '_');
        const score = parseInt(getSelectedValue(form, fieldName), 10);
        totalScore += score;
    });
    
    // 確定依賴程度與結果說明
    const { level, description } = interpretADLScore(totalScore);
    
    // 更新結果區域
    document.getElementById('result-name').textContent = name;
    document.getElementById('result-date').textContent = formatDateForDisplay(date);
    document.getElementById('result-score').textContent = totalScore;
    document.getElementById('result-level').textContent = level;
    document.getElementById('result-description').textContent = description;
    
    // 顯示結果
    showResult('adl-result');
}

/**
 * 獲取被選中的單選按鈕的值
 * @param {HTMLFormElement} form - 表單元素
 * @param {string} name - 單選按鈕組的名稱
 * @returns {string} 被選中的值
 */
function getSelectedValue(form, name) {
    const radioButtons = form.elements[name];
    if (!radioButtons) return "0";
    
    if (radioButtons instanceof RadioNodeList) {
        for (const radioButton of radioButtons) {
            if (radioButton.checked) {
                return radioButton.value;
            }
        }
    } else if (radioButtons.checked) {
        return radioButtons.value;
    }
    
    return "0";
}

/**
 * 根據 ADL 總分解釋依賴程度與描述
 * @param {number} score - ADL 總分
 * @returns {Object} 包含依賴程度與描述的物件
 */
function interpretADLScore(score) {
    // 使用從數據文件加載的評分標準
    if (adlData && adlData.scoringGuide && adlData.scoringGuide.levels) {
        for (const level of adlData.scoringGuide.levels) {
            if (score >= level.minScore && score <= level.maxScore) {
                let description = "";
                
                // 根據不同依賴程度給出描述
                if (level.level.includes("完全依賴")) {
                    description = "無法獨立完成日常生活活動，需要全面照護。";
                } else if (level.level.includes("重度依賴")) {
                    description = "大部分日常生活活動需要協助，自理能力有限。";
                } else if (level.level.includes("中度依賴")) {
                    description = "部分日常生活活動需要協助，但仍保有一定的自理能力。";
                } else if (level.level.includes("輕度依賴")) {
                    description = "大部分日常生活活動可獨立完成，僅需少量協助。";
                } else if (level.level.includes("獨立") || level.level.includes("完全獨立")) {
                    description = "可獨立完成所有日常生活活動，不需任何協助。";
                }
                
                return { level: level.level, description };
            }
        }
    }
    
    // 如果沒有找到匹配的評分級別或數據未加載，使用默認邏輯
    let level, description;
    
    if (score >= 100) {
        level = "完全獨立";
        description = "可獨立完成所有日常生活活動，不需任何協助。";
    } else if (score >= 75) {
        level = "輕度依賴";
        description = "大部分日常生活活動可獨立完成，僅需少量協助。";
    } else if (score >= 50) {
        level = "中度依賴";
        description = "部分日常生活活動需要協助，但仍保有一定的自理能力。";
    } else if (score >= 25) {
        level = "重度依賴";
        description = "大部分日常生活活動需要協助，自理能力有限。";
    } else {
        level = "完全依賴";
        description = "無法獨立完成日常生活活動，需要全面照護。";
    }
    
    return { level, description };
}

/**
 * 將 YYYY-MM-DD 格式的日期轉換為更易讀的格式
 * @param {string} dateString - YYYY-MM-DD 格式的日期字符串
 * @returns {string} 格式化後的日期
 */
function formatDateForDisplay(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    return `${year}年${month}月${day}日`;
}

/**
 * 列印 ADL 評估結果
 */
function printADLResult() {
    // 檢查結果區域是否為顯示狀態
    if (document.getElementById('adl-result').style.display === 'none') {
        showWarning('請先計算評估結果再進行列印');
        return;
    }
    
    // 呼叫瀏覽器的列印功能
    window.print();
} 