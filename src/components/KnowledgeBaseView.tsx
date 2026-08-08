import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Upload, 
  Sliders, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Trash2, 
  ExternalLink,
  ShieldAlert,
  Play
} from 'lucide-react';
import { KnowledgeItem, RiskRule, UserRole } from '../types';

interface KnowledgeBaseViewProps {
  knowledgeBase: KnowledgeItem[];
  riskRules: RiskRule[];
  currentRole: UserRole;
  onAddKnowledge: (item: KnowledgeItem) => void;
  onToggleRule: (ruleId: string) => void;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  knowledgeBase,
  riskRules,
  currentRole,
  onAddKnowledge,
  onToggleRule
}) => {
  // Page mode: 'templates' | 'laws' | 'rules' | 'search'
  const [kbTab, setKbTab] = useState<'templates' | 'laws' | 'rules' | 'search'>('templates');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Rule test simulation state (页面 8.3)
  const [testClause, setTestClause] = useState<string>('乙方需留扣 10% 作为工程质量保证金，质保期满2年退还。');
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTestRule = () => {
    if (testClause.includes('10%')) {
      setTestResult('🚨 命中的风控规则：[RULE-001 质保金比例超标规则]，置信度 98%。风险级别：严重风险。违背《建设工程质量保证金管理办法》最高3%限制。');
    } else {
      setTestResult('✅ 未检测到明显违规风险点。');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 text-slate-800 overflow-hidden">
      
      {/* Sub-header Navigation */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setKbTab('templates')}
              className={`px-3 py-1 rounded text-xs font-medium transition ${kbTab === 'templates' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              电网文书范本库
            </button>
            <button
              onClick={() => setKbTab('laws')}
              className={`px-3 py-1 rounded text-xs font-medium transition ${kbTab === 'laws' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              法律法规与规章库
            </button>
            <button
              onClick={() => setKbTab('rules')}
              className={`px-3 py-1 rounded text-xs font-medium transition ${kbTab === 'rules' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              风险识别规则配置
            </button>
            <button
              onClick={() => setKbTab('search')}
              className={`px-3 py-1 rounded text-xs font-medium transition ${kbTab === 'search' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              全局知识全文检索
            </button>
          </div>
        </div>

        <button
          onClick={() => alert("请选择要导入的法律法规 Word/PDF 文件")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3.5 py-1.5 rounded-lg font-semibold shadow-sm flex items-center space-x-1"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>导入新范本/法规文档</span>
        </button>
      </div>

      {/* ==================== 页面 8.1: 文书范本库管理页 ==================== */}
      {kbTab === 'templates' && (
        <div className="flex-1 overflow-y-auto p-6 max-w-[1600px] mx-auto w-full space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>电网标准文书范本库管理</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                维护五大类文书范本，范本上传、版本更新、生效/失效状态管理与权限隔离
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {knowledgeBase.map((kb) => (
              <div key={kb.id} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-sm text-slate-900 truncate">{kb.title}</span>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 font-mono font-medium">
                    {kb.code}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{kb.content}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>发布日期: {kb.publishDate}</span>
                  <button 
                    onClick={() => alert(`成功基于范本《${kb.title}》新建文书草稿`)}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-200 text-xs font-medium transition"
                  >
                    一键基于范本新建
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== 页面 8.2: 法律法规与规章库页 ==================== */}
      {kbTab === 'laws' && (
        <div className="flex-1 overflow-y-auto p-6 max-w-[1600px] mx-auto w-full space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>国家法律、电力法规与电网企业制度库</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                包含民法典、电力法、招投标法、建质〔2017〕138号文及电网公司反违章管理办法
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <th className="py-3 px-4 font-semibold">法规/制度名称</th>
                  <th className="py-3 px-4 font-semibold">编号</th>
                  <th className="py-3 px-4 font-semibold">适用业务范围</th>
                  <th className="py-3 px-4 font-semibold">发布日期</th>
                  <th className="py-3 px-4 font-semibold">生效状态</th>
                  <th className="py-3 px-4 font-semibold text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {knowledgeBase.map((kb) => (
                  <tr key={kb.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-semibold text-slate-800">{kb.title}</td>
                    <td className="py-3 px-4 font-mono text-indigo-700">{kb.code}</td>
                    <td className="py-3 px-4 text-slate-600">{kb.scope}</td>
                    <td className="py-3 px-4 text-slate-500">{kb.publishDate}</td>
                    <td className="py-3 px-4">
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] border border-emerald-200 font-bold">
                        现行有效
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => alert(`查看条文：${kb.content}`)}
                        className="text-indigo-600 hover:underline font-medium"
                      >
                        查看正文条文
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== 页面 8.3: 风险规则配置页 ==================== */}
      {kbTab === 'rules' && (
        <div className="flex-1 overflow-y-auto p-6 max-w-[1600px] mx-auto w-full space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-amber-500" />
                <span>风控引擎识别规则配置与单段模拟测试</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                支持法务管理员维护电网专属风险识别触发词、正则匹配模式与风险等级
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rules List */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase">已知配置规则清单</h3>
              {riskRules.map((rule) => (
                <div key={rule.id} className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs text-slate-900 flex items-center space-x-2">
                      <span>{rule.ruleName}</span>
                      <span className="text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.2 rounded border border-rose-200 font-bold">
                        {rule.level}
                      </span>
                    </div>

                    <button
                      onClick={() => onToggleRule(rule.id)}
                      className={`text-xs px-2.5 py-1 rounded font-medium transition ${
                        rule.enabled 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {rule.enabled ? '规则已启用' : '规则已停用'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-600">{rule.description}</p>
                  <div className="text-[10px] text-slate-500 font-mono">正则表达式/触发模式: {rule.triggerPattern}</div>
                </div>
              ))}
            </div>

            {/* Live Test Playground */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center space-x-1.5">
                <Play className="w-4 h-4 text-amber-500" />
                <span>单段文本风控模拟测试预览</span>
              </h3>

              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">测试样本条款文本：</label>
                <textarea
                  rows={4}
                  value={testClause}
                  onChange={(e) => setTestClause(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={handleTestRule}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 rounded-lg shadow-sm transition"
              >
                模拟执行规则识别测试
              </button>

              {testResult && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 leading-relaxed">
                  {testResult}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== 页面 8.4: 全局知识全文检索弹窗 ==================== */}
      {kbTab === 'search' && (
        <div className="flex-1 overflow-y-auto p-6 max-w-[1200px] mx-auto w-full space-y-6">
          <div className="pb-3 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Search className="w-5 h-5 text-indigo-600" />
              <span>全局知识语义检索中心</span>
            </h2>
          </div>

          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="全库检索：输入“质保金比例”、“反违章”、“最高法院司法解释”..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 text-sm text-slate-800 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          <div className="space-y-3">
            {knowledgeBase.map((kb) => (
              <div key={kb.id} className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 shadow-sm">
                <div className="font-bold text-sm text-indigo-700">{kb.title}</div>
                <p className="text-xs text-slate-700 leading-relaxed">{kb.content}</p>
                <div className="text-[10px] text-slate-500">编号: {kb.code} | 标签: {kb.tags.join(', ')}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
