import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Bell, 
  UserCircle, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  Building2, 
  Lock,
  Cpu,
  Video,
  Play
} from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  selectedUnit: string;
  onUnitChange: (unit: string) => void;
  aiEnabled: boolean;
  onToggleAi: () => void;
  onOpenGlobalSearch: () => void;
  onOpenAIDisclaimer: () => void;
  onOpenSystemDemoVideo?: () => void;
  onStartLiveDemo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  selectedUnit,
  onUnitChange,
  aiEnabled,
  onToggleAi,
  onOpenGlobalSearch,
  onOpenAIDisclaimer,
  onOpenSystemDemoVideo,
  onStartLiveDemo
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUnitMenu, setShowUnitMenu] = useState(false);

  const units = [
    '国网江苏省电力有限公司',
    '国网浙江省电力有限公司',
    '国网安徽省电力有限公司',
    '国网上海市电力公司',
    '国家电网有限公司总部'
  ];

  const roles: { key: UserRole; label: string; desc: string }[] = [
    { key: 'business_staff', label: '普通业务人员', desc: '可创建草稿、填报表单、提交合规审查' },
    { key: 'legal_reviewer', label: '法务审核人员', desc: '可执行合规与风险审核、智能修订采纳' },
    { key: 'template_admin', label: '范本管理员', desc: '可维护电网五大类范本与知识库条文' },
    { key: 'sys_admin', label: '系统管理员', desc: '全权限：配置角色、审计日志、接口与AI开关' }
  ];

  return (
    <header className="bg-white text-slate-800 border-b border-slate-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-[1920px] mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Left Logo & Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-sm">
            <span>国网</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-base tracking-tight text-slate-900">国家电网法律文书智能生成系统</h1>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded border border-indigo-200">
                AI LexArchitect v2.0
              </span>
            </div>
            <p className="text-xs text-slate-500">State Grid Intelligent Legal Drafting & Review Platform</p>
          </div>
        </div>

        {/* Center Search & AI Indicator & Operation Demo */}
        <div className="hidden md:flex items-center space-x-3">
          <button 
            onClick={onOpenGlobalSearch}
            className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200/80 text-slate-600 text-xs px-3.5 py-1.5 rounded-lg border border-slate-200 transition w-56 shadow-inner"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">检索全库范本、法规...</span>
            <kbd className="ml-auto bg-white text-slate-500 text-[10px] px-1.5 py-0.5 rounded border border-slate-200">Ctrl+K</kbd>
          </button>

          {/* Operation Demo Button */}
          {onStartLiveDemo && (
            <button
              onClick={onStartLiveDemo}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm hover:shadow transition transform active:scale-95 border border-indigo-400/30"
              title="开启3分钟核心功能AI语音联动演示"
            >
              <Play className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
              <span>操作演示</span>
            </button>
          )}

          {/* AI Status Badge */}
          <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 text-xs">
            <div className="flex items-center space-x-1.5">
              <Cpu className={`w-3.5 h-3.5 ${aiEnabled ? 'text-indigo-600 animate-pulse' : 'text-slate-400'}`} />
              <span className="font-medium text-slate-700">AI引擎</span>
            </div>
            <button 
              onClick={onToggleAi}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${aiEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
              title={aiEnabled ? "点击关闭全局AI辅助功能" : "点击开启全局AI辅助功能"}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transform transition duration-200 ease-in-out ${aiEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
            <button 
              onClick={onOpenAIDisclaimer}
              className="text-[10px] text-indigo-600 hover:underline flex items-center space-x-0.5 ml-1 font-medium"
            >
              <ShieldAlert className="w-3 h-3 text-indigo-500" />
              <span>免责声明</span>
            </button>
          </div>
        </div>

        {/* Right Controls: Unit, Role, Notifications */}
        <div className="flex items-center space-x-3">
          
          {/* Unit Selector */}
          <div className="relative">
            <button 
              onClick={() => setShowUnitMenu(!showUnitMenu)}
              className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 transition"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span className="max-w-[120px] truncate">{selectedUnit}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showUnitMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1 z-50 text-xs">
                <div className="px-3 py-1.5 font-semibold text-slate-400 border-b border-slate-100">切换组织单位</div>
                {units.map((u) => (
                  <button
                    key={u}
                    onClick={() => {
                      onUnitChange(u);
                      setShowUnitMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${selectedUnit === u ? 'text-indigo-600 font-semibold bg-indigo-50/50' : 'text-slate-700'}`}
                  >
                    <span>{u}</span>
                    {selectedUnit === u && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role Switcher */}
          <div className="relative">
            <button 
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1.5 rounded-lg border border-indigo-200 transition"
            >
              <Lock className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-medium">
                {roles.find(r => r.key === currentRole)?.label}
              </span>
              <ChevronDown className="w-3 h-3 text-indigo-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1 z-50 text-xs">
                <div className="px-3 py-1.5 font-semibold text-slate-400 border-b border-slate-100">模拟系统角色（权限控制）</div>
                {roles.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => {
                      onRoleChange(r.key);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 transition ${currentRole === r.key ? 'bg-indigo-50 text-indigo-700 font-semibold border-l-2 border-indigo-600' : ''}`}
                  >
                    <div className="font-medium">{r.label}</div>
                    <div className="text-[10px] text-slate-500">{r.desc}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 relative transition border border-transparent hover:border-slate-200"
              title="消息通知"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-lg shadow-2xl border border-slate-200 p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <span className="font-bold text-slate-800">消息通知区 (3条未读)</span>
                  <span className="text-[10px] text-indigo-600 cursor-pointer hover:underline font-medium">全部已读</span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="font-semibold text-indigo-700">知识库法规更新提醒</div>
                    <div className="text-slate-600 text-[11px] mt-0.5">住建部印发《建设工程质量保证金管理办法》修订解读说明。</div>
                    <div className="text-[10px] text-slate-400 mt-1">10分钟前</div>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="font-semibold text-amber-800">高风险文书待复核</div>
                    <div className="text-slate-700 text-[11px] mt-0.5">《110kV输变电EPC合同》存在质保金扣留比例10%高风险隐患。</div>
                    <div className="text-[10px] text-amber-600 mt-1">30分钟前</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="font-semibold text-slate-800">范本版本更新通知</div>
                    <div className="text-slate-600 text-[11px] mt-0.5">《电网工程施工示范文本2025版》已由范本管理员更新上线。</div>
                    <div className="text-[10px] text-slate-400 mt-1">2小时前</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <UserCircle className="w-6 h-6 text-slate-500" />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold leading-none text-slate-800">张立华</div>
              <div className="text-[10px] text-slate-500 leading-tight mt-0.5">法务风控部</div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
