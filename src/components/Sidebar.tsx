import React from 'react';
import { 
  LayoutDashboard, 
  PenTool, 
  ShieldCheck, 
  FileDiff, 
  Archive, 
  BookOpen, 
  Settings, 
  Workflow, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { UserRole } from '../types';

export type NavTab = 
  | 'dashboard'
  | 'drafting'
  | 'review'
  | 'revision'
  | 'version'
  | 'knowledge'
  | 'admin'
  | 'workflow_spec';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  currentRole: UserRole;
  pendingReviewCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  currentRole,
  pendingReviewCount
}) => {
  const menuItems: {
    id: NavTab;
    label: string;
    icon: React.ElementType;
    desc: string;
    badge?: number;
    adminOnly?: boolean;
  }[] = [
    {
      id: 'dashboard',
      label: '首页工作台',
      icon: LayoutDashboard,
      desc: '统计指标、待办任务与快捷入口'
    },
    {
      id: 'drafting',
      label: '文书智能撰写',
      icon: PenTool,
      desc: '表单引导、模板生成与AI智能起草'
    },
    {
      id: 'review',
      label: '文书审查中心',
      icon: ShieldCheck,
      desc: '法规/制度校验、四级风险识别与批量审查',
      badge: pendingReviewCount
    },
    {
      id: 'revision',
      label: '智能修订工作台',
      icon: FileDiff,
      desc: 'AI建议采纳、对话式修订与条款润色'
    },
    {
      id: 'version',
      label: '文书版本归档库',
      icon: Archive,
      desc: '多版本快照、双栏差异比对与终稿锁定'
    },
    {
      id: 'knowledge',
      label: '电网法律知识库',
      icon: BookOpen,
      desc: '范本库、电力法规制度与风险规则配置'
    },
    {
      id: 'admin',
      label: '系统管理',
      icon: Settings,
      desc: '角色权限、审计日志、接口与AI总开关',
      adminOnly: true
    },
    {
      id: 'workflow_spec',
      label: '核心流程与原型说明',
      icon: Workflow,
      desc: '业务流程图、交互逻辑与验收核对表'
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none shadow-xl">
      {/* Primary Navigation Menu */}
      <div className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-800">
        <span>系统一级导航</span>
        <span className="text-[10px] text-emerald-400 font-normal">电网内网环境</span>
      </div>

      <nav className="flex-1 py-2 px-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          if (item.adminOnly && currentRole !== 'sys_admin') {
            return null; // hide or disable for non-admin
          }

          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full group text-left px-3 py-2.5 rounded-lg transition-all duration-150 flex items-center justify-between ${
                isActive 
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/30 font-semibold shadow-sm' 
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <div className={`p-1.5 rounded-md transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-indigo-400 group-hover:bg-slate-800/90'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs tracking-wide">{item.label}</div>
                  <div className={`text-[10px] truncate ${isActive ? 'text-indigo-300/80' : 'text-slate-500'}`}>
                    {item.desc}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-indigo-600 text-white' : 'bg-amber-500 text-slate-950'}`}>
                    {item.badge}
                  </span>
                )}
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'text-indigo-400 translate-x-0.5' : 'text-slate-600 opacity-0 group-hover:opacity-100'}`} />
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Banner */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg p-2.5 text-xs text-slate-300">
          <div className="flex items-center space-x-1.5 font-bold text-indigo-400 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI法律强辅助</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            所有生成文书需经法务人员复核确认，系统自动写入审计日志。
          </p>
        </div>
      </div>
    </aside>
  );
};
