import React, { useState } from 'react';
import { 
  Workflow, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  ShieldAlert, 
  FileText, 
  Lock, 
  Cpu, 
  Database, 
  BookOpen,
  FileCheck2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const WorkflowLogicVisualizer: React.FC = () => {
  const [activeChain, setActiveChain] = useState<'chain1' | 'chain2' | 'chain3'>('chain1');
  const [expandedSection, setExpandedSection] = useState<string>('wireframes');

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 text-slate-800 overflow-y-auto p-6 max-w-[1800px] mx-auto w-full space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-xl p-6 text-white shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-white/10 text-white rounded-lg font-bold backdrop-blur-sm">
            <Workflow className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">国家电网法律文书智能生成系统 - 核心业务流程与交互逻辑说明</h1>
            <p className="text-xs text-indigo-100 mt-1">
              匹配《需求规格书 V1.0》与《原型设计说明书》，详细呈现三大业务链路、页面结构、流转逻辑与非功能约束
            </p>
          </div>
        </div>
      </div>

      {/* 3 Core Business Workflow Chains Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <h2 className="text-sm font-bold text-indigo-700 uppercase tracking-wider border-l-2 border-indigo-600 pl-2">
          三大核心业务流转链路 (Full Business Flow)
        </h2>

        {/* Chain Selector */}
        <div className="flex space-x-2 border-b border-slate-200 pb-3 text-xs">
          <button
            onClick={() => setActiveChain('chain1')}
            className={`px-4 py-2 rounded-lg font-bold transition ${activeChain === 'chain1' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}
          >
            链路 1：单篇文书全生命周期 (新建→撰写→校验→风险→修订→归档)
          </button>
          <button
            onClick={() => setActiveChain('chain2')}
            className={`px-4 py-2 rounded-lg font-bold transition ${activeChain === 'chain2' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}
          >
            链路 2：存量文书批量审查链路
          </button>
          <button
            onClick={() => setActiveChain('chain3')}
            className={`px-4 py-2 rounded-lg font-bold transition ${activeChain === 'chain3' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}
          >
            链路 3：知识库维护支撑业务起草链路
          </button>
        </div>

        {/* Chain 1 Flow Visualization */}
        {activeChain === 'chain1' && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 text-xs">
            <div className="font-bold text-indigo-900">链路 1：主流转步骤说明</div>
            
            <div className="grid grid-cols-1 md:grid-cols-6 gap-2 text-center">
              <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1 shadow-sm">
                <div className="font-bold text-indigo-700 text-[11px]">1. 首页新建</div>
                <p className="text-[10px] text-slate-500">选择场景模板或填报表单</p>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1 shadow-sm">
                <div className="font-bold text-indigo-700 text-[11px]">2. AI 智能撰写</div>
                <p className="text-[10px] text-slate-500">浅蓝底色标注，生成初稿</p>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1 shadow-sm">
                <div className="font-bold text-indigo-700 text-[11px]">3. 一键合规校验</div>
                <p className="text-[10px] text-slate-500">识别强制不合规与建议</p>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1 shadow-sm">
                <div className="font-bold text-indigo-700 text-[11px]">4. 四级风险识别</div>
                <p className="text-[10px] text-slate-500">严重/高/一般/低风险分类</p>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1 shadow-sm">
                <div className="font-bold text-indigo-700 text-[11px]">5. 智能修订采纳</div>
                <p className="text-[10px] text-slate-500">单条采纳、对话式修改</p>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1 shadow-sm">
                <div className="font-bold text-indigo-700 text-[11px]">6. 快照终稿归档</div>
                <p className="text-[10px] text-slate-500">锁定版本，写入审计日志</p>
              </div>
            </div>
          </div>
        )}

        {/* Chain 2 */}
        {activeChain === 'chain2' && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="font-bold text-indigo-900">链路 2：存量合同批量审查步骤</div>
            <p className="text-slate-700 leading-relaxed">
              首页进入【批量存量审查页面】 → 拖拽批量上传多份 Word/PDF 文书 → 触发批量合规与风险诊断运算 → 导出汇总 ZIP 报表包 → 点开单份执行 AI 修订。
            </p>
          </div>
        )}

        {/* Chain 3 */}
        {activeChain === 'chain3' && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="font-bold text-indigo-900">链路 3：知识库维护支撑业务步骤</div>
            <p className="text-slate-700 leading-relaxed">
              管理员维护标准范本、电力法规与风控规则 → 业务人员起草文书时检索并一键插入条款 → 规则同步支撑合规校验与风险识别。
            </p>
          </div>
        )}
      </div>

      {/* Wireframes & Page Interactive Logic List */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <h2 className="text-sm font-bold text-indigo-700 uppercase tracking-wider border-l-2 border-indigo-600 pl-2">
            全系统 14 个核心页面交互说明清单
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="font-bold text-indigo-900">首页工作台</div>
            <p className="text-slate-600">
              顶部展示月度生成数、合规校验次数、四级风险统计与采纳率；中间待办列表支持筛选；快捷卡片可一键跳转起草。
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="font-bold text-indigo-900">文书新建选择页</div>
            <p className="text-slate-600">
              左侧分类树导航五大文书；右侧展示细分场景，支持置顶收藏，弹窗选择【表单引导】/【空白范本】/【AI生成】。
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="font-bold text-indigo-900">引导式表单填写页</div>
            <p className="text-slate-600">
              包含电网专属字段（主体代码、标的金额、工期起止、质保金、付款节点、安全责任划分）；具备实时逻辑校验。
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="font-bold text-indigo-900">在线富文本编辑主页</div>
            <p className="text-slate-600">
              核心页面：AI 段落浅蓝底色标注，悬浮提示免责声明；右侧支持表单参数、知识条文、合规校验与风险清单标签切换。
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="font-bold text-indigo-900">单篇及批量合规审查页</div>
            <p className="text-slate-600">
              分为法律、制度、必备条款与格式 4 大维度；【强制不合规】标红；支持独立批量上传与打印级诊断报告。
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="font-bold text-indigo-900">风险识别与统计视图页</div>
            <p className="text-slate-600">
              四级风险颜色标记；配合 Recharts 饼图（风险等级分布）与柱状图（高频风险 TOP10），支持导出风险统计表。
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="font-bold text-indigo-900">智能修订与对话修改</div>
            <p className="text-slate-600">
              AI 建议对比框（原文灰色 vs 修订蓝框）；支持一键全部采纳；支持对话式自然语言指令改写与选中文本润色。
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="font-bold text-indigo-900">版本快照与双栏比对</div>
            <p className="text-slate-600">
              版本快照自动保存；勾选 2 个版本进行双栏差异比对（新增绿线/删除红线/修改黄亮）；归档终稿锁定禁止修改。
            </p>
          </div>

        </div>
      </div>

      {/* Non-functional & Security Specifications */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm text-xs">
        <h2 className="text-sm font-bold text-indigo-700 uppercase tracking-wider border-l-2 border-indigo-600 pl-2">
          非功能需求与电网安全约束说明 (匹配需求 4.0)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="font-bold text-amber-700">1. AI 可靠性与免责约束</div>
            <p className="text-slate-600">
              AI 仅作为辅助工具，不具备独立法律效力。所有 AI 生成段落必须强制标注 AI 标识，所有输出经法务人员复核后生效。
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="font-bold text-amber-700">2. 内网部署与信息安全</div>
            <p className="text-slate-600">
              业务敏感数据禁止外流出网；无任何外网下载或邮件发送入口；导出文件均强制附带电网内部涉密水印。
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="font-bold text-amber-700">3. 审计留存与性能保障</div>
            <p className="text-slate-600">
              全量操作日志留存不少于3年，不可删除；单份 100 页以内文书 AI 响应时间 ≤ 30 秒，解析最大支持 200 页。
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
