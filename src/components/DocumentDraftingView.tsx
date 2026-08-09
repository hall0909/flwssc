import React, { useState } from 'react';
import { WordRichTextEditor } from './WordRichTextEditor';
import { 
  Plus, 
  Save, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  FileDiff, 
  Archive, 
  Download, 
  Upload, 
  Search, 
  Star, 
  FolderTree, 
  Check, 
  X, 
  Edit3, 
  Copy, 
  Trash2, 
  Info,
  BookOpen,
  Send,
  HelpCircle,
  FileText
} from 'lucide-react';
import { 
  LegalDocument, 
  DocumentCategory, 
  FormFields, 
  KnowledgeItem,
  ComplianceIssue,
  RiskItem,
  RevisionSuggestion
} from '../types';
import { formatContractContentToHtml } from '../utils/contractFormatter';
import { DOCUMENT_CATEGORIES } from '../data/mockData';

interface DocumentDraftingViewProps {
  currentDocument: LegalDocument | null;
  allDocuments: LegalDocument[];
  onSaveDocument: (doc: LegalDocument) => void;
  onSelectDocument: (doc: LegalDocument) => void;
  onCreateNewDocument: (category: DocumentCategory, subType: string, mode: 'form' | 'blank' | 'ai') => void;
  onDeleteDocument: (docId: string) => void;
  knowledgeBase: KnowledgeItem[];
  aiEnabled: boolean;
  onOpenAIDisclaimer: () => void;
  onTriggerComplianceCheck: (doc: LegalDocument) => void;
  onTriggerRiskIdentify: (doc: LegalDocument) => void;
  onNavigateToRevision: () => void;
  onNavigateToVersion: () => void;
  demoTime?: number;
}

