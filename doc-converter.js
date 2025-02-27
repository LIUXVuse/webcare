/**
 * doc-converter.js
 * 將Word文檔轉換為JSON和Markdown格式的工具
 * 用於將長照量表Word文檔轉換為可在網頁應用中使用的格式
 */

const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

// 配置選項
const CONFIG = {
    inputDir: './doc-sources',         // 輸入目錄
    outputDir: './data',               // 輸出目錄
    mdOutputDir: './docs/scales',      // Markdown輸出目錄
    defaultInputFile: 'adl.docx',      // 默認輸入文件
    defaultOutputFormat: 'json'        // 默認輸出格式 (json 或 md)
};

/**
 * 記錄信息到控制台
 * @param {string} message - 要記錄的信息
 * @param {string} type - 信息類型 (info, success, error, warning)
 */
function log(message, type = 'info') {
    const now = new Date().toLocaleTimeString();
    
    switch (type) {
        case 'success':
            console.log(`[${now}] ✓ ${message}`);
            break;
        case 'error':
            console.error(`[${now}] ✗ ${message}`);
            break;
        case 'warning':
            console.warn(`[${now}] ⚠ ${message}`);
            break;
        default:
            console.log(`[${now}] ℹ ${message}`);
    }
}

// 確保輸出目錄存在
function ensureDirectoryExists(directory) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
        log(`創建目錄: ${directory}`, 'success');
    }
}

/**
 * 將HTML轉換為結構化數據
 * @param {string} html - 從Word文檔提取的HTML
 * @returns {Object} - 結構化的量表數據
 */
function parseHtmlToStructuredData(html) {
    // 基本信息提取正則表達式
    const titleRegex = /<h1[^>]*>(.*?)<\/h1>/i;
    const titleMatch = html.match(titleRegex);
    const title = titleMatch ? titleMatch[1].trim() : '未命名量表';

    // 提取項目
    const items = [];
    const itemRegex = /<h2[^>]*>(.*?)<\/h2>([\s\S]*?)(?=<h2|$)/gi;
    let itemMatch;
    
    while ((itemMatch = itemRegex.exec(html)) !== null) {
        const itemTitle = itemMatch[1].trim();
        const itemContent = itemMatch[2].trim();
        
        // 提取選項
        const options = [];
        const optionRegex = /<p[^>]*>(.*?)<\/p>/gi;
        let optionMatch;
        
        while ((optionMatch = optionRegex.exec(itemContent)) !== null) {
            const optionText = optionMatch[1].trim();
            
            // 檢查是否包含分數
            const scoreRegex = /(\d+)分/;
            const scoreMatch = optionText.match(scoreRegex);
            const score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;
            
            if (optionText && !optionText.includes('請選擇') && !optionText.includes('評估項目')) {
                options.push({
                    text: optionText.replace(/\(\d+分\)/, '').trim(),
                    score: score
                });
            }
        }
        
        if (itemTitle && options.length > 0) {
            items.push({
                title: itemTitle,
                options: options
            });
        }
    }

    // 提取說明 (通常在p標籤中，但不在h2下)
    const descriptionRegex = /<p[^>]*>((?!<h2).*?)<\/p>/i;
    const descriptionMatch = html.match(descriptionRegex);
    const description = descriptionMatch ? descriptionMatch[1].trim() : '';

    return {
        title,
        description,
        items,
        totalItems: items.length,
        maxScore: items.reduce((sum, item) => {
            const maxOptionScore = Math.max(...item.options.map(option => option.score || 0));
            return sum + maxOptionScore;
        }, 0)
    };
}

/**
 * 將結構化數據轉換為Markdown
 * @param {Object} data - 結構化的量表數據
 * @returns {string} - Markdown格式的文本
 */
function convertToMarkdown(data) {
    let markdown = `# ${data.title}\n\n`;
    
    if (data.description) {
        markdown += `${data.description}\n\n`;
    }
    
    markdown += `## 量表說明\n\n`;
    markdown += `- 總項目數: ${data.totalItems} 項\n`;
    markdown += `- 最高分數: ${data.maxScore} 分\n\n`;
    
    markdown += `## 評估項目\n\n`;
    
    data.items.forEach((item, index) => {
        markdown += `### ${index + 1}. ${item.title}\n\n`;
        
        item.options.forEach(option => {
            markdown += `- ${option.text} (${option.score}分)\n`;
        });
        
        markdown += '\n';
    });
    
    return markdown;
}

/**
 * 從文件讀取HTML內容
 * @param {string} filePath - HTML文件路徑
 * @returns {Promise<string>} - HTML內容
 */
async function readHtmlFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
}

/**
 * 將Word文檔轉換為HTML
 * @param {string} filePath - Word文檔路徑
 * @returns {Promise<string>} - HTML內容
 */
async function convertDocToHtml(filePath) {
    const result = await mammoth.convertToHtml({ path: filePath });
    return result.value;
}

/**
 * 將文檔轉換為結構化數據並保存
 * @param {string} inputFile - 輸入文件路徑
 * @param {string} outputFormat - 輸出格式 (json 或 md)
 */
