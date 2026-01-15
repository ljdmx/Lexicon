
# LEXICON — Architectural Localization Engine

**LEXICON** 是一款专为开发者与本地化专家打造的极致简约型结构化数据翻译工具。它利用 Google Gemini API 的强大性能，在执行多语言翻译的同时，严格确保原始 JSON、XML 或 Markdown 结构的完整性。

![Build Status](https://img.shields.io/badge/Build-055.ARCH-black?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Gemini%20%7C%20Tailwind-white?style=flat-square)

## 核心特性

- **结构完整性 (Structural Integrity)**：采用先进的系统级提示词工程，严格保留所有 JSON 键名、XML 标签及嵌套层级。
- **极致简约 UI (Minimalist Aesthetics)**：遵循建筑极简主义，去除非必要视觉干扰。
- **实时处理 (Real-time Processing)**：基于 Gemini 3 Flash 模型，提供毫秒级响应速度。
- **多语言适配 (Bilingual Interface)**：界面支持中/英文一键切换。
- **智能视图 (Hybrid Rendering)**：交互式 JSON 树形图与 XML 语法感知渲染。

## 技术架构

- **核心引擎**: React 19 (ESM 驱动)
- **AI 智能**: Google GenAI (Gemini 3 Pro/Flash)
- **样式处理**: Tailwind CSS (JIT 引擎)

## 本地部署 (Local Deployment)

### 1. 配置 API Key (关键)

由于安全限制，本地浏览器环境无法直接提供 API Key 选择弹窗。您需要通过以下方式之一配置 API Key：

#### A. 使用环境变量 (推荐)
在启动本地服务器前，在终端设置环境变量：
```bash
# macOS / Linux
export API_KEY=您的_GEMINI_API_KEY
npx serve .

# Windows (PowerShell)
$env:API_KEY="您的_GEMINI_API_KEY"
npx serve .
```

### 2. 运行项目
使用任何静态服务器运行项目根目录：
```bash
npx serve .
# 或
python -m http.server 8000
```

## 使用指南

1. **输入数据**：在左侧“源数据”面板粘贴您的 JSON 或 XML 内容。
2. **选择语言**：点击中间的语言选择器选择目标语言。
3. **执行翻译**：点击右上角的 “EXECUTE / 执行翻译”。
4. **管理存档**：点击右上角圆点图标打开“存档记录”。

---
*Developed with focus on precision and clarity.*
