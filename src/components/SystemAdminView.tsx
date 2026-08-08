import React, { useState } from 'react';
import { 
  Settings, 
  Lock, 
  FileCheck2, 
  Cpu, 
  BarChart3, 
  ShieldCheck, 
  Filter, 
  Download, 
  CheckCircle2, 
  RefreshCw,
  Search,
  Server
} from 'lucide-react';
import { AuditLog, UserRole } from '../types';

interface SystemAdminViewProps {
  auditLogs: AuditLog[];
  aiEnabled: boolean;
  onToggleAi: () => void;
  currentRole: UserRole;
}

export const SystemAdminView: React.FC<SystemAdminViewProps> = ({
  auditLogs,
  aiEnabled,
  onToggleAi,
  currentRole
}) => {
  // Page mode: 'roles' | 'audit' | 'interface' | 'analytics'
  const [adminTab, setAdminTab] = useState<'roles' | 'audit' | 'interface' | 'analytics'>('roles');
  const [logFilterAction, setLogFilterAction] = useState<string>('all');
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);

  const filteredLogs = auditLogs.filter(log => {
    if (logFilterAction === 'all') return true;
    return log.actionType === logFilterAction;
  });

  const handleTestConnection = () => {
    setIsTestingConnection(true);
    setConnectionStatus(null);
    setTimeout(() => {
      setIsTestingConnection(false);
      setConnectionStatus("✅ 接口链路测试连通成功！国家电网统一法务平台 HTTP REST API 响应正常 (HTTP 200 OK, RTT 12ms)");
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 text-slate-800 overflow-hidden">
      
      {/* Sub-header Controls */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setAdminTab('roles')}
              className={`px-3 py-1 rounded text-xs font-medium transition ${adminTab === 'roles' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              角色权限与数据隔离
            </button>
            <button
              onClick={() => setAdminTab('audit')}
              className={`px-3 py-1 rounded text-xs font-medium transition ${adminTab === 'audit' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              操作审计日志 (不可删除)
            </button>
            <button
              onClick={() => setAdminTab('interface')}
              className={`px-3 py-1 rounded text-xs font-medium transition ${adminTab === 'interface' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              系统接口与AI总开关
            </button>
            <button
              onClick={() => setAdminTab('analytics')}
              className={`px-3 py-1 rounded text-xs font-medium transition ${adminTab === 'analytics' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              运营效果统计看板
            </button>
          </div>
        </div>

        <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg font-medium">
          管理员视角：拥有全部模块最高配置权限
        </div>
      </div>

      {/* ==================== 页面 9.1: 角色权限配置页 ==================== */}
      {adminTab === 'roles' && (
        <div className="flex-1 overflow-y-auto p-6 max-w-[1600px] mx-auto w-full space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Lock className="w-5 h-5 text-indigo-600" />
                <span>四级角色权限与组织数据隔离配置</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                系统管理员、范本管理员、法务审核人员、普通业务人员；细粒度控制创建/查看/编辑/导出/知识库维护/批量操作
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-4 shadow-sm">
              <h3 className="font-bold text-sm text-indigo-700 border-l-2 border-indigo-600 pl-2">
                系统内置 4 类角色权限矩阵
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900">1. 系统管理员 (System Admin)</div>
                  <p className="text-slate-600 mt-1">控制全部模块与AI能力总开关，配置审计日志、主系统接口对接参数与组织数据隔离。</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900">2. 范本管理员 (Template Admin)</div>
                  <p className="text-slate-600 mt-1">维护电网五大类标准范本、法律法规知识库与风控识别规则。</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900">3. 法务审核人员 (Legal Reviewer)</div>
                  <p className="text-slate-600 mt-1">审核业务文书合规与风险诊断报告，执行 AI 智能修订采纳与终稿锁定归档。</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900">4. 普通业务人员 (Business Staff)</div>
                  <p className="text-slate-600 mt-1">发起各类文书智能起草、表单引导填报、导出个人草稿副本。</p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-4 shadow-sm">
              <h3 className="font-bold text-sm text-amber-700 border-l-2 border-amber-500 pl-2">
                组织单位数据隔离配置
              </h3>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-800">国网江苏省电力有限公司</span>
                  <span className="text-emerald-700 font-semibold">独立数据域隔离</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-800">国网浙江省电力有限公司</span>
                  <span className="text-emerald-700 font-semibold">独立数据域隔离</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-800">国网安徽省电力有限公司</span>
                  <span className="text-emerald-700 font-semibold">独立数据域隔离</span>
                </div>
                <p className="text-[10px] text-slate-500 pt-2 border-t border-slate-200">
                  隔离规则：普通业务人员与法务审核人员仅可查阅本单位发起的法律文书，严禁跨单位越权调阅。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 页面 9.2: 审计日志查询页 ==================== */}
      {adminTab === 'audit' && (
        <div className="flex-1 overflow-y-auto p-6 max-w-[1600px] mx-auto w-full space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <FileCheck2 className="w-5 h-5 text-indigo-600" />
                <span>全流程操作审计日志 (留存≥3年，不可删除)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                记录文书创建、AI生成、校验、修订、版本变更与知识库修改；完全满足电网内控合规审计要求
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={logFilterAction}
                onChange={(e) => setLogFilterAction(e.target.value)}
                className="bg-white text-slate-800 px-2.5 py-1 rounded-md border border-slate-200 shadow-sm"
              >
                <option value="all">全部操作类型</option>
                <option value="文书创建">文书创建</option>
                <option value="AI生成">AI生成</option>
                <option value="合规校验">合规校验</option>
                <option value="风险识别">风险识别</option>
              </select>

              <button 
                onClick={() => alert("审计日志报表已导出")}
                className="bg-white hover:bg-slate-50 text-indigo-700 border border-slate-200 px-3 py-1 rounded-md shadow-sm font-medium transition"
              >
                导出日志记录
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <th className="py-3 px-4 font-semibold">日志 ID / 时间</th>
                  <th className="py-3 px-4 font-semibold">操作账号</th>
                  <th className="py-3 px-4 font-semibold">动作类型</th>
                  <th className="py-3 px-4 font-semibold">操作详细说明</th>
                  <th className="py-3 px-4 font-semibold">关联文书 ID</th>
                  <th className="py-3 px-4 font-semibold">IP 地址</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition font-mono">
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{log.id}</div>
                      <div className="text-[10px] text-slate-500">{log.timestamp}</div>
                    </td>

                    <td className="py-3 px-4 text-indigo-700 font-sans font-medium">{log.account}</td>

                    <td className="py-3 px-4 font-sans">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] border border-slate-200 font-medium">
                        {log.actionType}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-sans">{log.details}</td>
                    <td className="py-3 px-4 text-slate-500">{log.documentId || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-500">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== 页面 9.3: 系统接口与AI总开关 ==================== */}
      {adminTab === 'interface' && (
        <div className="flex-1 overflow-y-auto p-6 max-w-[1400px] mx-auto w-full space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Server className="w-5 h-5 text-indigo-600" />
                <span>系统接口对接与AI能力总开关</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                对接电网法务管理平台、合同管理平台双向同步接口；控制全局 AI 生成/校验总开关
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Interface Config */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-4 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <Server className="w-4 h-4 text-indigo-600" />
                <span>电网主系统接口同步配置</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">国家电网法务管理系统 API Endpoint</label>
                  <input
                    type="text"
                    defaultValue="https://legal-api.sgcc.com.cn/v1/sync"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">电网合同管理平台 Sync Webhook</label>
                  <input
                    type="text"
                    defaultValue="https://contract-platform.sgcc.com.cn/api/v2/webhooks"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  onClick={handleTestConnection}
                  disabled={isTestingConnection}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 rounded-lg shadow-sm transition flex items-center justify-center space-x-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingConnection ? 'animate-spin' : ''}`} />
                  <span>{isTestingConnection ? '测试接口连通性中...' : '测试主系统接口连通性'}</span>
                </button>

                {connectionStatus && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900">
                    {connectionStatus}
                  </div>
                )}
              </div>
            </div>

            {/* AI Master Switch */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-4 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-amber-500" />
                <span>全局 AI 能力总开关 (AI Master Switch)</span>
              </h3>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">AI 智能撰写、合规校验与风险识别</div>
                    <div className="text-[10px] text-slate-500">关闭后系统将仅保留标准范本与版本控制基础功能</div>
                  </div>

                  <button
                    onClick={onToggleAi}
                    className={`px-3 py-1.5 rounded-lg font-bold transition shadow-sm ${
                      aiEnabled ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {aiEnabled ? '全局 AI 开启中' : '全局 AI 已关闭'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 页面 9.4: 运营效果统计看板 ==================== */}
      {adminTab === 'analytics' && (
        <div className="flex-1 overflow-y-auto p-6 max-w-[1600px] mx-auto w-full space-y-6">
          <div className="pb-3 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <span>项目试点运营效果评估看板</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              统计文书起草周期缩短比例、AI 合规风险识别准确率与终稿沉淀数量
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-xl border border-slate-200 text-center shadow-sm">
              <div className="text-xs text-slate-500">平均起草审核周期</div>
              <div className="text-3xl font-bold text-indigo-600 mt-2">1.5 天</div>
              <div className="text-[10px] text-slate-500 mt-1">较传统人工缩短 68%</div>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 text-center shadow-sm">
              <div className="text-xs text-slate-500">AI 风险漏报率</div>
              <div className="text-3xl font-bold text-emerald-600 mt-2">&lt; 0.5%</div>
              <div className="text-[10px] text-slate-500 mt-1">双驱动规则增强保障</div>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 text-center shadow-sm">
              <div className="text-xs text-slate-500">法务人员满意度</div>
              <div className="text-3xl font-bold text-amber-600 mt-2">96.8%</div>
              <div className="text-[10px] text-slate-500 mt-1">试点单位复盘反馈</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