async function convertDocument(inputFile, outputFormat = CONFIG.defaultOutputFormat) {
    try {
        const inputPath = path.resolve(inputFile);
        const fileName = path.basename(inputFile, path.extname(inputFile));
        
        log(`處理文件: ${inputPath}`);
        
        // 根據文件類型選擇不同的處理方法
        let html;
        const fileExt = path.extname(inputFile).toLowerCase();
        
        if (fileExt === '.html' || fileExt === '.htm') {
            html = await readHtmlFile(inputPath);
            log('讀取HTML文件成功', 'success');
        } else if (fileExt === '.docx' || fileExt === '.doc') {
            html = await convertDocToHtml(inputPath);
            log('Word文檔轉換為HTML成功', 'success');
        } else {
            throw new Error(`不支援的文件類型: ${fileExt}，僅支持 .docx, .doc, .html, .htm`);
        }
        
        // 解析HTML為結構化數據
        const structuredData = parseHtmlToStructuredData(html);
        log(`成功解析: ${structuredData.title}, 共${structuredData.items.length}個項目`, 'success');
        
        // 確保輸出目錄存在
        ensureDirectoryExists(CONFIG.outputDir);
        
        // 保存為JSON
        const jsonOutputPath = path.join(CONFIG.outputDir, `${fileName}.json`);
        fs.writeFileSync(jsonOutputPath, JSON.stringify(structuredData, null, 2), 'utf8');
        log(`保存JSON到: ${jsonOutputPath}`, 'success');
        
        // 如果需要，也保存為Markdown
        if (outputFormat === 'md' || outputFormat === 'both') {
            ensureDirectoryExists(CONFIG.mdOutputDir);
            const markdownContent = convertToMarkdown(structuredData);
            const mdOutputPath = path.join(CONFIG.mdOutputDir, `${fileName}.md`);
            fs.writeFileSync(mdOutputPath, markdownContent, 'utf8');
            log(`保存Markdown到: ${mdOutputPath}`, 'success');
        }
        
        log(`轉換完成! 可在以下位置找到轉換後的文件：`, 'success');
        log(`- JSON: ${path.resolve(jsonOutputPath)}`);
        if (outputFormat === 'md' || outputFormat === 'both') {
            log(`- Markdown: ${path.resolve(CONFIG.mdOutputDir, `${fileName}.md`)}`);
        }
        
        return structuredData;
    } catch (error) {
        log(`轉換過程中發生錯誤: ${error.message}`, 'error');
        if (error.stack) {
            log(error.stack, 'error');
        }
        return null;
    }
}

/**
 * 主函數 - 處理命令行參數並執行轉換
 */
async function main() {
    // 獲取命令行參數
    const args = process.argv.slice(2);
    let inputFile = path.join(CONFIG.inputDir, CONFIG.defaultInputFile);
    let outputFormat = CONFIG.defaultOutputFormat;
    
    // 解析命令行參數
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--input' || args[i] === '-i') {
            inputFile = args[++i];
        } else if (args[i] === '--format' || args[i] === '-f') {
            outputFormat = args[++i];
        } else if (args[i] === '--help' || args[i] === '-h') {
            showHelp();
            return;
        }
    }
    
    log('文檔轉換工具 v1.0.0');
    log(`輸入文件: ${inputFile}`);
    log(`輸出格式: ${outputFormat}`);
    
    // 檢查輸入文件是否存在
    if (!fs.existsSync(inputFile)) {
        log(`錯誤: 找不到輸入文件 "${inputFile}"`, 'error');
        log(`請確保文件存在，或使用 --input 參數指定正確的文件路徑`, 'warning');
        log(`如需幫助，請使用 --help 參數`, 'info');
        return;
    }
    
    // 執行轉換
    await convertDocument(inputFile, outputFormat);
}

/**
 * 顯示幫助信息
 */
function showHelp() {
    console.log(`
文檔轉換工具 - 幫助信息

將Word文檔或HTML文件轉換為結構化的JSON或Markdown格式，用於長照量表網頁應用。

用法:
  node doc-converter.js [選項]

選項:
  --input, -i <file>    指定輸入文檔路徑 (默認: ${CONFIG.inputDir}/${CONFIG.defaultInputFile})
  --format, -f <format> 指定輸出格式: json, md, both (默認: ${CONFIG.defaultOutputFormat})
  --help, -h            顯示此幫助信息

支持的文件類型:
  .docx, .doc          Word文檔
  .html, .htm          HTML文件

示例:
  轉換默認文檔:
    node doc-converter.js
  
  轉換指定文檔:
    node doc-converter.js --input ./my-scale.docx
  
  轉換HTML文件:
    node doc-converter.js --input ./doc-sources/adl-sample.html
  
  轉換為Markdown格式:
    node doc-converter.js --format md
  
  轉換為兩種格式:
    node doc-converter.js --input ./doc-sources/iadl.docx --format both
    `);
}

// 執行主函數
main().catch(error => log(`程序執行出錯: ${error.message}`, 'error')); 