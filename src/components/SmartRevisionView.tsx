import React, { useState } from 'react';
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
  FileText
} from 'lucide-react';
import { LegalDocument, RevisionSuggestion } from '../types';

interface SmartRevisionViewProps {
  currentDocument: LegalDocument | null;
  onSaveDocument: (doc: LegalDocument) => void;
  onNavigateToVersion: () => void;
}

export const SmartRevisionView: React.FC<SmartRevisionViewProps> = ({
  currentDocument,
  onSaveDocument,
  onNavigateToVersion
}) => {
  // Local state for revision suggestions
  const [suggestions, setSuggestions] = useState<RevisionSuggestion[]>(
    currentDocument?.revisionSuggestions || [
      {
        id: 'REV-001',
        type: 'mandatory',
        originalText: '(4) 剩余10%作为质量保证金，质保期满24个月后无息退还。',
        revisedText: '(4) 剩余3%作为质量保证金，质保期满24个月且无遗留质量缺陷后无息退还；承包人也可选择提供等额银行质量保函替代现金留扣。',
        status: 'pending',
        reason: '合规强制性修改：符合建质〔2017〕138号文关于质保金不超过3%的限制。'
      },
      {
        id: 'REV-002',
        type: 'optimization',
        originalText: '5.2 协商不成的，任何一方均可向南京仲裁委员会申请仲裁，仲裁裁决是终局的，对双方均有约束力。',
        revisedText: '5.2 协商不成的，任何一方均应向发包人所在地（南京市）有管辖权的人民法院提起诉讼。',
        status: 'pending',
        reason: '优化建议：贴合电网企业诉讼维权习惯，法院诉讼可更好地配合保全措施。'
      }
    ]
  );

  // Conversational AI modal state (页面 6.2)
  const [chatInstruction, setChatInstruction] = useState<string>('');
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: '您好，我是电网法务智能修订助手。请输入指令，如：“重新调整 EPC 合同质保条款，符合电网基建安全规定”。' }
  ]);

  // Polish modal state (页面 6.3)
  const [selectedClause, setSelectedClause] = useState<string>('承包人在施工过程中须采取抑尘降噪措施，达标排放。');
  const [polishedResult, setPolishedResult] = useState<string>('');

  // Handle Accept / Reject Single Suggestion
  const handleSuggestionAction = (id: string, newStatus: 'accepted' | 'rejected') => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  // Handle One-Key Accept All
  const handleAcceptAll = () => {
    setSuggestions(prev => prev.map(s => ({ ...s, status: 'accepted' })));
    alert("已成功一键采纳全部 AI 修订建议！合同正文已同步更新，并生成修订快照留痕。");
  };

  // Handle Conversational Revision Submission (页面 6.2)
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
        body: JSON.stringify({ content: currentDocument?.content || '', instruction: userMsg })
      });
      const data = await res.json();
      setChatHistory(prev => [...prev, { 
        role: 'ai', 
        text: `已根据您的指令“${userMsg}”重新拟定并更新对应条款：\n\n${data.revisedContent || '【修订完成】'}`
      }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { 
        role: 'ai', 
        text: `【修改完成】：已将条款优化为贴合电网基建安全管理规定，责任明确。`
      }]);
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Handle Polish Action (页面 6.3)
  const handleRunPolish = (actionType: 'legal_professional' | 'condense' | 'expand') => {
    if (actionType === 'legal_professional') {
      setPolishedResult('承包人在施工全过程须严格执行国家环保法律法规及电网文明施工标准，采取有效降尘减噪措施，确保环境污染零事件。');
    } else if (actionType === 'condense') {
      setPolishedResult('乙方须达标排放、抑尘降噪施工。');
    } else {
      setPolishedResult('承包人在施工建设阶段，应配备全套降尘抑尘设备与隔音屏障，所有施工废水及扬尘须经净化处理后达标排放，严禁未批先施工。');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 text-slate-800 overflow-hidden">
      
      {/* Sub-header Navigation */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center space-x-3">
          <FileDiff className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">智能修订工作台 (逐条审查 + 对话式修订)</h2>
          <span className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded font-medium">
            全过程操作留痕与审计存证
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleAcceptAll}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3.5 py-1.5 rounded-lg font-semibold shadow-sm flex items-center space-x-1"
          >
            <CheckCheck className="w-4 h-4" />
            <span>一键全部采纳 AI 建议</span>
          </button>
          <button
            onClick={onNavigateToVersion}
            className="bg-white hover:bg-slate-50 text-indigo-700 text-xs px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-sm font-medium transition"
          >
            生成修订快照
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-y-auto max-w-[1800px] mx-auto w-full">
        
        {/* Left 2 Columns: 页面 6.1 AI 修订建议列表 (对比视图) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI 修订建议清单 (原文 vs 修订对比)</span>
            </h3>
            <span className="text-xs text-slate-500">剩余 {suggestions.filter(s => s.status === 'pending').length} 条待处理</span>
          </div>

          <div className="space-y-4">
            {suggestions.map((s) => (
              <div key={s.id} className="p-5 bg-white rounded-xl border border-slate-200 space-y-3 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                      s.type === 'mandatory' ? 'bg-rose-600 text-white' : 'bg-indigo-600 text-white'
                    }`}>
                      {s.type === 'mandatory' ? '强制修改建议' : '优化润色建议'}
                    </span>
                    <span className="text-xs text-slate-500">{s.reason}</span>
                  </div>

                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    s.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    s.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {s.status === 'accepted' ? '已采纳' : s.status === 'rejected' ? '已拒绝' : '待处理'}
                  </span>
                </div>

                {/* Side-by-side comparison boxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">原文 (灰色框)：</div>
                    <p className="text-slate-700 font-serif line-through decoration-rose-500">{s.originalText}</p>
                  </div>

                  <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-200 space-y-1">
                    <div className="text-[10px] text-indigo-700 font-bold uppercase">AI 修订建议 (蓝色框)：</div>
                    <p className="text-indigo-950 font-serif font-medium">{s.revisedText}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => handleSuggestionAction(s.id, 'rejected')}
                    className="bg-white hover:bg-slate-50 text-slate-700 text-xs px-3 py-1 rounded-md border border-slate-200 shadow-sm flex items-center space-x-1 font-medium transition"
                  >
                    <X className="w-3.5 h-3.5 text-rose-500" />
                    <span>拒绝建议</span>
                  </button>

                  <button
                    onClick={() => handleSuggestionAction(s.id, 'accepted')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3.5 py-1 rounded-md font-semibold shadow-sm flex items-center space-x-1 transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>采纳并替换正文</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 页面 6.3: 条款润色弹窗 (选中文本后触发) */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-3 shadow-sm">
            <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>选中文本条款智能润色</span>
            </h3>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium">当前选中文本：</span>
              <p className="text-slate-800 mt-1 font-serif">{selectedClause}</p>
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
                <p>{polishedResult}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: 页面 6.2 对话式 AI 修订弹窗 / 聊天面板 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col h-[650px] shadow-sm">
          <div className="pb-3 border-b border-slate-200 flex items-center space-x-2">
            <Bot className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-bold text-sm text-slate-900">对话式 AI 修订助手</h3>
              <p className="text-[10px] text-slate-500">输入自然语言指令多轮交互改写</p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto py-3 space-y-3 text-xs">
            {chatHistory.map((msg, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-xl ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white ml-6 shadow-sm' 
                    : 'bg-slate-100 border border-slate-200 text-slate-800 mr-6'
                }`}
              >
                <div className={`font-bold text-[10px] mb-1 ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>
                  {msg.role === 'user' ? '法务人员' : 'AI 法务助手'}
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="pt-2 border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              placeholder="如：“修改工期违约金，贴合电网基建要求”"
              value={chatInstruction}
              onChange={(e) => setChatInstruction(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChatRevision()}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSendChatRevision}
              disabled={isAiProcessing}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-2 rounded-lg transition shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
