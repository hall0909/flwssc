import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileCheck2, 
  Printer, 
  Search, 
  Filter, 
  Upload, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileCode, 
  ArrowRight, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  FileText,
  Tag,
  Check,
  Zap,
  Eye,
  RotateCcw
} from 'lucide-react';
import { LegalDocument, ComplianceIssue, ComplianceLevel } from '../types';
import { formatContractContentToHtml } from '../utils/contractFormatter';

interface ComplianceReviewViewProps {
  currentDocument: LegalDocument | null;
  allDocuments: LegalDocument[];
  onOpenDocument: (doc: LegalDocument) => void;
  onNavigateToRevision: () => void;
  demoTime?: number;
}

export const ComplianceReviewView: React.FC<ComplianceReviewViewProps> = ({
  currentDocument,
  allDocuments,
  onOpenDocument,
  onNavigateToRevision,
  demoTime
}) => {
  // Mode: 'single_modal' (单篇文书合规审查) | 'batch' (批量审查) | 'report_preview' (诊断报告)
  const [reviewMode, setReviewMode] = useState<'single_modal' | 'batch' | 'report_preview'>('single_modal');

  // Classification filter: 'all' | 'law' | 'internal_policy' | 'clause_completeness' | 'format_spec'
  const [selectedDimension, setSelectedDimension] = useState<string>('all');

  // Active focused issue id
  const [focusedIssueId, setFocusedIssueId] = useState<string | null>('CMP-001');
  const [demoIsScanning, setDemoIsScanning] = useState<boolean>(false);
  const [demoClauseFixed, setDemoClauseFixed] = useState<boolean>(false);

  // React to Demo Timeline
  React.useEffect(() => {
    if (demoTime !== undefined) {
      if (demoTime >= 102 && demoTime < 110) {
        setReviewMode('single_modal');
        setDemoIsScanning(true);
        setDemoClauseFixed(false);
      } else if (demoTime >= 110 && demoTime < 129) {
        setReviewMode('single_modal');
        setDemoIsScanning(false);
        setFocusedIssueId('CMP-001');
        setDemoClauseFixed(false);
      }
    } else {
      setDemoIsScanning(false);
      setDemoClauseFixed(false);
    }
  }, [demoTime]);

  // Drag & drop batch upload files
  const [batchUploadedFiles, setBatchUploadedFiles] = useState<string[]>([
    "110kV输变电工程设备采购合同.docx",
    "特高压变电站运维服务协议.pdf",
    "配电网抢修工程施工分包合同.docx"
  ]);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isProcessingBatch, setIsProcessingBatch] = useState<boolean>(false);

  // Issues list
  const issues: ComplianceIssue[] = currentDocument?.complianceIssues || [
    {
      id: 'CMP-001',
      ruleCategory: 'law',
      title: '质保金留扣比例超出法定 3% 上限',
      description: '原合同约定留扣10%工程质保金，超出国务院及建质〔2017〕138号文件规定的3%上限。',
      level: 'mandatory',
      originalClause: '(4) 剩余10%作为质量保证金，质保期满24个月后无息退还。',
      basis: '《建设工程质量保证金管理办法》第七条；《中华人民共和国民法典》第七百九十九条。',
      suggestion: '建议将预留比例调整为 3%，并增加“承包人可提交等额银行质量保函替代现金留扣”的条款。'
    },
    {
      id: 'CMP-002',
      ruleCategory: 'internal_policy',
      title: '电网安全生产反违章惩罚红线缺失',
      description: '未明确规定违章指挥、违章作业的具体定额违约金与停工整顿触发条件。',
      level: 'suggestion',
      originalClause: '4.1 乙方必须贯彻国家电网《安全生产反违章管理办法》，对施工现场负全面安全生产责任。',
      basis: '国家电网有限公司《安全生产反违章管理办法》安监〔2022〕12号。',
      suggestion: '建议补全“严重违章行为单次扣罚 5000 元，累计三次直接终止合同”的追责条款。'
    },
    {
      id: 'CMP-003',
      ruleCategory: 'internal_policy',
      title: '争议管辖未选定发包人所在地专有管辖',
      description: '原约定南京仲裁委员会仲裁，无法灵活实施诉前财产保全，不符合电网合规诉讼指导意见。',
      level: 'suggestion',
      originalClause: '5.2 协商不成的，任何一方均可向南京仲裁委员会申请仲裁。',
      basis: '国家电网有限公司《合同管理办法》及法律纠纷案件专有管辖诉讼指南。',
      suggestion: '建议修改为：“由发包人所在地（南京市）有管辖权的人民法院诉讼管辖”。'
    }
  ];

  const filteredIssues = issues.filter(issue => {
    if (selectedDimension === 'all') return true;
    return issue.ruleCategory === selectedDimension;
  });

  const mandatoryCount = issues.filter(i => i.level === 'mandatory').length;
  const suggestionCount = issues.filter(i => i.level === 'suggestion').length;

  // Batch upload simulation
  const handleSimulateBatchUpload = () => {
    setIsProcessingBatch(true);
    setTimeout(() => {
      setIsProcessingBatch(false);
      alert("批量合规审查解析完成！已生成 3 份文书汇总合规诊疗报告。");
    }, 1500);
  };

  // Render document text with issue highlights
  const renderPaperDocumentHtml = () => {
    const rawContent = currentDocument?.content || `
第一条 工程概况与建设规模
1.1 本工程名称为：国网江苏电力110kV输变电新建工程EPC总承包项目。
1.2 工程建设地点：江苏省南京市江宁区谷里街道。
1.3 建设规模：新建110kV变电站1座，主变容量2×50MVA；新建110kV架空与电缆线路长约18.6公里。

第二条 承包范围与工期要求
2.1 承包范围包括本工程的勘察设计、设备材料采购、土建施工、设备安装调试、试运行及竣工验收全过程EPC总承包。
2.2 本工程计划开工日期为2026年09月01日，计划竣工日期为2027年08月31日，总工期为365日历天。
2.3 因承包人原因导致工期延误的，每延误一日，承包人应向发包人支付合同总价0.05%的违约金。

第三条 合同价款与付款方式
3.1 本合同暂定总价为人民币（大写）肆仟捌佰伍拾万元整（￥48,500,000.00），含9%增值税。
3.2 付款进度：
(1) 合同签订并提供履约保函后15日内，支付预付款20%；
(2) 按经监理与发包人确认的月度完成工程量支付进度款，累计支付不超过工程结算价的75%；
(3) 工程通过达标投产及竣工验收后，支付至结算总价的90%；
(4) 剩余10%作为质量保证金，质保期满24个月后无息退还。

第四条 质量、安全与环保责任
4.1 工程质量标准：符合国家及电网公司《输变电工程达标投产考核评定标准》，确保争创省部级优质工程。
4.2 安全责任划分：承包人全面负责施工现场安全生产，遵守《中华人民共和国安全生产法》及国家电网公司安全管理制度。因承包人原因造成人身伤亡或电网安全事故的，由承包人承担全部法律责任及经济损失。
4.3 环保与文明施工：承包人在施工过程中须采取抑尘降噪措施，达标排放。

第五条 争议解决方式
5.1 凡因执行本合同所发生的或与本合同有关的一切争议，双方应首先通过友好协商解决。
5.2 协商不成的，任何一方均可向南京仲裁委员会申请仲裁，仲裁裁决是终局的，对双方均有约束力。
    `.trim();

    let content = formatContractContentToHtml(rawContent);

    issues.forEach(issue => {
      const isFocused = focusedIssueId === issue.id;
      const badgeColor = issue.level === 'mandatory' ? '#e11d48' : '#2563eb';
      const bgColor = issue.level === 'mandatory' ? '#fff1f2' : '#eff6ff';
      const borderColor = issue.level === 'mandatory' ? '#fda4af' : '#93c5fd';

      const highlightedHtml = `
        <span class="paper-compliance-highlight cursor-pointer transition-all ${isFocused ? 'ring-2 ring-indigo-500 shadow-xs' : ''}" style="background-color: ${bgColor}; border: 1.5px solid ${borderColor}; padding: 4px 6px; border-radius: 6px; display: inline-block; margin: 2px 0;">
          <span style="color: #0f172a; font-weight: bold;">${issue.originalClause}</span>
          <span style="display: inline-flex; align-items: center; background-color: ${badgeColor}; color: #ffffff; font-size: 10px; font-weight: bold; padding: 1px 6px; border-radius: 9999px; margin-left: 6px;">
            ${issue.level === 'mandatory' ? '🔴 强制不合规' : '🟡 优化建议'}
          </span>
        </span>
      `;

      content = content.replace(issue.originalClause, highlightedHtml);
    });

    return content;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-100 text-slate-800 overflow-hidden">
      
      {/* Top Controls Header Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-slate-900">文书合规审查中心</h2>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-medium">
                匹配国家电网法规库 & 必备条款指南
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              交互模式：中央主屏聚焦 A4 纸面审查，右侧边栏展示逐项合规清单并支持一键转智能修订
            </p>
          </div>
        </div>

        {/* View Segmented Switcher */}
        <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center space-x-1 text-xs font-semibold">
          <button
            onClick={() => setReviewMode('single_modal')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1 ${
              reviewMode === 'single_modal'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>📄 单篇文书合规审查</span>
          </button>

          <button
            onClick={() => setReviewMode('batch')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1 ${
              reviewMode === 'batch'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>📦 存量文书批量合规审查</span>
          </button>

          <button
            onClick={() => setReviewMode('report_preview')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1 ${
              reviewMode === 'report_preview'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-600" />
            <span>📋 结构化诊断报告</span>
          </button>
        </div>

        {/* Global Action */}
        <button
          onClick={onNavigateToRevision}
          className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition shadow-xs flex items-center space-x-1.5 ${
            demoTime !== undefined && demoTime >= 118 && demoTime < 129 ? 'ring-2 ring-amber-400 bg-indigo-700 animate-pulse scale-105 shadow-md' : ''
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>一键转入智能修订工作台</span>
        </button>
      </div>

      {/* MODE 1: Single Document Review View */}
      {reviewMode === 'single_modal' && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 overflow-hidden max-w-[1920px] mx-auto w-full">
          
          {/* Central Main Screen Stage: A4 Paper (Cols 1-8) */}
          <div className="lg:col-span-8 flex flex-col overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-xs">
            
            {/* Top Stat Banner */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3 text-xs">
                <span className="font-bold text-slate-800">当前审核文书：{currentDocument?.title || '110kV 输变电工程施工合同'}</span>
                <span className="text-slate-300">|</span>
                <span className="text-[11px] text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 font-bold">
                  强制不合规：{mandatoryCount} 项
                </span>
                <span className="text-[11px] text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 font-bold">
                  建议优化：{suggestionCount} 项
                </span>
              </div>

              <span className="text-[11px] text-slate-500">点击正文中高亮块可快速定位右侧合规解析条目</span>
            </div>

            {/* A4 Document Stage */}
            <div className="flex-1 overflow-y-auto bg-slate-200/70 p-6 flex justify-center">
              <div className="bg-white rounded-xl border border-slate-300 shadow-md p-8 md:p-12 max-w-4xl w-full h-fit">
                
                {/* Paper Header Seal */}
                <div className="border-b-2 border-indigo-600 pb-3 mb-6 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">国</div>
                    <span className="text-xs font-bold text-slate-900 tracking-wider">国家电网有限公司 · 合规审查纸面</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                    合规校验单号: {currentDocument?.id || 'CMP-2026-SG-01'}
                  </span>
                </div>

                {/* Main Paper Content */}
                <div 
                  className="prose prose-slate max-w-none text-xs md:text-sm leading-relaxed font-serif text-slate-900 space-y-4"
                  dangerouslySetInnerHTML={{ __html: renderPaperDocumentHtml() }}
                />

              </div>
            </div>

          </div>

          {/* Right Sidebar: Compliance Issues Dock (Cols 9-12) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col h-[calc(100vh-6rem)] shadow-xs">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3 shrink-0">
              <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>合规诊断结果 Dock ({filteredIssues.length})</span>
              </h3>

              <div className="text-[11px] text-slate-500">
                按合规维度筛选
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1 mb-3 shrink-0 text-[11px]">
              <button
                onClick={() => setSelectedDimension('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  selectedDimension === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                全部 ({issues.length})
              </button>
              <button
                onClick={() => setSelectedDimension('law')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  selectedDimension === 'law' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                法律法规
              </button>
              <button
                onClick={() => setSelectedDimension('internal_policy')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  selectedDimension === 'internal_policy' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                电网制度
              </button>
            </div>

            {/* Issue Cards Scrollable List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {filteredIssues.map((issue) => (
                <div 
                  key={issue.id}
                  onClick={() => setFocusedIssueId(issue.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    focusedIssueId === issue.id
                      ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-300 shadow-xs'
                      : issue.level === 'mandatory'
                      ? 'bg-white border-rose-200 hover:border-rose-400 shadow-2xs'
                      : 'bg-white border-indigo-200 hover:border-indigo-400 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      issue.level === 'mandatory' ? 'bg-rose-600 text-white' : 'bg-indigo-600 text-white'
                    }`}>
                      {issue.level === 'mandatory' ? '【强制不合规】' : '【建议优化】'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">定位锚点已对齐</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs mb-1.5">{issue.title}</h4>

                  <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] font-serif text-slate-700 italic mb-2">
                    原: “{issue.originalClause}”
                  </div>

                  <p className="text-[11px] text-indigo-900 bg-indigo-50/60 p-2 rounded border border-indigo-100 mb-2 leading-relaxed">
                    💡 建议: {issue.suggestion}
                  </p>

                  <div className="pt-1 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
                    <span className="truncate max-w-[180px]">依据: {issue.basis}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToRevision();
                      }}
                      className="text-indigo-600 hover:underline font-bold flex items-center space-x-0.5"
                    >
                      <span>转入修订</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* MODE 2: Batch Review View */}
      {reviewMode === 'batch' && (
        <div className="flex-1 overflow-y-auto p-6 max-w-[1400px] mx-auto w-full space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <span>存量文书批量合规审查</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                支持拖拽批量上传 Word/PDF 合同文书，一次性批量输出汇总合规与风险诊断报表
              </p>
            </div>

            <button
              onClick={handleSimulateBatchUpload}
              disabled={isProcessingBatch}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-lg font-semibold shadow-sm flex items-center space-x-1.5"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>{isProcessingBatch ? "批量解析运算中..." : "开始批量合规审查"}</span>
            </button>
          </div>

          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              alert("文件添加成功！准备批量审查。");
            }}
            className={`p-8 border-2 border-dashed rounded-xl text-center transition cursor-pointer ${
              isDragOver ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-white hover:border-slate-400'
            }`}
          >
            <Upload className="w-8 h-8 text-indigo-600 mx-auto mb-2 animate-bounce" />
            <h3 className="text-sm font-bold text-slate-800">拖拽多份 Word / PDF 合同文件至此处</h3>
            <p className="text-xs text-slate-500 mt-1">单次支持最大 20 份文书并发处理，限制单文件 200 页以内</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm space-y-2 p-4">
            <h3 className="text-xs font-bold text-slate-700 pb-2 border-b border-slate-100">待批处理文书清单 ({batchUploadedFiles.length} 份)</h3>
            <div className="space-y-2">
              {batchUploadedFiles.map((file, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span className="font-semibold text-slate-800">{file}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-indigo-700 font-medium text-[11px]">发现 1项强制不合规 | 2项建议</span>
                    <button className="text-slate-400 hover:text-rose-600 font-medium">移除</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: Structured Report Preview */}
      {reviewMode === 'report_preview' && (
        <div className="flex-1 overflow-y-auto p-6 max-w-[1000px] mx-auto w-full space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <FileCode className="w-5 h-5 text-indigo-600" />
                <span>结构化合规诊断报告预览</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                打印级排版格式，包含文书信息、问题汇总清单与引用法规附录
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3.5 py-1.5 rounded-lg font-semibold shadow-sm flex items-center space-x-1"
            >
              <Printer className="w-4 h-4" />
              <span>打印/导出 PDF 报告</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm text-slate-800 font-sans space-y-6">
            <div className="text-center pb-6 border-b border-slate-200">
              <h1 className="text-xl font-bold text-slate-900">国家电网法律文书合规审查诊断报告</h1>
              <p className="text-xs text-slate-500 mt-1">报告编号: SGCC-REP-20260808-019 | 生成时间: 2026-08-08</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div><span className="text-slate-500">审查文书:</span> <span className="font-medium text-slate-800">{currentDocument?.title || '110kV输变电新建工程合同'}</span></div>
              <div><span className="text-slate-500">申请单位:</span> <span className="font-medium text-slate-800">{currentDocument?.unit || '国网江苏省电力有限公司'}</span></div>
              <div><span className="text-slate-500">合规综合结论:</span> <span className="text-rose-600 font-bold">存在1项强制不合规需修改后方可签署</span></div>
              <div><span className="text-slate-500">复核法务:</span> <span className="font-medium text-slate-800">李敏（法务审核员）</span></div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-sm text-indigo-700 border-l-2 border-indigo-600 pl-2">一、强制不合规问题明细</h3>
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-1">
                <div className="font-bold text-rose-800">1. 质保金扣留比例超出3%上限</div>
                <p className="text-slate-700">违反《建设工程质量保证金管理办法》第六条。要求调整至3%或采用保函替代。</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h3 className="font-bold text-sm text-indigo-700 border-l-2 border-indigo-600 pl-2">二、引用法律法规与规范条文附录</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                《中华人民共和国民法典》第五百八十五条；《建设工程质量保证金管理办法》建质〔2017〕138号；《国家电网有限公司安全生产反违章管理办法》。
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
