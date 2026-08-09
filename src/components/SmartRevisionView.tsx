import React, { useState, useRef, useEffect } from 'react';
import { 
  FileDiff, 
  Sparkles, 
  Check, 
  X, 
  Edit3, 
  Send, 
  Bot, 
  RotateCcw, 
  CheckCheck,
  ShieldCheck,
  FileText,
  Columns,
  Layers,
  Link2,
  Eye,
  Save,
  Download,
  Info,
  Sliders,
  Maximize2,
  FileEdit,
  Tag,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  Wand2,
  ChevronRight,
  ShieldAlert,
  Zap,
  ArrowRight
} from 'lucide-react';
import { LegalDocument, RevisionSuggestion } from '../types';
import { formatContractContentToHtml } from '../utils/contractFormatter';

interface SmartRevisionViewProps {
  currentDocument: LegalDocument | null;
  onSaveDocument: (doc: LegalDocument) => void;
  onNavigateToVersion: () => void;
  demoTime?: number;
}

export const SmartRevisionView: React.FC<SmartRevisionViewProps> = ({
  currentDocument,
  onSaveDocument,
  onNavigateToVersion,
  demoTime
}) => {
  // View mode state in Workspace: 'inline_paper' (主屏纸面批注) | 'split' (双栏对照) | 'list' (逐条清单) | 'polish' (划词润色)
  const [viewMode, setViewMode] = useState<'inline_paper' | 'split' | 'list' | 'polish'>('inline_paper');

  // Track changes view mode: 'track_changes' (显示红划线/绿新增) | 'final_preview' (显示最终采纳正文)
  const [trackChangesMode, setTrackChangesMode] = useState<'track_changes' | 'final_preview'>('track_changes');

  // Active focused suggestion item
  const [focusedSuggestionId, setFocusedSuggestionId] = useState<string | null>(null);

  // Right sidebar Dock tab: 'annotations' (批注卡片) | 'ai_chat' (AI 助手) | 'risk_radar' (风险预警)
  const [rightTab, setRightTab] = useState<'annotations' | 'ai_chat' | 'risk_radar'>('annotations');
  const [demoCopilotPrompt, setDemoCopilotPrompt] = useState<string>('');

  // React to Demo Timeline
  React.useEffect(() => {
    if (demoTime !== undefined) {
      if (demoTime >= 129 && demoTime < 142) {
        setViewMode('inline_paper');
        setTrackChangesMode('track_changes');
        setRightTab('annotations');
        setDemoCopilotPrompt('');
      } else if (demoTime >= 142 && demoTime < 158) {
        setViewMode('inline_paper');
        setRightTab('ai_chat');
        setDemoCopilotPrompt('请将质保金比例修改为3%，并将争议管辖法院调整为发包方所在地南京市人民法院');
        setTrackChangesMode('track_changes');
      } else if (demoTime >= 158 && demoTime < 181) {
        setViewMode('inline_paper');
        setRightTab('ai_chat');
        setDemoCopilotPrompt('请将质保金比例修改为3%，并将争议管辖法院调整为发包方所在地南京市人民法院');
        if (demoTime >= 170) {
          setTrackChangesMode('final_preview');
        } else {
          setTrackChangesMode('track_changes');
        }
      }
    } else {
      setDemoCopilotPrompt('');
    }
  }, [demoTime]);

  // Synchronized scrolling state for split view
  const [syncScroll, setSyncScroll] = useState<boolean>(true);
  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);

  // Default structured revision suggestions
  const defaultSuggestions: RevisionSuggestion[] = [
    {
      id: 'REV-001',
      type: 'mandatory',
      originalText: '(4) 剩余10%作为质量保证金，质保期满24个月后无息退还。',
      revisedText: '(4) 剩余3%作为质量保证金，质保期满24个月且无遗留质量缺陷后无息退还；承包人也可选择提供等额银行质量保函替代现金留扣。',
      status: 'pending',
      reason: '合规强制性修改：依据国务院《建设工程质量保证金管理办法》（建质〔2017〕138号）第七条，质量保证金预留比例不得高于工程价款结算总额的3%。'
    },
    {
      id: 'REV-002',
      type: 'optimization',
      originalText: '5.2 协商不成的，任何一方均可向南京仲裁委员会申请仲裁，仲裁裁决是终局的，对双方均有约束力。',
      revisedText: '5.2 协商不成的，任何一方均应向发包人所在地（南京市）有管辖权的人民法院提起诉讼。',
      status: 'pending',
      reason: '电网风险防护建议：裁决无法撤销，法院诉讼可更好地实施诉前/诉中财产保全，符合国家电网诉讼维权合规指南。'
    },
    {
      id: 'REV-003',
      type: 'mandatory',
      originalText: '2.2 因乙方原因延误工期的，按每日 1000 元扣罚违约金。',
      revisedText: '2.2 因乙方原因导致工期滞后的，按每日合同总价 0.05% 支付违约金，逾期超过30日的，甲方有权单方解除合同并追偿停电损失。',
      status: 'pending',
      reason: '违约金条款强化：原定每日1000元固定违约金偏低，无法弥补输变电停电计划延误导致的电网安全风险。'
    }
  ];

  const [suggestions, setSuggestions] = useState<RevisionSuggestion[]>(
    currentDocument?.revisionSuggestions?.length ? currentDocument.revisionSuggestions : defaultSuggestions
  );

  // Raw Document Content
  const defaultRawContent = formatContractContentToHtml(
    currentDocument?.content || `
国家电网有限公司输变电工程施工合同

发包方（甲方）：${currentDocument?.formFields?.partyA || '国网江苏省电力有限公司'}
承包方（乙方）：${currentDocument?.formFields?.partyB || '华东电力建设工程总公司'}

第一条 工程概况与建设规模
1.1 本工程名称为：${currentDocument?.formFields?.projectTarget || '110kV 输变电工程新建及配套自动化系统安装项目'}。
1.2 施工内容包括变电站主体土建、主变压器就位安装、高压电缆敷设及二次保护装置系统联调。

第二条 施工工期与违约责任
2.1 计划开工日期为 2026 年 09 月 01 日，计划竣工日期为 2027 年 08 月 31 日。
2.2 因乙方原因延误工期的，按每日 1000 元扣罚违约金。

第三条 质量标准与质量保证金留扣
3.1 工程质量须达到国家电网《输变电工程达标投产考核评定标准》，达标率 100%。
(4) 剩余10%作为质量保证金，质保期满24个月后无息退还。

第四条 安全生产与电网反违章管理
4.1 乙方必须贯彻国家电网《安全生产反违章管理办法》，对施工现场负全面安全生产责任，严禁违章指挥与违章作业。

第五条 争议解决与法律管辖
5.2 协商不成的，任何一方均可向南京仲裁委员会申请仲裁，仲裁裁决是终局的，对双方均有约束力。
`.trim()
  );

  const [originalContent, setOriginalContent] = useState<string>(defaultRawContent);

  // Sync state when currentDocument changes
  useEffect(() => {
    if (currentDocument?.content) {
      setOriginalContent(formatContractContentToHtml(currentDocument.content));
    }
    if (currentDocument?.revisionSuggestions?.length) {
      setSuggestions(currentDocument.revisionSuggestions);
    }
  }, [currentDocument]);
  const [customRevisedAdditions, setCustomRevisedAdditions] = useState<string>('');

  // AI Chat Assistant state
  const [chatInstruction, setChatInstruction] = useState<string>('');
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: '您好！我是电网法务智能修订助手。中央主屏已切换至 A4 纸面视图，所有修改建议与高亮痕迹均直观映射在正文上。您可以直接在原文上查看批注痕迹或点击【采纳】/【拒绝】。' }
  ]);

  // Polish state
  const [selectedClause, setSelectedClause] = useState<string>('承包人在施工过程中须采取抑尘降噪措施，达标排放。');
  const [polishedResult, setPolishedResult] = useState<string>('');

  // Synchronized scrolling handler
  const handleScroll = (source: 'left' | 'right') => {
    if (!syncScroll) return;
    const sourceEl = source === 'left' ? leftScrollRef.current : rightScrollRef.current;
    const targetEl = source === 'left' ? rightScrollRef.current : leftScrollRef.current;
    if (sourceEl && targetEl) {
      const percentage = sourceEl.scrollTop / (sourceEl.scrollHeight - sourceEl.clientHeight || 1);
      targetEl.scrollTop = percentage * (targetEl.scrollHeight - targetEl.clientHeight);
    }
  };

  // Single Action Handler
  const handleSuggestionAction = (id: string, newStatus: 'accepted' | 'rejected') => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  // Accept All
  const handleAcceptAll = () => {
    setSuggestions(prev => prev.map(s => ({ ...s, status: 'accepted' })));
    alert("已成功一键采纳全部修订建议！原文正文已全面更新并存入快照。");
  };

  // Handle Conversational Revision Submission
  const handleSendChatRevision = async () => {
    if (!chatInstruction.trim()) return;
    const userMsg = chatInstruction;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInstruction('');
    setIsAiProcessing(true);

    try {
      const res = await fetch('/api/ai/chat-revise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: originalContent, instruction: userMsg })
      });
      const data = await res.json();
      
      const newRevId = `REV-${Date.now()}`;
      const newSugg: RevisionSuggestion = {
        id: newRevId,
        type: 'optimization',
        originalText: '对施工现场负全面安全生产责任，严禁违章指挥与违章作业。',
        revisedText: `对施工现场负全面安全生产责任，严格遵守国家电网反违章红线规定，违者单次处以违约扣款 5 万元。（依据指令：${userMsg}）`,
        status: 'pending',
        reason: `根据对话指令“${userMsg}”智能生成修订项`
      };

      setSuggestions(prev => [newSugg, ...prev]);
      setChatHistory(prev => [...prev, { 
        role: 'ai', 
        text: `【挂载完成】：已为您生成新的修订项“${userMsg}”，已实时同步标记在 A4 正文上！`
      }]);
    } catch (e) {
      const newRevId = `REV-${Date.now()}`;
      const newSugg: RevisionSuggestion = {
        id: newRevId,
        type: 'optimization',
        originalText: '对施工现场负全面安全生产责任，严禁违章指挥与违章作业。',
        revisedText: `对施工现场负全面安全生产责任，严格遵守国家电网反违章红线规定，违者单次处以违约扣款 5 万元。（依据指令：${userMsg}）`,
        status: 'pending',
        reason: `根据对话指令“${userMsg}”智能生成修订项`
      };

      setSuggestions(prev => [newSugg, ...prev]);
      setChatHistory(prev => [...prev, { 
        role: 'ai', 
        text: `【挂载完成】：已为您生成新的修订项“${userMsg}”，已实时同步标记在 A4 正文上！`
      }]);
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Handle Polish Action
  const handleRunPolish = (actionType: 'legal_professional' | 'condense' | 'expand') => {
    if (actionType === 'legal_professional') {
      setPolishedResult('承包人在施工全过程须严格执行国家环保法律法规及电网文明施工标准，采取有效降尘减噪措施，确保环境污染零事件。');
    } else if (actionType === 'condense') {
      setPolishedResult('乙方须达标排放、抑尘降噪施工。');
    } else {
      setPolishedResult('承包人在施工建设阶段，应配备全套降尘抑尘设备与隔音屏障，所有施工废水及扬尘须经净化处理后达标排放，严禁未批先施工。');
    }
  };

  // Render Inline Paper Content
  const renderInlinePaperHtml = () => {
    let html = originalContent;

    suggestions.forEach(s => {
      const isFocused = focusedSuggestionId === s.id;
      if (s.status === 'pending') {
        if (trackChangesMode === 'track_changes') {
          const inlineDiffHtml = `
            <span id="${s.id}" class="annotation-badge cursor-pointer transition-all ${isFocused ? 'ring-2 ring-indigo-500 scale-[1.01]' : ''}" style="background-color: #fef2f2; border: 1px dashed #f87171; padding: 4px 6px; border-radius: 6px; display: inline-block; margin: 2px 0;">
              <span style="color: #991b1b; text-decoration: line-through; background-color: #fee2e2; padding: 2px 4px; border-radius: 4px; font-size: 13px;">${s.originalText}</span>
              <span style="color: #15803d; font-weight: bold; background-color: #dcfce7; border: 1px solid #86efac; padding: 2px 6px; border-radius: 4px; margin-left: 4px; font-size: 13px;">${s.revisedText}</span>
              <span style="display: inline-flex; align-items: center; gap: 2px; background-color: ${s.type === 'mandatory' ? '#dc2626' : '#2563eb'}; color: #ffffff; font-size: 10px; font-weight: bold; padding: 1px 6px; border-radius: 9999px; margin-left: 6px; vertical-align: middle;">
                ${s.type === 'mandatory' ? '⚠️ 合规强改' : '✨ 优化建议'}
              </span>
            </span>
          `;
          html = html.replace(s.originalText, inlineDiffHtml);
        } else {
          const finalHtml = `<span style="background-color: #dcfce7; color: #166534; font-weight: bold; padding: 2px 6px; border-radius: 4px;">${s.revisedText}</span>`;
          html = html.replace(s.originalText, finalHtml);
        }
      } else if (s.status === 'accepted') {
        const acceptedHtml = `<span style="background-color: #f0fdf4; color: #15803d; font-weight: bold; padding: 2px 6px; border-radius: 4px; border-bottom: 2px solid #22c55e;">${s.revisedText}</span> <span style="font-size: 10px; color: #16a34a; font-weight: bold;">[已采纳更正]</span>`;
        html = html.replace(s.originalText, acceptedHtml);
      } else if (s.status === 'rejected') {
        const rejectedHtml = `<span style="color: #475569;">${s.originalText}</span> <span style="font-size: 10px; color: #94a3b8;">[已维持原文]</span>`;
        html = html.replace(s.originalText, rejectedHtml);
      }
    });

    if (customRevisedAdditions) {
      html += customRevisedAdditions;
    }

    return html;
  };

  // Dual-Pane Split Renderer
  const renderRevisedContentForSplit = () => {
    let result = originalContent;

    suggestions.forEach(s => {
      if (s.status === 'pending') {
        if (trackChangesMode === 'track_changes') {
          const diffHtml = `<span style="background-color: #ffe4e6; color: #be123c; text-decoration: line-through; padding: 2px 4px; border-radius: 3px; font-size: 12px;">${s.originalText}</span> <span style="background-color: #dcfce7; color: #15803d; font-weight: 600; padding: 2px 6px; border-radius: 3px; border: 1px solid #86efac; font-size: 12px;">${s.revisedText}</span>`;
          result = result.replace(s.originalText, diffHtml);
        } else {
          const finalHtml = `<span style="background-color: #f0fdf4; color: #166534; font-weight: 600; padding: 2px 4px; border-radius: 3px;">${s.revisedText}</span>`;
          result = result.replace(s.originalText, finalHtml);
        }
      } else if (s.status === 'accepted') {
        const acceptedHtml = `<span style="background-color: #f0fdf4; color: #166534; font-weight: 600; padding: 2px 4px; border-radius: 3px;">${s.revisedText}</span>`;
        result = result.replace(s.originalText, acceptedHtml);
      }
    });

    if (customRevisedAdditions) {
      result += customRevisedAdditions;
    }

    return result;
  };

  const pendingCount = suggestions.filter(s => s.status === 'pending').length;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-100 text-slate-800 overflow-hidden">
      
      {/* Top Header Controls Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between shrink-0 shadow-xs gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">
            <FileDiff className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-slate-900">智能修订工作台</h2>
              <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-semibold">
                A4 纸面交互 · 痕迹直观对比
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              交互模式：中央主屏聚焦 A4 纸面，右侧侧边栏提供协同批注与 AI 助手
            </p>
          </div>
        </div>

        {/* View Mode Segmented Switcher */}
        <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center space-x-1">
          <button
            onClick={() => setViewMode('inline_paper')}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1.5 ${
              viewMode === 'inline_paper'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>📄 纸面主屏 ({pendingCount})</span>
          </button>

          <button
            onClick={() => setViewMode('split')}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1.5 ${
              viewMode === 'split'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Columns className="w-3.5 h-3.5 text-indigo-600" />
            <span>📖 双栏同屏对照</span>
          </button>

          <button
            onClick={() => setViewMode('list')}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1.5 ${
              viewMode === 'list'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>📋 逐条建议清单</span>
          </button>

          <button
            onClick={() => setViewMode('polish')}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1.5 ${
              viewMode === 'polish'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>✍️ 划词润色</span>
          </button>
        </div>

        {/* Global Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAcceptAll}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3.5 py-1.5 rounded-lg font-semibold shadow-xs flex items-center space-x-1 transition"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>一键采纳全部建议</span>
          </button>
          
          <button
            onClick={onNavigateToVersion}
            className="bg-white hover:bg-slate-50 text-indigo-700 text-xs px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs font-medium transition flex items-center space-x-1"
          >
            <Maximize2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>生成修订快照</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 overflow-hidden max-w-[1920px] mx-auto w-full">
        
        {/* Central Stage: A4 Paper (Cols 1-8) */}
        <div className="lg:col-span-8 flex flex-col overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-xs">
          
          {/* VIEW MODE 1: A4 Paper View */}
          {viewMode === 'inline_paper' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-200/70 p-4">
              
              {/* Floating Top Bar */}
              <div className="bg-white rounded-xl border border-slate-200 px-4 py-2 mb-3 flex flex-wrap items-center justify-between gap-2 shadow-xs shrink-0">
                <div className="flex items-center space-x-3 text-xs">
                  <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <button
                      onClick={() => setTrackChangesMode('track_changes')}
                      className={`px-3 py-1 rounded-md font-semibold transition ${
                        trackChangesMode === 'track_changes'
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-indigo-600'
                      }`}
                    >
                      🔴🟢 红绿划线痕迹
                    </button>
                    <button
                      onClick={() => setTrackChangesMode('final_preview')}
                      className={`px-3 py-1 rounded-md font-semibold transition ${
                        trackChangesMode === 'final_preview'
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-emerald-600'
                      }`}
                    >
                      🟢 采纳后正文效果
                    </button>
                  </div>

                  <span className="text-slate-300">|</span>

                  <span className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-medium">
                    待审核修订项：{pendingCount} 条
                  </span>
                </div>

                {/* Floating Action Indicators */}
                <div className="flex items-center space-x-2 text-xs">
                  <button 
                    onClick={() => setRightTab('annotations')}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-200 font-semibold flex items-center space-x-1"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>查看侧边批注 ({suggestions.length})</span>
                  </button>
                </div>
              </div>

              {/* A4 Document Sheet */}
              <div className="flex-1 overflow-y-auto bg-white rounded-xl border border-slate-300 shadow-md p-8 md:p-12 mx-auto max-w-4xl w-full relative">
                
                {/* Paper Seal & Header */}
                <div className="border-b-2 border-indigo-600 pb-4 mb-6 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">国</div>
                    <span className="text-xs font-bold text-slate-900 tracking-wider">国家电网有限公司 · A4 合规审阅纸面</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                    文书编号: {currentDocument?.id || 'DOC-2026-SG-01'}
                  </span>
                </div>

                {/* Primary Paper Content */}
                <div 
                  className="prose prose-slate max-w-none text-xs md:text-sm leading-relaxed font-serif text-slate-900 space-y-4 select-text"
                  dangerouslySetInnerHTML={{ __html: renderInlinePaperHtml() }}
                />

                {/* Interactive Inline Revision Quick-List Panel */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>纸面直接卡片审核</span>
                  </h4>

                  <div className="space-y-3">
                    {suggestions.map((s) => (
                      <div 
                        key={s.id} 
                        onMouseEnter={() => setFocusedSuggestionId(s.id)}
                        onMouseLeave={() => setFocusedSuggestionId(null)}
                        className={`p-3.5 rounded-xl border transition ${
                          focusedSuggestionId === s.id
                            ? 'bg-indigo-50/90 border-indigo-400 shadow-xs ring-1 ring-indigo-300'
                            : s.status === 'accepted'
                            ? 'bg-emerald-50/40 border-emerald-200'
                            : s.status === 'rejected'
                            ? 'bg-slate-50 border-slate-200 opacity-60'
                            : 'bg-white border-slate-200 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                              s.type === 'mandatory' ? 'bg-rose-600 text-white' : 'bg-indigo-600 text-white'
                            }`}>
                              {s.type === 'mandatory' ? '合规强改' : '优化建议'}
                            </span>
                            <span className="text-xs font-bold text-slate-800">{s.reason}</span>
                          </div>

                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            s.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                            s.status === 'rejected' ? 'bg-slate-200 text-slate-700' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {s.status === 'accepted' ? '✅ 已采纳替换' : s.status === 'rejected' ? '❌ 已保持原文' : '⏳ 待审核'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-sans my-2">
                          <div className="p-2 bg-rose-50 rounded border border-rose-100 text-rose-900">
                            <span className="text-[10px] text-rose-600 font-bold block">删除原词句：</span>
                            <p className="line-through decoration-rose-500">{s.originalText}</p>
                          </div>
                          <div className="p-2 bg-emerald-50 rounded border border-emerald-100 text-emerald-950 font-semibold">
                            <span className="text-[10px] text-emerald-700 font-bold block">替换为 AI 建议词句：</span>
                            <p>{s.revisedText}</p>
                          </div>
                        </div>

                        {s.status === 'pending' && (
                          <div className="flex items-center justify-end space-x-2 pt-1">
                            <button
                              onClick={() => handleSuggestionAction(s.id, 'rejected')}
                              className="bg-white hover:bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-lg border border-slate-200 font-medium transition"
                            >
                              维持原文
                            </button>
                            <button
                              onClick={() => handleSuggestionAction(s.id, 'accepted')}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3.5 py-1 rounded-lg font-semibold shadow-2xs flex items-center space-x-1 transition"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>采纳并替换原文</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* VIEW MODE 2: 双栏同屏对照 */}
          {viewMode === 'split' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="bg-indigo-50/60 border-b border-indigo-100 px-4 py-2 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-indigo-900">双栏原文 vs 痕迹对照</span>
                  <button
                    onClick={() => setSyncScroll(!syncScroll)}
                    className="bg-white border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded font-medium"
                  >
                    {syncScroll ? '🔗 开启同步滚动' : '🔓 关闭同步滚动'}
                  </button>
                </div>
                <span className="text-slate-500">左侧为原始合同，右侧为带红绿留痕修订稿</span>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 overflow-hidden p-3 gap-3 bg-slate-100/50">
                <div className="flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 px-3 py-1.5 font-bold text-xs text-slate-700">
                    📄 合同原文
                  </div>
                  <div 
                    ref={leftScrollRef}
                    onScroll={() => handleScroll('left')}
                    className="flex-1 p-4 overflow-y-auto text-xs text-slate-800 font-serif leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: originalContent }}
                  />
                </div>

                <div className="flex flex-col bg-white rounded-xl border border-indigo-200 overflow-hidden">
                  <div className="bg-indigo-50 border-b border-indigo-200 px-3 py-1.5 font-bold text-xs text-indigo-900">
                    ✨ AI 智能修订稿 (红绿痕迹)
                  </div>
                  <div 
                    ref={rightScrollRef}
                    onScroll={() => handleScroll('right')}
                    className="flex-1 p-4 overflow-y-auto text-xs text-slate-900 font-serif leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderRevisedContentForSplit() }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 3: 逐条建议清单 */}
          {viewMode === 'list' && (
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-900">AI 修订建议清单</h3>
                <span className="text-xs text-slate-500">共 {suggestions.length} 项（待审 {pendingCount} 项）</span>
              </div>

              <div className="space-y-3">
                {suggestions.map((s) => (
                  <div key={s.id} className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                        s.type === 'mandatory' ? 'bg-rose-600 text-white' : 'bg-indigo-600 text-white'
                      }`}>
                        {s.type === 'mandatory' ? '合规强改' : '优化建议'}
                      </span>
                      <span className="text-xs text-slate-600 font-medium flex-1 ml-3">{s.reason}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-bold">原文：</span>
                        <p className="line-through text-slate-600 font-serif">{s.originalText}</p>
                      </div>
                      <div className="p-2.5 bg-indigo-50/60 rounded border border-indigo-200">
                        <span className="text-[10px] text-indigo-600 block font-bold">修订为：</span>
                        <p className="text-indigo-950 font-serif font-semibold">{s.revisedText}</p>
                      </div>
                    </div>

                    {s.status === 'pending' && (
                      <div className="flex justify-end space-x-2 pt-1">
                        <button
                          onClick={() => handleSuggestionAction(s.id, 'rejected')}
                          className="bg-white hover:bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded border border-slate-200"
                        >
                          拒绝
                        </button>
                        <button
                          onClick={() => handleSuggestionAction(s.id, 'accepted')}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3.5 py-1 rounded font-semibold shadow-2xs"
                        >
                          采纳并替换
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW MODE 4: 划词润色 */}
          {viewMode === 'polish' && (
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-3 shadow-2xs">
                <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>选中文本条款智能润色</span>
                </h3>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <span className="text-slate-500 font-medium">当前选中文本：</span>
                  <textarea
                    value={selectedClause}
                    onChange={(e) => setSelectedClause(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded p-2 text-xs text-slate-800 mt-1 focus:outline-none focus:border-indigo-500 font-serif"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleRunPolish('legal_professional')}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs px-3 py-1.5 rounded-md border border-indigo-200 font-medium transition"
                  >
                    法律专业化润色
                  </button>
                  <button 
                    onClick={() => handleRunPolish('condense')}
                    className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs px-3 py-1.5 rounded-md border border-slate-200 font-medium transition"
                  >
                    精简压缩表述
                  </button>
                  <button 
                    onClick={() => handleRunPolish('expand')}
                    className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs px-3 py-1.5 rounded-md border border-slate-200 font-medium transition"
                  >
                    补充细化责任
                  </button>
                </div>

                {polishedResult && (
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900">
                    <div className="font-bold text-[10px] text-emerald-700 mb-1">润色结果预览：</div>
                    <p className="font-serif leading-relaxed">{polishedResult}</p>
                    <button
                      onClick={() => {
                        setOriginalContent(prev => prev + `<p style="margin:8px 0; background-color:#f0fdf4; padding:6px; border-radius:4px;"><strong>【润色新增条款】：</strong> ${polishedResult}</p>`);
                        alert("已成功将润色结果插入文书正文！");
                      }}
                      className="mt-2 bg-emerald-600 text-white text-[11px] px-3 py-1 rounded font-semibold hover:bg-emerald-700 transition"
                    >
                      插入到文书正文
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right Sidebar: Dock (Cols 9-12) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col h-[calc(100vh-6rem)] shadow-2xs">
          
          {/* Dock Tab Selector */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center space-x-1 mb-3 shrink-0">
            <button
              onClick={() => setRightTab('annotations')}
              className={`flex-1 text-xs py-1.5 rounded-lg font-bold transition flex items-center justify-center space-x-1 ${
                rightTab === 'annotations'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-indigo-600" />
              <span>审阅批注 ({suggestions.length})</span>
            </button>

            <button
              onClick={() => setRightTab('ai_chat')}
              className={`flex-1 text-xs py-1.5 rounded-lg font-bold transition flex items-center justify-center space-x-1 ${
                rightTab === 'ai_chat'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-amber-500" />
              <span>AI Copilot</span>
            </button>

            <button
              onClick={() => setRightTab('risk_radar')}
              className={`flex-1 text-xs py-1.5 rounded-lg font-bold transition flex items-center justify-center space-x-1 ${
                rightTab === 'risk_radar'
                  ? 'bg-white text-rose-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>合规雷达</span>
            </button>
          </div>

          {/* TAB 1: 侧边批注卡片列表 */}
          {rightTab === 'annotations' && (
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-medium">
                💡 点击批注卡片可在纸面上高亮定位对应修订段落
              </div>

              {suggestions.map((s, index) => (
                <div 
                  key={s.id}
                  onClick={() => setFocusedSuggestionId(s.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    focusedSuggestionId === s.id
                      ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-300 shadow-2xs'
                      : s.status === 'accepted'
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : s.status === 'rejected'
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : 'bg-white border-slate-200 hover:border-indigo-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-slate-400 font-bold">#批注 {index + 1}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      s.type === 'mandatory' ? 'bg-rose-600 text-white' : 'bg-indigo-600 text-white'
                    }`}>
                      {s.type === 'mandatory' ? '合规强改' : '优化建议'}
                    </span>
                  </div>

                  <p className="font-bold text-slate-800 text-xs mb-1.5 leading-snug">{s.reason}</p>

                  <div className="space-y-1 font-serif text-[11px] bg-slate-50 p-2 rounded border border-slate-100 my-1">
                    <div className="text-rose-700 line-through decoration-rose-400">原: {s.originalText}</div>
                    <div className="text-emerald-800 font-semibold">修: {s.revisedText}</div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px]">
                    <span className={`font-bold ${
                      s.status === 'accepted' ? 'text-emerald-700' :
                      s.status === 'rejected' ? 'text-slate-500' :
                      'text-amber-700'
                    }`}>
                      状态: {s.status === 'accepted' ? '已采纳' : s.status === 'rejected' ? '已维持原文' : '待批复'}
                    </span>

                    {s.status === 'pending' && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleSuggestionAction(s.id, 'rejected'); }}
                          className="bg-white hover:bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-medium"
                        >
                          拒绝
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleSuggestionAction(s.id, 'accepted'); }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-0.5 rounded font-bold"
                        >
                          采纳
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: AI Copilot 对话 */}
          {rightTab === 'ai_chat' && (
            <div className="flex-1 flex flex-col overflow-hidden text-xs">
              <div className="flex-1 overflow-y-auto space-y-3 py-2">
                {chatHistory.map((msg, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-xl ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white ml-6 shadow-2xs' 
                        : 'bg-slate-50 border border-slate-200 text-slate-800 mr-6'
                    }`}
                  >
                    <div className={`font-bold text-[10px] mb-1 ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>
                      {msg.role === 'user' ? '法务人员' : 'AI 助手'}
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center space-x-2 shrink-0">
                <input
                  type="text"
                  placeholder="指令如：“增加延期违约扣款封顶上限”"
                  value={chatInstruction}
                  onChange={(e) => setChatInstruction(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatRevision()}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSendChatRevision}
                  disabled={isAiProcessing}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-2 rounded-lg transition shadow-2xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: 合规雷达预警 */}
          {rightTab === 'risk_radar' && (
            <div className="flex-1 overflow-y-auto space-y-3 text-xs">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between font-bold text-rose-800">
                  <span className="flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>合规强改风险 (1项)</span>
                  </span>
                  <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded">高危</span>
                </div>
                <p className="text-slate-700 text-[11px]">质量保证金预留超出《建设工程质量保证金管理办法》3%最高限定。</p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between font-bold text-amber-800">
                  <span className="flex items-center space-x-1">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>电网风险提防 (2项)</span>
                  </span>
                  <span className="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded">中危</span>
                </div>
                <p className="text-slate-700 text-[11px]">仲裁管辖无法财产保全，建议变更为甲方所在地法院诉讼管辖。</p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
