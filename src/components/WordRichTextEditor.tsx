import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Indent, Outdent, Type, Palette, Highlighter, Table, Image as ImageIcon,
  Sparkles, FileText, Layout, Eye, ZoomIn, ZoomOut, Maximize2, Minimize2, CheckSquare,
  HelpCircle, Printer, Download, Stamp, ShieldAlert, Subscript, Superscript, Undo, Redo,
  Heading1, Heading2, Heading3, AlignVerticalSpaceAround, FileCode, Check
} from 'lucide-react';
import { FormFields } from '../types';

interface WordRichTextEditorProps {
  value: string;
  onChange: (newValue: string) => void;
  formFields?: FormFields;
  documentTitle?: string;
  onSave?: () => void;
  onExportWord?: () => void;
  onExportPdf?: () => void;
}

export const WordRichTextEditor: React.FC<WordRichTextEditorProps> = ({
  value,
  onChange,
  formFields,
  documentTitle,
  onSave,
  onExportWord,
  onExportPdf
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'insert' | 'layout' | 'view'>('home');
  const editorRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState<string>('14px');
  const [fontFamily, setFontFamily] = useState<string>('SimSun');
  const [textColor, setTextColor] = useState<string>('#0f172a');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showRuler, setShowRuler] = useState<boolean>(true);
  const [showWatermark, setShowWatermark] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [wordCount, setWordCount] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const [lineSpacing, setLineSpacing] = useState<string>('1.6');
  const [pageMargin, setPageMargin] = useState<'standard' | 'narrow' | 'wide'>('standard');

  // Sync value from props into editor inner HTML on initial mount or external reset
  useEffect(() => {
    if (editorRef.current) {
      if (!editorRef.current.innerHTML || editorRef.current.innerHTML === '<br>') {
        // Format initial plain text content into clean paragraphs if plain text
        if (!value.includes('<p>') && !value.includes('<div>')) {
          const htmlContent = value
            .split('\n')
            .map(line => line.trim() ? `<p style="margin-bottom: 0.75rem; text-indent: 2em; line-height: ${lineSpacing};">${line}</p>` : '<p><br></p>')
            .join('');
          editorRef.current.innerHTML = htmlContent || '<p>请在此输入文书内容...</p>';
        } else {
          editorRef.current.innerHTML = value;
        }
      }
      updateCounts();
    }
  }, []);

  const updateCounts = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || '';
      setCharCount(text.length);
      const words = text.trim().split(/\s+/).filter(Boolean);
      setWordCount(words.length);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
      updateCounts();
    }
  };

  // Helper to run formatting commands
  const execCmd = (command: string, valueArg: string = '') => {
    document.execCommand(command, false, valueArg);
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
    }
  };

  // Apply custom inline block styles
  const applyHeadingStyle = (tag: string, textStyleClass: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    execCmd('formatBlock', tag);
  };

  // Insert custom HTML block
  const insertHtmlAtCursor = (html: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const div = document.createElement('div');
      div.innerHTML = html;
      const frag = document.createDocumentFragment();
      let node;
      while ((node = div.firstChild)) {
        frag.appendChild(node);
      }
      range.insertNode(frag);
    } else {
      editorRef.current.innerHTML += html;
    }
    handleInput();
  };

  // Insert AI Clause Block (Shallow Blue Background)
  const insertAiClauseBlock = () => {
    const aiHtml = `
      <div class="my-4 p-4 bg-sky-50 border border-sky-200 rounded-lg text-sky-950 font-sans relative group" contenteditable="true" style="background-color: #f0f9ff; border: 1px solid #bae6fd; padding: 12px 16px; border-radius: 8px; margin: 12px 0;">
        <div style="display: flex; align-items: center; justify-between; margin-bottom: 6px; font-weight: 600; font-size: 12px; color: #0369a1;">
          <span>✨ 【AI 智能撰写段落】</span>
          <span style="font-size: 10px; background-color: #e0f2fe; color: #0284c7; padding: 2px 6px; border-radius: 4px; border: 1px solid #bae6fd; margin-left: auto;">AI辅助生成 - 待人工确认</span>
        </div>
        <p style="font-size: 13px; line-height: 1.6; color: #0c4a6e; margin: 0;">
          “承包人承诺所提供电网工程物资及施工过程严格落实电网《反违章管理办法》。若发生严重违章，按单次5万元直接扣减违约金，并暂停投标资格。”
        </p>
      </div>
    `;
    insertHtmlAtCursor(aiHtml);
  };

  // Insert Table
  const insertTable = (rows: number, cols: number) => {
    let tableHtml = `<table style="width: 100%; border-collapse: collapse; margin: 12px 0; border: 1px solid #cbd5e1; font-size: 12px;"><tbody>`;
    for (let r = 0; r < rows; r++) {
      tableHtml += `<tr>`;
      for (let c = 0; c < cols; c++) {
        const bg = r === 0 ? 'background-color: #f8fafc; font-weight: bold;' : '';
        tableHtml += `<td style="border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; ${bg}">单元格 ${r + 1}-${c + 1}</td>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `</tbody></table><p><br></p>`;
    insertHtmlAtCursor(tableHtml);
  };

  // Insert Official SGCC Stamp
  const insertStamp = () => {
    const stampHtml = `
      <div style="display: inline-flex; flex-direction: column; align-items: center; justify-content: center; width: 130px; height: 130px; border: 2px dashed #dc2626; border-radius: 50%; color: #dc2626; padding: 8px; margin: 16px 24px; text-align: center; font-weight: bold; transform: rotate(-8deg); user-select: none;">
        <span style="font-size: 10px; font-family: SimSun;">国家电网有限公司</span>
        <span style="font-size: 16px; margin: 2px 0;">★</span>
        <span style="font-size: 11px;">合同专用章</span>
      </div>
    `;
    insertHtmlAtCursor(stampHtml);
  };

  // Page Margin padding mapping
  const marginClasses = {
    standard: 'p-12 sm:p-16',
    narrow: 'p-6 sm:p-8',
    wide: 'p-16 sm:p-20'
  };

  return (
    <div className={`flex flex-col bg-slate-200/80 text-slate-800 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900' : 'h-full border border-slate-300 rounded-xl overflow-hidden shadow-lg'}`}>
      
      {/* ==================== 1. WORD RIBBON TOOLBAR ==================== */}
      <div className="bg-white border-b border-slate-300 shrink-0 select-none shadow-sm">
        
        {/* Top File & Tab Switch Bar */}
        <div className="flex items-center justify-between px-3 pt-2 pb-1 border-b border-slate-200 bg-slate-50 text-xs">
          <div className="flex items-center space-x-1">
            <div className="bg-indigo-600 text-white font-bold text-xs px-2.5 py-1 rounded flex items-center space-x-1.5 shadow-sm">
              <FileCode className="w-3.5 h-3.5" />
              <span>Word 编辑器</span>
            </div>

            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1 rounded-t font-semibold transition ${activeTab === 'home' ? 'bg-white text-indigo-700 border-t-2 border-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              开始
            </button>
            <button
              onClick={() => setActiveTab('insert')}
              className={`px-3 py-1 rounded-t font-semibold transition ${activeTab === 'insert' ? 'bg-white text-indigo-700 border-t-2 border-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              插入
            </button>
            <button
              onClick={() => setActiveTab('layout')}
              className={`px-3 py-1 rounded-t font-semibold transition ${activeTab === 'layout' ? 'bg-white text-indigo-700 border-t-2 border-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              页面与布局
            </button>
            <button
              onClick={() => setActiveTab('view')}
              className={`px-3 py-1 rounded-t font-semibold transition ${activeTab === 'view' ? 'bg-white text-indigo-700 border-t-2 border-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              视图与工具
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {onSave && (
              <button
                onClick={onSave}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1 rounded text-xs shadow-sm flex items-center space-x-1 transition"
              >
                <Check className="w-3 h-3" />
                <span>保存草稿</span>
              </button>
            )}

            {onExportWord && (
              <button
                onClick={onExportWord}
                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-1 rounded text-xs shadow-sm flex items-center space-x-1 font-medium"
              >
                <Download className="w-3 h-3 text-indigo-600" />
                <span>导出 Word</span>
              </button>
            )}

            {onExportPdf && (
              <button
                onClick={onExportPdf}
                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-1 rounded text-xs shadow-sm flex items-center space-x-1 font-medium"
              >
                <Printer className="w-3 h-3 text-rose-600" />
                <span>打印/导出 PDF</span>
              </button>
            )}

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 hover:bg-slate-200 text-slate-600 rounded"
              title={isFullscreen ? "退出全屏编辑" : "进入全屏编辑"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Tab Toolbar Content */}
        <div className="p-2 flex flex-wrap items-center gap-2 text-xs bg-white">
          
          {/* TAB 1: HOME (开始) */}
          {activeTab === 'home' && (
            <>
              {/* Undo / Redo */}
              <div className="flex items-center space-x-0.5 border-r border-slate-200 pr-2">
                <button onClick={() => execCmd('undo')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700" title="撤销 (Ctrl+Z)">
                  <Undo className="w-4 h-4" />
                </button>
                <button onClick={() => execCmd('redo')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700" title="重做 (Ctrl+Y)">
                  <Redo className="w-4 h-4" />
                </button>
              </div>

              {/* Font Family Selector */}
              <div className="flex items-center space-x-1 border-r border-slate-200 pr-2">
                <select
                  value={fontFamily}
                  onChange={(e) => {
                    setFontFamily(e.target.value);
                    execCmd('fontName', e.target.value);
                  }}
                  className="bg-slate-50 border border-slate-300 text-xs text-slate-800 rounded px-2 py-1 focus:outline-none focus:border-indigo-500 font-sans"
                >
                  <option value="SimSun">宋体 (国家电网标准)</option>
                  <option value="SimHei">黑体 (标题推荐)</option>
                  <option value="KaiTi">楷体</option>
                  <option value="FangSong">仿宋</option>
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                </select>

                <select
                  value={fontSize}
                  onChange={(e) => {
                    setFontSize(e.target.value);
                    // Standard execCommand uses 1-7 size scale
                    const sizeMap: Record<string, string> = {
                      '12px': '2',
                      '14px': '3',
                      '16px': '4',
                      '18px': '5',
                      '22px': '6',
                      '28px': '7'
                    };
                    execCmd('fontSize', sizeMap[e.target.value] || '3');
                  }}
                  className="bg-slate-50 border border-slate-300 text-xs text-slate-800 rounded px-1.5 py-1 focus:outline-none focus:border-indigo-500"
                >
                  <option value="12px">小四 (12pt)</option>
                  <option value="14px">四号 (14pt - 正文)</option>
                  <option value="16px">小三 (16pt)</option>
                  <option value="18px">三号 (18pt - 二级标题)</option>
                  <option value="22px">二号 (22pt - 一级标题)</option>
                  <option value="28px">一号 (28pt - 大标题)</option>
                </select>
              </div>

              {/* Formatting Actions (Bold, Italic, Underline, Strikethrough) */}
              <div className="flex items-center space-x-0.5 border-r border-slate-200 pr-2">
                <button onClick={() => execCmd('bold')} className="p-1.5 hover:bg-slate-100 rounded text-slate-800 font-bold" title="加粗 (Ctrl+B)">
                  <Bold className="w-4 h-4" />
                </button>
                <button onClick={() => execCmd('italic')} className="p-1.5 hover:bg-slate-100 rounded text-slate-800 italic" title="倾斜 (Ctrl+I)">
                  <Italic className="w-4 h-4" />
                </button>
                <button onClick={() => execCmd('underline')} className="p-1.5 hover:bg-slate-100 rounded text-slate-800 underline" title="下划线 (Ctrl+U)">
                  <Underline className="w-4 h-4" />
                </button>
                <button onClick={() => execCmd('strikeThrough')} className="p-1.5 hover:bg-slate-100 rounded text-slate-800 line-through" title="删除线">
                  <Strikethrough className="w-4 h-4" />
                </button>
                <button onClick={() => execCmd('subscript')} className="p-1.5 hover:bg-slate-100 rounded text-slate-800" title="下标">
                  <Subscript className="w-4 h-4" />
                </button>
                <button onClick={() => execCmd('superscript')} className="p-1.5 hover:bg-slate-100 rounded text-slate-800" title="上标">
                  <Superscript className="w-4 h-4" />
                </button>
              </div>

              {/* Text & Background Color */}
              <div className="flex items-center space-x-1 border-r border-slate-200 pr-2">
                <div className="flex items-center space-x-1" title="文字颜色">
                  <Palette className="w-3.5 h-3.5 text-slate-600" />
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => {
                      setTextColor(e.target.value);
                      execCmd('foreColor', e.target.value);
                    }}
                    className="w-5 h-5 cursor-pointer rounded border border-slate-300 p-0"
                  />
                </div>
                <div className="flex items-center space-x-1 ml-1" title="背景高亮 (包含 AI 浅蓝高亮)">
                  <Highlighter className="w-3.5 h-3.5 text-amber-600" />
                  <button
                    onClick={() => execCmd('hiliteColor', '#f0f9ff')}
                    className="w-5 h-5 rounded border border-sky-300 bg-sky-100 hover:scale-105 transition"
                    title="AI 浅蓝高亮"
                  />
                  <button
                    onClick={() => execCmd('hiliteColor', '#fef08a')}
                    className="w-5 h-5 rounded border border-yellow-300 bg-yellow-200 hover:scale-105 transition"
                    title="黄色荧光标注"
                  />
                </div>
              </div>

              {/* Text Alignment */}
              <div className="flex items-center space-x-0.5 border-r border-slate-200 pr-2">
                <button onClick={() => execCmd('justifyLeft')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700" title="左对齐">
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button onClick={() => execCmd('justifyCenter')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700" title="居中对齐">
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button onClick={() => execCmd('justifyRight')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700" title="右对齐">
                  <AlignRight className="w-4 h-4" />
                </button>
                <button onClick={() => execCmd('justifyFull')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700" title="两端对齐">
                  <AlignJustify className="w-4 h-4" />
                </button>
              </div>

              {/* Lists & Indentation */}
              <div className="flex items-center space-x-0.5 border-r border-slate-200 pr-2">
                <button onClick={() => execCmd('insertUnorderedList')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700" title="无序列表">
                  <List className="w-4 h-4" />
                </button>
                <button onClick={() => execCmd('insertOrderedList')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700" title="有序列表">
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button onClick={() => execCmd('indent')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700" title="增加缩进 (首行缩进 2 字符)">
                  <Indent className="w-4 h-4" />
                </button>
                <button onClick={() => execCmd('outdent')} className="p-1.5 hover:bg-slate-100 rounded text-slate-700" title="减少缩进">
                  <Outdent className="w-4 h-4" />
                </button>
              </div>

              {/* Preset Heading Styles */}
              <div className="flex items-center space-x-1">
                <span className="text-[10px] text-slate-400 font-medium">快速样式:</span>
                <button
                  onClick={() => applyHeadingStyle('H1', 'font-bold text-xl')}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-bold text-xs"
                >
                  大标题
                </button>
                <button
                  onClick={() => applyHeadingStyle('H2', 'font-bold text-lg')}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-xs"
                >
                  二级标题
                </button>
                <button
                  onClick={() => applyHeadingStyle('H3', 'font-bold text-sm')}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium text-xs"
                >
                  条款小标题
                </button>
                <button
                  onClick={() => applyHeadingStyle('P', '')}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs"
                >
                  正文段落
                </button>
              </div>
            </>
          )}

          {/* TAB 2: INSERT (插入) */}
          {activeTab === 'insert' && (
            <div className="flex items-center space-x-3 text-xs">
              
              {/* Insert AI Clause Button */}
              <button
                onClick={insertAiClauseBlock}
                className="bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>插入 AI 浅蓝高亮条款段落</span>
              </button>

              <div className="h-5 w-px bg-slate-200" />

              {/* Table Generator */}
              <div className="flex items-center space-x-1">
                <Table className="w-4 h-4 text-indigo-600" />
                <span className="font-medium text-slate-700">插入表格:</span>
                <button onClick={() => insertTable(2, 2)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700">2x2</button>
                <button onClick={() => insertTable(3, 3)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700">3x3</button>
                <button onClick={() => insertTable(4, 4)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700">4x4</button>
              </div>

              <div className="h-5 w-px bg-slate-200" />

              {/* Insert Stamp */}
              <button
                onClick={insertStamp}
                className="bg-white hover:bg-slate-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 font-medium transition"
              >
                <Stamp className="w-4 h-4 text-rose-600" />
                <span>插入电网公章占位</span>
              </button>

              {/* Horizontal Line */}
              <button
                onClick={() => execCmd('insertHorizontalRule')}
                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg font-medium"
              >
                插入分割线
              </button>
            </div>
          )}

          {/* TAB 3: PAGE LAYOUT (页面与布局) */}
          {activeTab === 'layout' && (
            <div className="flex items-center space-x-4 text-xs">
              {/* Line Spacing */}
              <div className="flex items-center space-x-1.5">
                <AlignVerticalSpaceAround className="w-4 h-4 text-indigo-600" />
                <span className="font-medium text-slate-700">行距设置:</span>
                <select
                  value={lineSpacing}
                  onChange={(e) => setLineSpacing(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800"
                >
                  <option value="1.2">单倍行距 (1.2)</option>
                  <option value="1.6">电网标准 1.6 倍行距</option>
                  <option value="2.0">双倍行距 (2.0)</option>
                </select>
              </div>

              {/* Page Margins */}
              <div className="flex items-center space-x-1.5">
                <Layout className="w-4 h-4 text-indigo-600" />
                <span className="font-medium text-slate-700">页边距:</span>
                <button
                  onClick={() => setPageMargin('standard')}
                  className={`px-2 py-1 rounded transition ${pageMargin === 'standard' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 text-slate-700'}`}
                >
                  标准 (2.54cm)
                </button>
                <button
                  onClick={() => setPageMargin('narrow')}
                  className={`px-2 py-1 rounded transition ${pageMargin === 'narrow' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 text-slate-700'}`}
                >
                  窄边距 (1.27cm)
                </button>
                <button
                  onClick={() => setPageMargin('wide')}
                  className={`px-2 py-1 rounded transition ${pageMargin === 'wide' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 text-slate-700'}`}
                >
                  宽边距 (3.18cm)
                </button>
              </div>

              {/* Watermark Switch */}
              <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showWatermark}
                    onChange={(e) => setShowWatermark(e.target.checked)}
                    className="accent-indigo-600 rounded"
                  />
                  <span className="font-medium text-slate-700">显示“国网内部涉密”水印</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: VIEW & TOOLS (视图与辅助) */}
          {activeTab === 'view' && (
            <div className="flex items-center space-x-4 text-xs">
              {/* Zoom Controls */}
              <div className="flex items-center space-x-1">
                <ZoomOut className="w-4 h-4 text-slate-500" />
                <button onClick={() => setZoomLevel(Math.max(70, zoomLevel - 10))} className="p-1 hover:bg-slate-100 rounded">-</button>
                <span className="font-bold text-slate-800 w-12 text-center">{zoomLevel}%</span>
                <button onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))} className="p-1 hover:bg-slate-100 rounded">+</button>
                <ZoomIn className="w-4 h-4 text-slate-500" />
              </div>

              {/* Ruler Toggle */}
              <label className="flex items-center space-x-1.5 cursor-pointer border-l border-slate-200 pl-3">
                <input
                  type="checkbox"
                  checked={showRuler}
                  onChange={(e) => setShowRuler(e.target.checked)}
                  className="accent-indigo-600 rounded"
                />
                <span className="font-medium text-slate-700">显示 Word 标尺 (Ruler)</span>
              </label>

              {/* Word Count Indicator */}
              <div className="border-l border-slate-200 pl-3 text-slate-500">
                <span>总字数: <strong className="text-slate-800">{charCount}</strong> 字</span>
                <span className="ml-3">词数: <strong className="text-slate-800">{wordCount}</strong> 词</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ==================== 2. WORD RULER (SIMULATION) ==================== */}
      {showRuler && (
        <div className="bg-slate-100 border-b border-slate-300 h-6 flex items-center justify-center shrink-0 select-none overflow-hidden text-[9px] text-slate-400 font-mono">
          <div className="w-full max-w-[850px] border-x border-slate-300 bg-white h-full flex items-center justify-between px-4 relative">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-slate-200/60 border-r border-slate-300" title="左边距" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-slate-200/60 border-l border-slate-300" title="右边距" />
            
            {/* Ruler centimeter ticks */}
            <div className="w-full flex justify-between px-10 text-[8px] text-slate-400">
              <span>0 cm</span>
              <span>2 cm</span>
              <span>4 cm</span>
              <span>6 cm</span>
              <span>8 cm</span>
              <span>10 cm</span>
              <span>12 cm</span>
              <span>14 cm</span>
              <span>16 cm</span>
              <span>18 cm</span>
              <span>21 cm</span>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 3. EDITABLE A4 PAPER CANVAS ==================== */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex justify-center bg-slate-200/80">
        
        {/* A4 Document Container */}
        <div 
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center', transition: 'transform 0.15s ease' }}
          className={`w-full max-w-[850px] bg-white border border-slate-300 rounded-sm shadow-2xl min-h-[1050px] flex flex-col relative my-2 ${marginClasses[pageMargin]}`}
        >
          
          {/* Watermark Overlay (If enabled) */}
          {showWatermark && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0 opacity-[0.06] select-none">
              <div className="text-6xl sm:text-7xl font-black text-slate-900 -rotate-45 tracking-widest text-center uppercase">
                国家电网有限公司<br />内部涉密文件 · 严禁外传
              </div>
            </div>
          )}

          {/* Word Document Header (Simulated SGCC Header) */}
          <div className="text-center text-[11px] text-slate-400 pb-4 mb-6 border-b border-slate-200 font-sans flex items-center justify-between relative z-10 shrink-0">
            <span className="font-medium text-slate-500">国家电网有限公司标准法律文书格式</span>
            {documentTitle && <span className="font-semibold text-slate-700">{documentTitle}</span>}
            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">机密级别：内部资料</span>
          </div>

          {/* CONTENT EDITABLE CANVAS */}
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            style={{
              fontFamily: fontFamily === 'SimSun' ? '"SimSun", "宋体", serif' : fontFamily,
              fontSize: fontSize,
              lineHeight: lineSpacing,
              color: textColor,
            }}
            className="flex-1 focus:outline-none min-h-[750px] leading-relaxed relative z-10 text-slate-900 select-text font-sans"
            spellCheck={false}
          />

          {/* Word Document Footer */}
          <div className="text-center text-[10px] text-slate-400 pt-6 mt-8 border-t border-slate-200 font-sans flex items-center justify-between relative z-10 shrink-0">
            <span>甲方/发包方：{formFields?.partyA || '国家电网有限公司'}</span>
            <span>页码：第 1 页 / 共 1 页</span>
            <span>乙方/承包方：{formFields?.partyB || '待填报单位'}</span>
          </div>

        </div>
      </div>

      {/* ==================== 4. BOTTOM STATUS BAR ==================== */}
      <div className="bg-slate-100 border-t border-slate-300 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-600 shrink-0 select-none">
        <div className="flex items-center space-x-4">
          <span>页面: <strong>1 / 1</strong></span>
          <span>字符数: <strong>{charCount}</strong></span>
          <span>语言: <strong>中文 (中国)</strong></span>
          <span className="text-emerald-700 font-medium flex items-center space-x-1">
            <CheckSquare className="w-3 h-3 text-emerald-600" />
            <span>电网合规语法检查正常</span>
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <span className="text-slate-400">显示比例:</span>
            <input
              type="range"
              min="70"
              max="150"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(Number(e.target.value))}
              className="w-20 accent-indigo-600 cursor-pointer h-1"
            />
            <span className="font-mono">{zoomLevel}%</span>
          </div>
        </div>
      </div>

    </div>
  );
};
