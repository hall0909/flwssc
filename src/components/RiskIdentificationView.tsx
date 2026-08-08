import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Filter, 
  ArrowRight, 
  PieChart as PieIcon, 
  BarChart3, 
  Download, 
  Search,
  ExternalLink
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { LegalDocument, RiskItem, RiskLevel } from '../types';

interface RiskIdentificationViewProps {
  currentDocument: LegalDocument | null;
  allDocuments: LegalDocument[];
  onOpenDocument: (doc: LegalDocument) => void;
}

export const RiskIdentificationView: React.FC<RiskIdentificationViewProps> = ({
  currentDocument,
  allDocuments,
  onOpenDocument
}) => {
  // Mode: 'panel' (页面 5.1 编辑页右侧风险清单) | 'statistics' (页面 5.2 批量风险统计视图)
  const [viewMode, setViewMode] = useState<'panel' | 'statistics'>('statistics');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  const risks = currentDocument?.riskItems || [];

  const filteredRisks = risks.filter(r => {
    if (levelFilter === 'all') return true;
    if (levelFilter === 'high_critical') return r.level === 'critical' || r.level === 'high';
    return r.level === levelFilter;
  });

  // Data for Recharts Pie Chart (Risk Level Distribution)
  const pieData = [
    { name: '严重风险 (Critical)', value: 12, color: '#f43f5e' },
    { name: '高风险 (High)', value: 28, color: '#f97316' },
    { name: '一般风险 (Medium)', value: 64, color: '#eab308' },
    { name: '低风险 (Low)', value: 115, color: '#94a3b8' }
  ];

  // Data for Recharts Bar Chart (Top 10 Frequent Risks in 5 Document Categories)
  const barData = [
    { name: '质保金超限', count: 42 },
    { name: '违约金封顶过低', count: 35 },
    { name: '反违章责任缺失', count: 29 },
    { name: '工期判定模糊', count: 24 },
    { name: '抽检免责非对等', count: 18 },
    { name: '验收标准不一致', count: 15 },
    { name: '保密失效约定', count: 12 },
    { name: '管辖法院错置', count: 9 }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 text-slate-800 overflow-hidden">
      
      {/* Sub-header Navigation */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('statistics')}
              className={`px-3 py-1 rounded text-xs font-medium transition ${viewMode === 'statistics' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              批量风险统计视图 (图表分析)
            </button>
            <button
              onClick={() => setViewMode('panel')}
              className={`px-3 py-1 rounded text-xs font-medium transition ${viewMode === 'panel' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              单篇风险清单面板
            </button>
          </div>

          {currentDocument && (
            <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded font-medium">
              分析文书: {currentDocument.title}
            </span>
          )}
        </div>

        <button
          onClick={() => alert("风险统计报表已成功导出 Excel/PDF 格式")}
          className="bg-white hover:bg-slate-50 text-indigo-700 text-xs px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center space-x-1 font-medium transition"
        >
          <Download className="w-3.5 h-3.5 text-indigo-600" />
          <span>导出全单位风险统计报表</span>
        </button>
      </div>

      {/* ==================== 页面 5.2: 批量风险统计视图页面 ==================== */}
      {viewMode === 'statistics' && (
        <div className="flex-1 overflow-y-auto p-6 max-w-[1600px] mx-auto w-full space-y-6">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-amber-500" />
                <span>批量风险统计视图与高频隐患分析</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                统计全单位历史文书风险等级分布、五大文书类型高频风险 TOP10，辅助法务复盘与制度优化
              </p>
            </div>
          </div>

          {/* Recharts Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Risk Level Distribution Pie Chart */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                  <PieIcon className="w-4 h-4 text-rose-500" />
                  <span>全单位文书风险四级分级占比</span>
                </h3>
                <span className="text-[10px] text-slate-400">样本量: 342 份文书</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', fontSize: '12px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', color: '#475569' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: High Frequency Risks Bar Chart */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-amber-500" />
                  <span>五大文书高频风险 TOP 8 排行榜</span>
                </h3>
                <span className="text-[10px] text-slate-400">近12个月</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10, fill: '#64748b' }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', fontSize: '12px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Detail Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">全单位高风险文书监测明细表</h3>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <th className="py-2.5 px-3 font-semibold">文书名称</th>
                  <th className="py-2.5 px-3 font-semibold">识别风险点</th>
                  <th className="py-2.5 px-3 font-semibold">风险等级</th>
                  <th className="py-2.5 px-3 font-semibold">业务后果风险</th>
                  <th className="py-2.5 px-3 font-semibold text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-semibold text-slate-800">{doc.title}</td>
                    <td className="py-3 px-3 text-slate-600">
                      {doc.riskItems[0]?.title || '未检测到明显高风险'}
                    </td>
                    <td className="py-3 px-3">
                      {doc.riskItems.some(r => r.level === 'critical') ? (
                        <span className="bg-rose-50 text-rose-700 text-[10px] px-2 py-0.5 rounded border border-rose-200 font-bold">
                          严重风险
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-700 text-[10px] px-2 py-0.5 rounded border border-amber-200 font-medium">
                          高风险
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      {doc.riskItems[0]?.consequence || '无高危法律后果'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onOpenDocument(doc)}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-200 text-xs font-medium transition"
                      >
                        进入审查
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ==================== 页面 5.1: 编辑页右侧风险清单面板 ==================== */}
      {viewMode === 'panel' && (
        <div className="flex-1 overflow-y-auto p-6 max-w-[1200px] mx-auto w-full space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <span>单篇文书风险识别与隐患定位</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                包含风险位置、风险描述、业务不利后果、参考依据与优化建议
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="bg-white text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">全部四级风险</option>
                <option value="high_critical">仅看严重与高风险</option>
                <option value="critical">严重风险 (红色)</option>
                <option value="high">高风险 (橙色)</option>
                <option value="medium">一般风险 (黄色)</option>
                <option value="low">低风险 (灰色)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredRisks.map((risk) => (
              <div 
                key={risk.id}
                className={`p-5 rounded-xl border shadow-sm space-y-3 ${
                  risk.level === 'critical' 
                    ? 'bg-white border-rose-200' 
                    : risk.level === 'high' 
                    ? 'bg-white border-amber-200' 
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                      risk.level === 'critical' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                    }`}>
                      {risk.level === 'critical' ? '严重风险' : '高风险'}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">{risk.title}</h3>
                  </div>

                  <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">
                    条款位置: {risk.location}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="font-bold text-rose-700 mb-1">业务不利后果：</div>
                    <p className="text-slate-700 leading-relaxed">{risk.consequence}</p>
                  </div>

                  <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-200">
                    <div className="font-bold text-indigo-700 mb-1">优化策略建议：</div>
                    <p className="text-indigo-900 leading-relaxed">{risk.optimization}</p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 pt-1">
                  依据: {risk.basis}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
