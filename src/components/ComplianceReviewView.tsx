import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertOctagon, 
  CheckCircle2, 
  FileText, 
  Download, 
  Upload, 
  ArrowRight, 
  Sparkles, 
  ExternalLink, 
  Printer, 
  Layers, 
  FileCheck2,
  FileCode
} from 'lucide-react';
import { LegalDocument, ComplianceIssue } from '../types';

interface ComplianceReviewViewProps {
  currentDocument: LegalDocument | null;
  allDocuments: LegalDocument[];
  onOpenDocument: (doc: LegalDocument) => void;
  onNavigateToRevision: () => void;
}

export const ComplianceReviewView: React.FC<ComplianceReviewViewProps> = ({
  currentDocument,
  allDocuments,
  onOpenDocument,
  onNavigateToRevision
}) => {
  // Page mode state: 'batch' | 'single_modal' | 'report_preview'
  const [reviewMode, setReviewMode] = useState<'batch' | 'single_modal' | 'report_preview'>('single_modal');
  const [selectedDimension, setSelectedDimension] = useState<string>('all');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [batchUploadedFiles, setBatchUploadedFiles] = useState<string[]>([
    '国网江苏电力110kV输变电EPC总承包合同.docx',
    '国网浙江电力2026年度智能电能表物资采购框架协议.pdf',
    '合肥滨湖新区220kV输变电工程施工合同.docx'
  ]);
  const [isProcessingBatch, setIsProcessingBatch] = useState<boolean>(false);

  // Default compliance issues for display if currentDocument is chosen
  const issues = currentDocument?.complianceIssues || [];

  const filteredIssues = issues.filter(i => {
    if (selectedDimension === 'all') return true;
    return i.ruleCategory === selectedDimension;
  });

  const mandatoryCount = issues.filter(i => i.level === 'mandatory').length;
  const suggestionCount = issues.filter(i => i.level === 'suggestion').length;

  const handleSimulateBatchUpload = () => {
    setIsProcessingBatch(true);
    setTimeout(() => {
      setIsProcessingBatch(false);
      alert("批量合规审查完成！成功解析 3 份文书，共检测出 2 项强制不合规，5 项建议优化。已生成汇总报告压缩包。");
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 text-slate-800 overflow-hidden">
      
      {/* Sub-header Controls */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setReviewMode('single_modal')}
              className={`px-3 py-1 rounded text-xs font-medium transition ${reviewMode === 'single_modal' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              单篇合规审查
            </button>
            <button
              onClick={() => setReviewMode('batch')}
              className={`px-3 py-1 rounded text-xs font-medium transition ${reviewMode === 'batch' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              独立批量审查
            </button>
            <button
              onClick={() => setReviewMode('report_preview')}
              className={`px-3 py-1 rounded text-xs font-medium transition ${reviewMode === 'report_preview' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              报告预览与打印
            </button>
          </div>

          {currentDocument && (
            <span className="text-xs text-indigo-700 font-semibold bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded">
              审查文书: {currentDocument.title}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onNavigateToRevision}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg transition shadow-sm flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>一键执行 AI 智能修订</span>
          </button>
        </div>
      </div>

      {/* ==================== 页面 4.1: 单篇文书合规校验弹窗/面板 ==================== */}
      {reviewMode === 'single_modal' && (
        <div className="flex-1 overflow-y-auto p-6 max-w-[1400px] mx-auto w-full space-y-6">
          
          {/* Header Summary Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">单篇文书合规校验结果分析</h2>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-medium">
                  对比法规库、电网规章与必备条款完整性
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                文书名称: {currentDocument?.title || '未选择'} | 检测规章条文 1,240 余条
              </p>
            </div>

            <div className="flex items-center space-x-4 shrink-0 text-xs">
              <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-lg text-center min-w-[100px]">
                <div className="text-lg font-bold text-rose-700">{mandatoryCount}</div>
                <div className="text-[10px] text-rose-600 font-semibold">【强制不合规】</div>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 p-2.5 rounded-lg text-center min-w-[100px]">
                <div className="text-lg font-bold text-indigo-700">{suggestionCount}</div>
                <div className="text-[10px] text-indigo-600 font-semibold">【建议优化】</div>
              </div>
            </div>
          </div>

          {/* 4 Classification Dimension Tabs */}
          <div className="flex space-x-2 border-b border-slate-200 pb-2 text-xs">
            <button
              onClick={() => setSelectedDimension('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${selectedDimension === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              全部校验维度 ({issues.length})
            </button>
            <button
              onClick={() => setSelectedDimension('law')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${selectedDimension === 'law' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              法律法规校验
            </button>
            <button
              onClick={() => setSelectedDimension('internal_policy')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${selectedDimension === 'internal_policy' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              企业内部制度校验
            </button>
            <button
              onClick={() => setSelectedDimension('clause_completeness')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${selectedDimension === 'clause_completeness' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              必备条款完整性校验
            </button>
            <button
              onClick={() => setSelectedDimension('format_spec')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${selectedDimension === 'format_spec' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              格式规范校验
            </button>
          </div>

          {/* Compliance List Cards */}
          <div className="space-y-4">
            {filteredIssues.map((issue) => (
              <div 
                key={issue.id} 
                className={`p-5 rounded-xl border transition shadow-sm ${
                  issue.level === 'mandatory' 
                    ? 'bg-white border-rose-200 hover:border-rose-400' 
                    : 'bg-white border-indigo-200 hover:border-indigo-400'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                      issue.level === 'mandatory' ? 'bg-rose-600 text-white' : 'bg-indigo-600 text-white'
                    }`}>
                      {issue.level === 'mandatory' ? '【强制不合规】' : '【建议优化】'}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">{issue.title}</h3>
                  </div>

                  <span className="text-[11px] text-indigo-600 font-mono cursor-pointer hover:underline flex items-center space-x-1 font-semibold">
                    <span>定位锚点：第 18 行</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">原文档存疑条款：</div>
                    <p className="text-slate-800 font-serif italic">{issue.originalClause}</p>
                  </div>

                  <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-200 space-y-1">
                    <div className="text-[10px] text-indigo-700 font-bold uppercase">参考优化建议：</div>
                    <p className="text-indigo-900">{issue.suggestion}</p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                  <div><span className="text-slate-400">依据来源：</span><span className="text-slate-700 font-medium">{issue.basis}</span></div>
                  <button 
                    onClick={() => alert(`正在查看法规原文：${issue.basis}`)}
                    className="text-indigo-600 hover:underline flex items-center space-x-1 font-medium"
                  >
                    <span>查看完整法条原文</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ==================== 页面 4.2: 批量合规审查独立页面 ==================== */}
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

          {/* Drag & Drop Upload Zone */}
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

          {/* Uploaded Files Table */}
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

      {/* ==================== 页面 4.3: 合规报告预览页 ==================== */}
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
