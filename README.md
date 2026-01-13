# LEXICON — Architectural Localization Engine

**LEXICON** 是一款专为开发者与本地化专家打造的极致简约型结构化数据翻译工具。它利用 Google Gemini API 的强大性能，在执行多语言翻译的同时，严格确保原始 JSON、XML 或 Markdown 结构的完整性。

![Build Status](https://img.shields.io/badge/Build-055.ARCH-black?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Gemini%20%7C%20Tailwind-white?style=flat-square)

## 核心特性

- **结构完整性 (Structural Integrity)**：采用先进的系统级提示词工程，严格保留所有 JSON 键名、XML 标签及嵌套层级。
- **极致简约 UI (Minimalist Aesthetics)**：遵循建筑极简主义，去除非必要视觉干扰。提供高对比度、高清晰度的版式设计，确保专业办公场景下的长时间使用舒适度。
- **实时处理 (Real-time Processing)**：基于 Gemini 3 Flash 模型，提供毫秒级响应速度。
- **多语言适配 (Bilingual Interface)**：界面支持中/英文一键切换，交互逻辑根据所选语言动态调整。
- **智能视图 (Hybrid Rendering)**：
  - **JSON 树形图**：交互式节点折叠与展开。
  - **混合视图**：针对 XML 或非标准结构提供语法感知的高亮渲染。
- **本地存档 (Local Archive)**：所有操作自动保存在浏览器缓存中，随时回溯。

## 技术架构

- **核心引擎**: React 19 (ESM 驱动)
- **AI 智能**: Google GenAI (Gemini 3 Pro/Flash)
- **样式处理**: Tailwind CSS (JIT 引擎)
- **字体方案**: Inter (UI) / Fira Code (Monospace)

## 本地部署

请确保您的环境中已安装现代浏览器（如 Chrome, Edge 或 Safari）。

### 1. 获取代码
将所有项目文件下载至您的工作目录：
```text
/project-root
  ├── index.html
  ├── index.tsx
  ├── App.tsx
  ├── types.ts
  ├── components/
  └── services/
```

### 2. 配置 API Key
本项目直接集成了 Google Gemini 服务。
- **线上使用**：在应用右上角的“接口状态 (API STATUS)”处点击图标，按照提示选择或配置您的 Google AI Studio API Key。
- **环境变量**：应用会自动读取 `process.env.API_KEY`。

### 3. 运行项目
由于项目使用了现代 ESM 导入映射 (Import Maps)，您可以使用任何轻量级静态服务器运行：
```bash
# 使用 npx serve
npx serve .

# 或使用 Python
python -m http.server 8000
```
访问 `http://localhost:8000` 即可启动。

## 使用指南

1. **输入数据**：在左侧“源数据”面板粘贴您的 JSON 或 XML 内容。
2. **选择语言**：点击中间的语言选择器，从 10 种支持的语言中选择目标语言。
3. **执行翻译**：点击右上角的 “EXECUTE / 执行翻译”。
4. **管理存档**：点击右上角圆点图标打开“存档记录”，查看或恢复之前的翻译任务。
5. **快捷操作**：悬停在代码区域上方可显示“清空 (VOID)”或“复制 (CLONE)”按钮。

---
*Developed with focus on precision and clarity.*