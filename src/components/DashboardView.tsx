import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Archive, 
  PlusCircle, 
  ArrowRight, 
  Zap, 
  ShoppingBag, 
  BookOpen, 
  Layers, 
  Search, 
  Clock, 
  ExternalLink,
  Sparkles,
  TrendingUp,
  Filter
} from 'lucide-react';
import { LegalDocument, DocumentCategory, DashboardMetrics } from '../types';

interface DashboardViewProps {
  documents: LegalDocument[];
  metrics: DashboardMetrics;
  onNavigateToDrafting: (category?: DocumentCategory) => void;
  onOpenDocument: (doc: LegalDocument) => void;
  onNavigateToReview: () => void;
  onNavigateToBatchReview: () => void;
  onOpenGlobalSearch: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  documents,
  metrics,
  onNavigateToDrafting,
  onOpenDocument,
  onNavigateToReview,
  onNavigateToBatchReview,
  onOpenGlobalSearch
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredDocs = documents.filter(doc => {
    if (filterCategory === 'all') return true;
    return doc.category === filterCategory;
  });

  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto">
      
      {/* Top Banner / Welcome */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-0.5 rounded font-semibold border border-indigo-200">
              电网法务AI总控中心
            </span>
            <span className="text-slate-500 text-xs">欢迎登录系统，法务专员</span>
          </div>
          <h2 className="text-xl font-bold mt-1.5 text-slate-900 tracking-tight">
            国网法务文书智能生成与合规审查工作台
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            涵盖电力工程、物资采购、法务函件、制度文件、合规报告五大场景的起草、校验、风险识别与版本归档全链路 AI 辅助。
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button 
            onClick={() => onNavigateToDrafting()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>智能新建文书</span>
          </button>
          <button 
            onClick={onNavigateToBatchReview}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg border border-slate-200 transition flex items-center space-x-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>批量存量合规审查</span>
          </button>
        </div>
      </div>

      {/* 2.1 Top Metrics Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Documents Generated */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-indigo-200 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>本月生成文书总数</span>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><FileText className="w-4 h-4" /></span>
          </div>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">{metrics.monthlyGeneratedTotal}</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14.2% 较上月
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-500">
            <div>工程: <span className="text-slate-800 font-semibold">{metrics.categoryBreakdown.power_engineering}</span></div>
            <div>采购: <span className="text-slate-800 font-semibold">{metrics.categoryBreakdown.procurement}</span></div>
            <div>函件: <span className="text-slate-800 font-semibold">{metrics.categoryBreakdown.legal_letter}</span></div>
          </div>
        </div>

        {/* Metric 2: Compliance & Risks */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-rose-200 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>合规校验与风险识别</span>
            <span className="p-2 bg-rose-50 text-rose-600 rounded-lg"><AlertTriangle className="w-4 h-4" /></span>
          </div>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">{metrics.complianceCheckCount}</span>
            <span className="text-xs text-slate-500">次审查</span>
          </div>
          <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-slate-100 text-[10px]">
            <span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200 font-medium">严重: {metrics.riskCountByLevel.critical}</span>
            <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200 font-medium">高风险: {metrics.riskCountByLevel.high}</span>
            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">一般: {metrics.riskCountByLevel.medium}</span>
          </div>
        </div>

        {/* Metric 3: AI Revision Adoption Rate */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-indigo-200 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>AI 修订建议采纳率</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Sparkles className="w-4 h-4" /></span>
          </div>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">{metrics.aiAdoptionRate}%</span>
            <span className="text-xs text-emerald-600 font-medium">法务审核认可</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${metrics.aiAdoptionRate}%` }} />
          </div>
        </div>

        {/* Metric 4: Archived Final Documents */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-emerald-200 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>已锁定归档终稿</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Archive className="w-4 h-4" /></span>
          </div>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">{metrics.archivedCount}</span>
            <span className="text-xs text-slate-500">份终稿存档</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
            <span>支持历史版本对比与追溯</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
        </div>

      </div>

      {/* 2.3 Quick Entry Cards */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center space-x-2">
          <span>快捷功能入口</span>
          <span className="text-[10px] text-slate-400 font-normal">快速发起各类文书智能起草与工具检索</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <button 
            onClick={() => onNavigateToDrafting('power_engineering')}
            className="bg-white hover:bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 transition text-left group shadow-sm"
          >
            <div className="p-2 bg-indigo-50 rounded-lg w-fit text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-slate-800 mt-2.5">新建电力工程合同</div>
            <div className="text-[10px] text-slate-500 mt-0.5">EPC/施工/检修/监理</div>
          </button>

          <button 
            onClick={() => onNavigateToDrafting('procurement')}
            className="bg-white hover:bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 transition text-left group shadow-sm"
          >
            <div className="p-2 bg-emerald-50 rounded-lg w-fit text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-slate-800 mt-2.5">新建物资采购合同</div>
            <div className="text-[10px] text-slate-500 mt-0.5">物资设备/服务框架</div>
          </button>

          <button 
            onClick={() => onNavigateToDrafting('legal_letter')}
            className="bg-white hover:bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 transition text-left group shadow-sm"
          >
            <div className="p-2 bg-amber-50 rounded-lg w-fit text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition">
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-slate-800 mt-2.5">新建法务函件</div>
            <div className="text-[10px] text-slate-500 mt-0.5">催告/解除/异议/告知</div>
          </button>

          <button 
            onClick={() => onNavigateToDrafting('internal_policy')}
            className="bg-white hover:bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 transition text-left group shadow-sm"
          >
            <div className="p-2 bg-purple-50 rounded-lg w-fit text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-slate-800 mt-2.5">新建制度文件</div>
            <div className="text-[10px] text-slate-500 mt-0.5">合规办法/内控细则</div>
          </button>

          <button 
            onClick={() => onNavigateToDrafting('compliance_report')}
            className="bg-white hover:bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 transition text-left group shadow-sm"
          >
            <div className="p-2 bg-rose-50 rounded-lg w-fit text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition">
              <Layers className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-slate-800 mt-2.5">新建合规报告</div>
            <div className="text-[10px] text-slate-500 mt-0.5">年度总结/专项自查</div>
          </button>

          <button 
            onClick={onNavigateToBatchReview}
            className="bg-white hover:bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 transition text-left group shadow-sm"
          >
            <div className="p-2 bg-blue-50 rounded-lg w-fit text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-slate-800 mt-2.5">批量存量审查</div>
            <div className="text-[10px] text-slate-500 mt-0.5">多文件拖拽解析</div>
          </button>

          <button 
            onClick={onOpenGlobalSearch}
            className="bg-white hover:bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 transition text-left group shadow-sm"
          >
            <div className="p-2 bg-slate-100 rounded-lg w-fit text-slate-600 group-hover:bg-slate-700 group-hover:text-white transition">
              <Search className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-slate-800 mt-2.5">知识库全文检索</div>
            <div className="text-[10px] text-slate-500 mt-0.5">范本/法规/条款</div>
          </button>
        </div>
      </div>

      {/* Main Grid: Pending Tasks & Notification Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2.2 Pending Tasks List (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-900">待办任务列表</h3>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 font-semibold">
                {filteredDocs.length} 份处理中
              </span>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-50 text-slate-700 text-xs px-2.5 py-1 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">全部文书场景</option>
                <option value="power_engineering">电力工程合同</option>
                <option value="procurement">采购合同</option>
                <option value="legal_letter">法务函件</option>
                <option value="internal_policy">制度文件</option>
                <option value="compliance_report">合规报告</option>
              </select>
            </div>
          </div>

          {/* Table of Tasks */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <th className="py-2.5 px-3 font-semibold">文书名称</th>
                  <th className="py-2.5 px-3 font-semibold">创建单位/人员</th>
                  <th className="py-2.5 px-3 font-semibold">状态节点</th>
                  <th className="py-2.5 px-3 font-semibold">合规/风险摘要</th>
                  <th className="py-2.5 px-3 font-semibold text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.map((doc) => {
                  const hasCriticalRisk = doc.riskItems.some(r => r.level === 'critical');
                  const hasMandatoryIssue = doc.complianceIssues.some(c => c.level === 'mandatory');

                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900 hover:text-indigo-600 cursor-pointer" onClick={() => onOpenDocument(doc)}>
                          {doc.title}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          ID: {doc.id} | 更新时间: {doc.updatedAt}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="text-slate-700">{doc.createdBy}</div>
                        <div className="text-[10px] text-slate-400">{doc.unit}</div>
                      </td>

                      <td className="py-3 px-3">
                        {doc.status === 'draft' && (
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] border border-slate-200 font-medium">待撰写草稿</span>
                        )}
                        {doc.status === 'reviewing' && (
                          <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded text-[10px] border border-amber-200 font-medium">待合规审查</span>
                        )}
                        {doc.status === 'revised' && (
                          <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-[10px] border border-blue-200 font-medium">待修订审定</span>
                        )}
                        {doc.status === 'archived' && (
                          <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[10px] border border-emerald-200 font-medium">已终稿归档</span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-1.5">
                          {hasMandatoryIssue ? (
                            <span className="bg-rose-50 text-rose-700 text-[10px] px-1.5 py-0.5 rounded border border-rose-200 font-medium">
                              {doc.complianceIssues.length}条强制不合规
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-600 font-medium">校验通过</span>
                          )}

                          {hasCriticalRisk && (
                            <span className="bg-rose-100 text-rose-800 text-[10px] px-1.5 py-0.5 rounded border border-rose-200 font-bold animate-pulse">
                              严重风险
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onOpenDocument(doc)}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-200 transition text-[11px] font-medium inline-flex items-center space-x-1"
                        >
                          <span>进入编辑</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2.4 Notifications Area (1 Column) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>消息通知区</span>
            </h3>
            <span className="text-[10px] text-slate-400">实时推送</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-700">
                <span>知识库法规更新提醒</span>
                <span className="text-[10px] text-slate-400">10分钟前</span>
              </div>
              <p className="text-slate-600 text-xs">
                住房城乡建设部印发《建设工程质量保证金管理办法》提示：保证金总预留比例不得高于3%。
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-amber-800">
                <span>高风险文书待复核提醒</span>
                <span className="text-[10px] text-amber-600">30分钟前</span>
              </div>
              <p className="text-slate-700 text-xs">
                《国网江苏电力110kV输变电EPC合同》质保金扣留比例10%不合规，请及时发起AI智能修订。
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span>范本版本更新通知</span>
                <span className="text-[10px] text-slate-400">2小时前</span>
              </div>
              <p className="text-slate-600 text-xs">
                《国家电网公司电力工程施工合同示范文本2025版》已更新至知识库，可供一键调用。
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-700">
                <span>系统运维与安全提示</span>
                <span className="text-[10px] text-slate-400">1天前</span>
              </div>
              <p className="text-slate-600 text-xs">
                系统全量操作日志留存不少于3年，业务敏感数据严禁外流出网，已完成内网加密通道同步。
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
