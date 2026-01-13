
export interface TranslationItem {
  id: string;
  timestamp: number;
  inputJson: string;
  outputJson: string;
  targetLanguage: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export type UILang = 'en' | 'zh';

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'Chinese', name: '简体中文', flag: '🇨🇳' },
  { code: 'English', name: 'English', flag: '🇺🇸' },
  { code: 'Japanese', name: '日本語', flag: '🇯🇵' },
  { code: 'Korean', name: '한국어', flag: '🇰🇷' },
  { code: 'French', name: 'Français', flag: '🇫🇷' },
  { code: 'German', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'Spanish', name: 'Español', flag: '🇪🇸' },
  { code: 'Russian', name: 'Русский', flag: '🇷🇺' },
  { code: 'Portuguese', name: 'Português', flag: '🇵🇹' },
  { code: 'Italian', name: 'Italiano', flag: '🇮🇹' }
];

export const UI_STRINGS = {
  en: {
    appName: "LEXICON",
    subtitle: "STRUCTURAL INTELLIGENCE",
    source: "SOURCE",
    result: "RESULT",
    translate: "EXECUTE",
    translating: "PROCESSING",
    history: "ARCHIVE",
    clear: "VOID",
    copy: "CLONE",
    copied: "DONE",
    placeholder: "Insert structural data...",
    invalidJson: "Structure mismatch.",
    emptyInput: "Input required.",
    historyEmpty: "NULL ARCHIVE",
    clearCache: "PURGE",
    footer: "CORE ENGINE ACTIVE • V5.4.0",
    draft: "DRAFT",
    record: "RECORD",
    status: "API STATUS",
    connected: "ACTIVE",
    unset: "OFFLINE",
    items: "ENTRIES"
  },
  zh: {
    appName: "LEXICON",
    subtitle: "结构化数据智能",
    source: "源数据",
    result: "译文",
    translate: "执行翻译",
    translating: "处理中",
    history: "存档记录",
    clear: "清空",
    copy: "复制",
    copied: "已复制",
    placeholder: "插入结构化数据...",
    invalidJson: "结构不匹配",
    emptyInput: "请输入内容",
    historyEmpty: "暂无存档",
    clearCache: "清除数据",
    footer: "核心引擎运行中 • V5.4.0",
    draft: "草稿",
    record: "记录",
    status: "接口状态",
    connected: "活跃",
    unset: "未就绪",
    items: "项记录"
  }
};
