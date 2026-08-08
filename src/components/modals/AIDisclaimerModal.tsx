import React, { useState } from 'react';
import { ShieldAlert, Check } from 'lucide-react';

interface AIDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIDisclaimerModal: React.FC<AIDisclaimerModalProps> = ({ isOpen, onClose }) => {
  const [hasAcknowledged, setHasAcknowledged] = useState<boolean>(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-slate-100 space-y-5 animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">电网法务 AI 辅助免责声明提示</h3>
            <p className="text-[11px] text-slate-400">国家电网法律文书智能生成系统 - 安全合规提示</p>
          </div>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
          <p className="font-semibold text-amber-300">
            本系统 AI 仅为法律文书辅助工具，AI 生成内容存在大模型幻觉与条款误引风险，不具备独立法律效力。
          </p>
          <p>
            全部生成的合同条款、合规校验报告与风险诊断意见，必须由本单位具有资质的法务人员进行人工完整复核确认后方可签署盖章。
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            系统将严格对全流程 AI 交互、修订、采纳记录进行全操作审计留存（存照留存≥3年）。
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <input
            type="checkbox"
            id="acknowledge"
            checked={hasAcknowledged}
            onChange={(e) => setHasAcknowledged(e.target.checked)}
            className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
          />
          <label htmlFor="acknowledge" className="text-slate-300 cursor-pointer">
            我已知悉并承诺对 AI 输出的法律文书执行人工复核
          </label>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            disabled={!hasAcknowledged}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              hasAcknowledged 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>已知悉并开启 AI 功能</span>
          </button>
        </div>

      </div>
    </div>
  );
};