export const DocumentDraftingView: React.FC<DocumentDraftingViewProps> = ({
  currentDocument,
  allDocuments,
  onSaveDocument,
  onSelectDocument,
  onCreateNewDocument,
  onDeleteDocument,
  knowledgeBase,
  aiEnabled,
  onOpenAIDisclaimer,
  onTriggerComplianceCheck,
  onTriggerRiskIdentify,
  onNavigateToRevision,
  onNavigateToVersion,
  demoTime
}) => {
  // Guide Modal state
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  // Page mode state inside Drafting module: 'selector' | 'form_fill' | 'editor' | 'draft_list'
  const [pageMode, setPageMode] = useState<'selector' | 'form_fill' | 'editor' | 'draft_list'>(
    currentDocument ? 'editor' : 'selector'
  );

  // Selection modal state
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>('power_engineering');
  const [selectedSubType, setSelectedSubType] = useState<string>('epc');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>(['epc', 'equipment']);

  // Local Form State for guided form filling
  const [formFields, setFormFields] = useState<FormFields>({
    partyA: '国网江苏省电力有限公司',
    partyB: '',
    creditCodeA: '91320000134769018A',
    creditCodeB: '',
    projectTarget: '',
    amount: 0,
    taxRate: 9,
    startDate: '',
    endDate: '',
    location: '',
    qualityPeriod: '24个月',
    paymentNodes: '预付款20%，按月进度款支付至75%，工程竣工验收付至90%，3%质保金',
    breachTerms: '工期延误每日支付合同价0.05%违约金，封顶10%',
    disputeResolution: '向甲方所在地人民法院提起诉讼',
    safetyResponsibility: '承包人全面承担施工现场安全主体责任，遵守电网反违章规定'
  });

  // Form error states for logical validation
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Editor states
  const [editorContent, setEditorContent] = useState<string>(
    formatContractContentToHtml(currentDocument?.content || '')
  );
  const [activeRightTab, setActiveRightTab] = useState<'fields' | 'kb' | 'compliance' | 'risk' | 'suggestions'>('fields');
  const [kbSearch, setKbSearch] = useState<string>('');
  const [aiPromptInput, setAiPromptInput] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [demoInsertedKb, setDemoInsertedKb] = useState<boolean>(false);

  // Sync with Demo Timeline
  React.useEffect(() => {
    if (demoTime !== undefined) {
      if (demoTime >= 25 && demoTime < 32) {
        setPageMode('selector');
        setSelectedCategory('power_engineering');
        setSelectedSubType('epc');
        setDemoInsertedKb(false);
      } else if (demoTime >= 32 && demoTime < 41) {
        setPageMode('form_fill');
        setFormFields({
          partyA: '国网江苏省电力有限公司',
          partyB: '华东电力建设工程总公司',
          creditCodeA: '91320000134769018A',
          creditCodeB: '91310000100028912C',
          projectTarget: '110kV输变电新建工程EPC总承包合同',
          amount: 3200,
          taxRate: 9,
          startDate: '2026-09-01',
          endDate: '2027-08-31',
          location: '发包方指定南京现场',
          qualityPeriod: '24个月',
          paymentNodes: '预付款20%，按进度款付至75%，竣工验收付至90%，留扣5%质量保证金',
          breachTerms: '工期延误每日按合同价0.05%支付违约金',
          disputeResolution: '向南京仲裁委员会申请仲裁',
          safetyResponsibility: '承包人全面承担施工现场安全主体责任，贯彻电网反违章规则'
        });
      } else if (demoTime >= 41 && demoTime < 51) {
        setPageMode('editor');
      } else if (demoTime >= 51 && demoTime < 76) {
        setPageMode('editor');
        setActiveRightTab('kb');
        setKbSearch('反违章');
        if (!demoInsertedKb) {
          const aiBlock = `<p style="margin: 12px 0; padding: 10px 14px; background-color: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 4px; color: #14532d;"><strong>【AI 自动插入电网示范条款】</strong> 乙方必须严格贯彻国家电网《安全生产反违章管理办法》，对施工现场负全面安全生产责任，严格执行配电作业双票制度。</p>`;
          setEditorContent(prev => prev.includes('反违章管理办法') ? prev : prev + aiBlock);
          setDemoInsertedKb(true);
        }
      } else if (demoTime >= 76 && demoTime < 102) {
        setPageMode('editor');
      }
    }
  }, [demoTime, demoInsertedKb]);

  // Sync state if currentDocument changes externally
  React.useEffect(() => {
    if (currentDocument) {
      setEditorContent(formatContractContentToHtml(currentDocument.content));
      setFormFields(currentDocument.formFields);
    }
  }, [currentDocument]);

  // Handle Form Validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formFields.partyB) errors.partyB = '乙方名称不能为空';
    if (!formFields.projectTarget) errors.projectTarget = '业务标的/工程名称不能为空';
    if (formFields.amount <= 0) errors.amount = '合同金额必须大于0';
    if (formFields.startDate && formFields.endDate && formFields.startDate > formFields.endDate) {
      errors.endDate = '工期结束时间不能早于开始时间';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create document handler
  const handleStartCreation = (mode: 'form' | 'blank' | 'ai') => {
    if (mode === 'form') {
      setPageMode('form_fill');
    } else {
      onCreateNewDocument(selectedCategory, selectedSubType, mode);
      setPageMode('editor');
    }
  };

  // Form Submit Handler
  const handleFormSubmit = () => {
    if (!validateForm()) return;
    onCreateNewDocument(selectedCategory, selectedSubType, 'form');
    setPageMode('editor');
  };

  // Insert KB Clause into Editor
  const handleInsertClause = (clauseText: string) => {
    const formattedClause = `<p style="margin: 12px 0; padding: 10px 14px; background-color: #f8fafc; border-left: 3px solid #4f46e5; border-radius: 4px;"><strong>【补充知识条文】</strong> ${clauseText}</p>`;
    setEditorContent(prev => prev + formattedClause);
  };

  // Natural Language AI Text Generation inside Editor
  const handleRunAiGeneration = async () => {
    if (!aiPromptInput.trim()) return;
    setIsGeneratingAi(true);

    try {
      const res = await fetch('/api/ai/chat-revise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editorContent, instruction: aiPromptInput })
      });
      const data = await res.json();
      if (data.revisedContent) {
        setEditorContent(data.revisedContent);
        setAiPromptInput('');
      }
    } catch (e) {
      console.error(e);
      const aiBlockHtml = `<div style="background-color: #f0f9ff; border: 1px solid #bae6fd; padding: 12px 16px; border-radius: 8px; margin: 12px 0;"><div style="display: flex; align-items: center; margin-bottom: 4px; font-weight: bold; font-size: 12px; color: #0369a1;">✨ 【AI 智能生成条款】（指令: ${aiPromptInput}）</div><p style="font-size: 13px; color: #0c4a6e; margin: 0;">承包人须严格贯彻电网建设工程合规与安全防护标准，落实国家电网《反违章管理办法》，保障全流程作业安全与数据留痕。</p></div>`;
      setEditorContent(prev => prev + aiBlockHtml);
      setAiPromptInput('');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 text-slate-800 overflow-hidden">
      
      {/* Drafting Header Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setPageMode('selector')}
              className={`px-3 py-1 rounded text-xs font-medium transition ${pageMode === 'selector' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              新建选择
            </button>
            <button
              onClick={() => setPageMode('form_fill')}
              className={`px-3 py-1 rounded text-xs font-medium transition ${pageMode === 'form_fill' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              表单填报
            </button>
            <button
              onClick={() => setPageMode('editor')}
              className={`px-3 py-1 rounded text-xs font-medium transition ${pageMode === 'editor' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              在线编辑主页
            </button>
            <button
              onClick={() => setPageMode('draft_list')}
              className={`px-3 py-1 rounded text-xs font-medium transition ${pageMode === 'draft_list' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              草稿列表 ({allDocuments.length})
            </button>
          </div>

          {currentDocument && (
            <span className="text-xs text-indigo-700 font-semibold bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded">
              当前文书: {currentDocument.title}
            </span>
          )}
        </div>

        {/* Global AI Disclaimer Note & Guide Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowGuideModal(true)}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full border border-indigo-200 flex items-center space-x-1 font-semibold shadow-xs transition"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>智能编写操作指南</span>
          </button>

          <div className="hidden lg:flex items-center space-x-2 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-medium">
            <Info className="w-3.5 h-3.5 text-amber-600" />
            <span>所有 AI 自动生成的文书段落均标有浅蓝底色，需法务人员人工审核确认</span>
          </div>
        </div>
      </div>

      {/* ==================== 页面 3.1: 文书新建选择页 ==================== */}
      {pageMode === 'selector' && (
        <div className="flex-1 overflow-y-auto p-6 max-w-[1600px] mx-auto w-full space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <FolderTree className="w-5 h-5 text-indigo-600" />
                <span>文书新建选择页</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                选择电网五大类核心法律文书，可置顶或收藏高频范本，选择【表单引导生成】/【空白范本】/【AI撰写】模式
              </p>
            </div>

            {/* Search Box */}
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="搜索工程合同、采购协议、催告函范本..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 text-xs text-slate-800 pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Left Category Tree Navigation */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">五大类文书分类 Tree</div>
              {DOCUMENT_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => {
                      setSelectedCategory(cat.key);
                      setSelectedSubType(cat.subTypes[0]?.key || '');
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                      isSelected 
                        ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-normal">
                      {cat.subTypes.length}二级场景
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Sub-types & Templates Grid */}
            <div className="md:col-span-3 space-y-4">
              <h3 className="text-sm font-bold text-slate-800">
                {DOCUMENT_CATEGORIES.find(c => c.key === selectedCategory)?.label} - 细分二级场景
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DOCUMENT_CATEGORIES
                  .find(c => c.key === selectedCategory)
                  ?.subTypes.map((st) => {
                    const isSubSelected = selectedSubType === st.key;
                    const isFav = favorites.includes(st.key);

                    return (
                      <div 
                        key={st.key}
                        onClick={() => setSelectedSubType(st.key)}
                        className={`p-4 rounded-xl border transition cursor-pointer relative shadow-sm ${
                          isSubSelected 
                            ? 'bg-white border-indigo-500 ring-2 ring-indigo-500/20' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                            <span>{st.label}</span>
                            {isFav && (
                              <span className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded border border-amber-200 font-semibold">
                                置顶范本
                              </span>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFavorites(prev => 
                                prev.includes(st.key) ? prev.filter(k => k !== st.key) : [...prev, st.key]
                              );
                            }}
                            className="p-1 text-slate-400 hover:text-amber-500"
                            title="收藏/置顶模板"
                          >
                            <Star className={`w-4 h-4 ${isFav ? 'text-amber-500 fill-amber-500' : ''}`} />
                          </button>
                        </div>

                        <p className="text-xs text-slate-500 mt-1">{st.description}</p>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSubType(st.key);
                              handleStartCreation('form');
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium shadow-sm flex items-center space-x-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>表单引导生成</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSubType(st.key);
                              handleStartCreation('blank');
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded-lg border border-slate-200 flex items-center space-x-1 font-medium"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>空白范本生成</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSubType(st.key);
                              handleStartCreation('ai');
                            }}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs px-3 py-1.5 rounded-lg border border-amber-200 flex items-center space-x-1 font-medium"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>自然语言AI生成</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==================== 页面 3.2: 引导式表单填写页 ==================== */}
      {pageMode === 'form_fill' && (
        <div className="flex-1 overflow-y-auto p-6 max-w-[1200px] mx-auto w-full space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-indigo-600" />
                <span>引导式表单填写（电网业务专属字段）</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                预置结构化表单：主体代码、标的金额、工期时间、质保金、付款节点与工程安全责任划分
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPageMode('selector')}
                className="bg-white hover:bg-slate-50 text-slate-700 text-xs px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm font-medium"
              >
                返回选择
              </button>
              <button
                onClick={handleFormSubmit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-1.5 rounded-lg font-semibold shadow-sm flex items-center space-x-1"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>一键填充模板并生成文书初稿</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-sm">
            
            {/* Section 1: 甲乙双方主体信息 */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider border-l-2 border-indigo-600 pl-2">
                1. 甲乙双方主体基本信息
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">甲方（电网单位）名称 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={formFields.partyA}
                    onChange={(e) => setFormFields({ ...formFields, partyA: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">甲方统一社会信用代码</label>
                  <input
                    type="text"
                    value={formFields.creditCodeA}
                    onChange={(e) => setFormFields({ ...formFields, creditCodeA: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">乙方（承包商/供应商）名称 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    placeholder="请输入乙方全称"
                    value={formFields.partyB}
                    onChange={(e) => {
                      setFormFields({ ...formFields, partyB: e.target.value });
                      if (formErrors.partyB) setFormErrors({ ...formErrors, partyB: '' });
                    }}
                    className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none ${
                      formErrors.partyB ? 'border-rose-500' : 'border-slate-200'
                    }`}
                  />
                  {formErrors.partyB && <p className="text-[10px] text-rose-500 mt-1">{formErrors.partyB}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">乙方统一社会信用代码</label>
                  <input
                    type="text"
                    placeholder="91310000XXXXXXXXXX"
                    value={formFields.creditCodeB}
                    onChange={(e) => setFormFields({ ...formFields, creditCodeB: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: 业务标的、金额、工期 */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider border-l-2 border-indigo-600 pl-2">
                2. 业务标的、合同金额与履行工期
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-slate-700 mb-1">业务标的/工程项目全称 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    placeholder="例如：南京南郊110kV输变电新建工程EPC总承包"
                    value={formFields.projectTarget}
                    onChange={(e) => {
                      setFormFields({ ...formFields, projectTarget: e.target.value });
                      if (formErrors.projectTarget) setFormErrors({ ...formErrors, projectTarget: '' });
                    }}
                    className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none ${
                      formErrors.projectTarget ? 'border-rose-500' : 'border-slate-200'
                    }`}
                  />
                  {formErrors.projectTarget && <p className="text-[10px] text-rose-500 mt-1">{formErrors.projectTarget}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">合同金额 (万元) <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    value={formFields.amount}
                    onChange={(e) => setFormFields({ ...formFields, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">适用税率 (%)</label>
                  <input
                    type="number"
                    value={formFields.taxRate}
                    onChange={(e) => setFormFields({ ...formFields, taxRate: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">履行地点/施工场地</label>
                  <input
                    type="text"
                    placeholder="例如：江苏省南京市江宁区"
                    value={formFields.location}
                    onChange={(e) => setFormFields({ ...formFields, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">工期/服务开始时间</label>
                  <input
                    type="date"
                    value={formFields.startDate}
                    onChange={(e) => setFormFields({ ...formFields, startDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">工期/服务结束时间</label>
                  <input
                    type="date"
                    value={formFields.endDate}
                    onChange={(e) => {
                      setFormFields({ ...formFields, endDate: e.target.value });
                      if (formErrors.endDate) setFormErrors({ ...formErrors, endDate: '' });
                    }}
                    className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none ${
                      formErrors.endDate ? 'border-rose-500' : 'border-slate-200'
                    }`}
                  />
                  {formErrors.endDate && <p className="text-[10px] text-rose-500 mt-1">{formErrors.endDate}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">质保期限</label>
                  <input
                    type="text"
                    value={formFields.qualityPeriod}
                    onChange={(e) => setFormFields({ ...formFields, qualityPeriod: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: 违约、争端与电网工程专属条款 */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider border-l-2 border-indigo-600 pl-2">
                3. 付款节点、违约责任与电网安全责任划分（专属字段）
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">付款节点与质保金条款</label>
                  <textarea
                    rows={2}
                    value={formFields.paymentNodes}
                    onChange={(e) => setFormFields({ ...formFields, paymentNodes: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">违约责任与工期延误处罚</label>
                  <textarea
                    rows={2}
                    value={formFields.breachTerms}
                    onChange={(e) => setFormFields({ ...formFields, breachTerms: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">争议解决管道 (专有管辖)</label>
                  <input
                    type="text"
                    value={formFields.disputeResolution}
                    onChange={(e) => setFormFields({ ...formFields, disputeResolution: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">工程安全责任划分（电网红线专项）</label>
                  <input
                    type="text"
                    value={formFields.safetyResponsibility}
                    onChange={(e) => setFormFields({ ...formFields, safetyResponsibility: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==================== 页面 3.3: 文书在线编辑主页面 (核心) ==================== */}
      {pageMode === 'editor' && (
        <div className="flex-1 flex overflow-hidden">
          
          {/* Main Document Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-200">
            
            {/* AI Text Generator Action Bar */}
            <div className="bg-indigo-50/60 border-b border-indigo-100 px-4 py-2 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <input
                type="text"
                placeholder="自然语言 AI 撰写/修订单条指令（例如：“重新调整 EPC 合同质保条款，符合电网基建安全规定”）..."
                value={aiPromptInput}
                onChange={(e) => setAiPromptInput(e.target.value)}
                className="flex-1 bg-white border border-indigo-200 text-xs text-slate-800 px-3 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500 shadow-sm"
              />
              <button
                onClick={handleRunAiGeneration}
                disabled={isGeneratingAi}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition flex items-center space-x-1 shrink-0 shadow-sm"
              >
                {isGeneratingAi ? <span>AI思考撰写中...</span> : <span>生成/更新条款</span>}
              </button>
            </div>

            {/* Quick Tool Navigation Buttons */}
            <div className="bg-white px-4 py-1.5 border-b border-slate-200 flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => currentDocument && onTriggerComplianceCheck(currentDocument)}
                  className={`bg-slate-50 hover:bg-slate-100 text-indigo-700 text-xs px-2.5 py-1 rounded border border-indigo-200 flex items-center space-x-1 font-medium transition ${
                    demoTime !== undefined && demoTime >= 76 && demoTime < 102 ? 'ring-2 ring-indigo-500 bg-indigo-50 animate-pulse scale-105' : ''
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>合规一键校验</span>
                </button>

                <button
                  onClick={() => currentDocument && onTriggerRiskIdentify(currentDocument)}
                  className={`bg-slate-50 hover:bg-slate-100 text-amber-800 text-xs px-2.5 py-1 rounded border border-amber-200 flex items-center space-x-1 font-medium transition ${
                    demoTime !== undefined && demoTime >= 76 && demoTime < 102 ? 'ring-2 ring-amber-500 bg-amber-50 animate-pulse scale-105' : ''
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>风险一键识别</span>
                </button>

                <button
                  onClick={onNavigateToRevision}
                  className="bg-slate-50 hover:bg-slate-100 text-blue-700 text-xs px-2.5 py-1 rounded border border-blue-200 flex items-center space-x-1 font-medium"
                >
                  <FileDiff className="w-3.5 h-3.5 text-blue-600" />
                  <span>智能修订工作台</span>
                </button>

                <button
                  onClick={onNavigateToVersion}
                  className="bg-slate-50 hover:bg-slate-100 text-teal-700 text-xs px-2.5 py-1 rounded border border-teal-200 flex items-center space-x-1 font-medium"
                >
                  <Archive className="w-3.5 h-3.5 text-teal-600" />
                  <span>版本快照对照</span>
                </button>
              </div>
            </div>

            {/* Full Word Rich Text Editor Frame */}
            <div className="flex-1 overflow-hidden p-2 bg-slate-100">
              <WordRichTextEditor
                value={editorContent}
                onChange={(newHtml) => setEditorContent(newHtml)}
                formFields={formFields}
                documentTitle={currentDocument?.title}
                onSave={() => onSaveDocument({
                  ...currentDocument!,
                  content: editorContent,
                  formFields
                })}
                onExportWord={() => alert("系统已成功导出 Word 格式文档 (带电网防伪水印)")}
                onExportPdf={() => alert("系统已成功导出 PDF 格式文档 (带有电网内部涉密水印)")}
              />
            </div>

          </div>

          {/* Right Side Inspection Tabs (辅助标签面板) */}
          <div className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0">
            
            {/* Tabs Header */}
            <div className="flex border-b border-slate-200 text-[11px] font-medium bg-slate-50">
              <button
                onClick={() => setActiveRightTab('fields')}
                className={`flex-1 py-2.5 text-center border-b-2 transition ${activeRightTab === 'fields' ? 'border-indigo-600 text-indigo-600 font-bold bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                参数总览
              </button>
              <button
                onClick={() => setActiveRightTab('kb')}
                className={`flex-1 py-2.5 text-center border-b-2 transition ${activeRightTab === 'kb' ? 'border-indigo-600 text-indigo-600 font-bold bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                知识条文
              </button>
              <button
                onClick={() => setActiveRightTab('compliance')}
                className={`flex-1 py-2.5 text-center border-b-2 transition ${activeRightTab === 'compliance' ? 'border-indigo-600 text-indigo-600 font-bold bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                合规 ({currentDocument?.complianceIssues.length || 0})
              </button>
              <button
                onClick={() => setActiveRightTab('risk')}
                className={`flex-1 py-2.5 text-center border-b-2 transition ${activeRightTab === 'risk' ? 'border-indigo-600 text-indigo-600 font-bold bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                风险 ({currentDocument?.riskItems.length || 0})
              </button>
            </div>

            {/* Tab 1: Form Fields Summary */}
            {activeRightTab === 'fields' && (
              <div className="p-4 space-y-3 overflow-y-auto flex-1 text-xs">
                <div className="font-bold text-slate-800 pb-2 border-b border-slate-100">
                  表单参数快照（修改可同步更新）
                </div>
                <div className="space-y-2 text-slate-600">
                  <div><span className="text-slate-400">甲方：</span><span className="text-slate-800 font-medium">{formFields.partyA}</span></div>
                  <div><span className="text-slate-400">乙方：</span><span className="text-slate-800 font-medium">{formFields.partyB || '未填'}</span></div>
                  <div><span className="text-slate-400">标的：</span><span className="text-slate-800 font-medium">{formFields.projectTarget || '未填'}</span></div>
                  <div><span className="text-slate-400">金额：</span><span className="text-amber-600 font-bold">{formFields.amount} 万元</span></div>
                  <div><span className="text-slate-400">质保期：</span><span className="text-slate-800 font-medium">{formFields.qualityPeriod}</span></div>
                  <div><span className="text-slate-400">履行地点：</span><span className="text-slate-800 font-medium">{formFields.location || '未填'}</span></div>
                </div>
                <button
                  onClick={() => setPageMode('form_fill')}
                  className="w-full mt-3 bg-slate-100 hover:bg-slate-200 text-indigo-700 border border-indigo-200 rounded-lg py-1.5 font-medium shadow-sm transition"
                >
                  重新编辑结构化表单
                </button>
              </div>
            )}

            {/* Tab 2: Knowledge Base Quick Clause Insertion */}
            {activeRightTab === 'kb' && (
              <div className="p-3 space-y-3 overflow-y-auto flex-1 text-xs">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    placeholder="检索电网范本与条款..."
                    value={kbSearch}
                    onChange={(e) => setKbSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-[11px] text-slate-800 pl-8 pr-2 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  {knowledgeBase.map((item) => (
                    <div key={item.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <div className="font-semibold text-indigo-700 text-[11px]">{item.title}</div>
                      <p className="text-[10px] text-slate-500 line-clamp-2">{item.content}</p>
                      <button
                        onClick={() => handleInsertClause(item.content)}
                        className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-lg mt-1 font-medium transition"
                      >
                        + 一键插入条款至编辑器
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Compliance Issues */}
            {activeRightTab === 'compliance' && (
              <div className="p-3 space-y-3 overflow-y-auto flex-1 text-xs">
                {currentDocument?.complianceIssues.map((issue) => (
                  <div 
                    key={issue.id} 
                    className={`p-3 rounded-lg border ${
                      issue.level === 'mandatory' 
                        ? 'bg-rose-50 border-rose-200 text-rose-900' 
                        : 'bg-indigo-50 border-indigo-200 text-indigo-900'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-xs mb-1">
                      <span>{issue.title}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                        issue.level === 'mandatory' ? 'bg-rose-600 text-white' : 'bg-indigo-600 text-white'
                      }`}>
                        {issue.level === 'mandatory' ? '强制不合规' : '建议优化'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-normal">{issue.description}</p>
                    <div className="text-[10px] text-slate-500 mt-1">依据：{issue.basis}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 4: Risk List */}
            {activeRightTab === 'risk' && (
              <div className="p-3 space-y-3 overflow-y-auto flex-1 text-xs">
                {currentDocument?.riskItems.map((risk) => (
                  <div key={risk.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between font-bold text-xs">
                      <span className="text-slate-800">{risk.title}</span>
                      <span className="text-[9px] bg-rose-50 text-rose-700 px-1.5 py-0.2 rounded border border-rose-200 font-semibold">
                        {risk.level === 'critical' ? '严重风险' : '高风险'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">{risk.description}</p>
                    <div className="text-[10px] text-indigo-700 pt-1 font-medium">优化: {risk.optimization}</div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      )}

      {/* ==================== 页面 3.4: 草稿管理列表页 ==================== */}
      {pageMode === 'draft_list' && (
        <div className="flex-1 overflow-y-auto p-6 max-w-[1600px] mx-auto w-full space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>草稿管理列表页</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                保存未完成撰写草稿，支持草稿续编辑、删除（记录审计日志不可彻底抹除）、复制新建与批量导出
              </p>
            </div>

            <button
              onClick={() => setPageMode('selector')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3.5 py-1.5 rounded-lg font-medium shadow-sm flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>新建文书</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <th className="py-3 px-4 font-semibold">文书名称</th>
                  <th className="py-3 px-4 font-semibold">文书类型场景</th>
                  <th className="py-3 px-4 font-semibold">创建时间 / 操作人</th>
                  <th className="py-3 px-4 font-semibold">更新时间</th>
                  <th className="py-3 px-4 font-semibold">状态</th>
                  <th className="py-3 px-4 font-semibold text-right">草稿操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-semibold text-slate-800">{doc.title}</td>
                    <td className="py-3 px-4 text-slate-500">{doc.category} - {doc.subType}</td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{doc.createdBy}</div>
                      <div className="text-[10px] text-slate-400">{doc.createdAt}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{doc.updatedAt}</td>
                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200">
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          onSelectDocument(doc);
                          setPageMode('editor');
                        }}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-200 font-medium transition"
                      >
                        继续编辑
                      </button>
                      <button
                        onClick={() => onDeleteDocument(doc.id)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-2.5 py-1 rounded-lg border border-rose-200 font-medium transition"
                      >
                        删除记录
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== 智能编写简易操作指南弹窗 ==================== */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition"
            >
              ✕
            </button>

            <div className="flex items-center space-x-2.5 mb-4 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">文书智能编写 · 简易操作流程指南</h3>
                <p className="text-xs text-slate-500">国家电网标准法律文书一站式智能起草、校验与管理解析</p>
              </div>
            </div>

            <div className="space-y-3.5 my-4 text-xs text-slate-700 leading-relaxed max-h-[460px] overflow-y-auto pr-1">
              
              <div className="flex items-start space-x-3 bg-indigo-50/60 p-3 rounded-xl border border-indigo-100">
                <div className="bg-indigo-600 text-white rounded-lg w-6 h-6 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">1</div>
                <div>
                  <h4 className="font-bold text-indigo-900 text-sm">选择文书类型与模板模式</h4>
                  <p className="text-slate-600 mt-0.5">
                    在<b>【新建选择】</b>页，选择<b>电力工程合同、采购合同、法务函件、制度文件、合规报告</b>五大类别。选择【表单引导生成】、【空白范本】或【AI一键撰写】。
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="bg-slate-700 text-white rounded-lg w-6 h-6 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">2</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">填写结构化关键字段</h4>
                  <p className="text-slate-600 mt-0.5">
                    在<b>【表单填报】</b>界面，录入发承包双方名称、统一社会信用代码、工程标的、金额税率、质保期等。系统自动按国网规范生成带合规格式的完整范本。
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-sky-50/70 p-3 rounded-xl border border-sky-100">
                <div className="bg-sky-600 text-white rounded-lg w-6 h-6 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">3</div>
                <div>
                  <h4 className="font-bold text-sky-900 text-sm">Word 仿真编辑与 AI 条款生成</h4>
                  <p className="text-slate-600 mt-0.5">
                    在<b>【在线编辑主页】</b>使用全功能 Word 格式栏。可输入自然语言指令（如：“添加输变电抢修应急响应条款”），AI 自动生成<b>浅蓝高亮标记</b>的智能片段供复核。
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-amber-50/70 p-3 rounded-xl border border-amber-100">
                <div className="bg-amber-600 text-white rounded-lg w-6 h-6 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">4</div>
                <div>
                  <h4 className="font-bold text-amber-900 text-sm">一键合规校验与风险识别</h4>
                  <p className="text-slate-600 mt-0.5">
                    点击顶部<b>【合规一键校验】</b>或<b>【风险一键识别】</b>，AI 深度比对电网库与法律法规，自动定位质保金超留、履约违约缺陷等隐患并给出修改建议。
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                <div className="bg-emerald-600 text-white rounded-lg w-6 h-6 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">5</div>
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm">智能修订、版本快照与带水防伪导出</h4>
                  <p className="text-slate-600 mt-0.5">
                    在<b>【智能修订工作台】</b>接受/拒绝建议，在<b>【版本快照】</b>比对历史修订单。审查无误后一键导出带有电网防伪水印的 Word / PDF 文档。
                  </p>
                </div>
              </div>

            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowGuideModal(false)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-5 py-2 rounded-xl transition shadow-sm"
              >
                我知道了，开始编写
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
