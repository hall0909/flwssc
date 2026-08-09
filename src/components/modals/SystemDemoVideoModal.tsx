import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  X, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  ShieldAlert, 
  FileDiff, 
  Database, 
  MousePointer, 
  Subtitles, 
  Copy, 
  Check, 
  ExternalLink,
  FastForward,
  Clock,
  Layers,
  Award
} from 'lucide-react';
import { NavTab } from '../Sidebar';

interface SystemDemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: NavTab) => void;
}

interface Chapter {
  id: string;
  startTime: number; // in seconds
  endTime: number;
  title: string;
  tab: NavTab;
  narration: string;
  screenTitle: string;
  highlights: string[];
}

const VIDEO_CHAPTERS: Chapter[] = [
  {
    id: 'ch1',
    startTime: 0,
    endTime: 25,
    title: '一、核心能力与控制塔总览',
    tab: 'dashboard',
    screenTitle: '国家电网法务与合规控制塔仪表盘',
    narration: '欢迎使用国家电网法律文书智能生成系统！本系统依托电网法规库与AI大模型，打造集“智能起草、合规审查、风险识别、痕迹修订与版本追溯”于一体的全生命周期平台。在系统控制塔，您可以实时监控全省法律文书规避风险数、合规率及审查效率。',
    highlights: ['全省文书合规率 98.4%', 'AI 合规自动校验 1,248 份', '高风险条款自动拦截预警']
  },
  {
    id: 'ch2',
    startTime: 25,
    endTime: 65,
    title: '二, 智能起草与 A4 表单拟稿',
    tab: 'drafting',
    screenTitle: 'A4 智能向导表单拟稿与模板填充',
    narration: '第二模块是智能起草。业务人员只需挑选电力工程、设备采购或法务函件模板，填写关键表单要素，系统即可一键生成规范的 A4 格式文书正文。右侧侧边栏集成了电网知识库与法条助手，支持一键插入标准示范条款。',
    highlights: ['结构化表单一键回填 A4 正文', '智能推荐电网标准示范条款', '合规校验与风险识别一键触发']
  },
  {
    id: 'ch3',
    startTime: 65,
    endTime: 105,
    title: '三、一键合规审查与国网法规匹配',
    tab: 'review',
    screenTitle: '文书合规审查中心 (A4 纸面高亮与审查 Dock)',
    narration: '进入合规审查中心，系统自动对照《民法典》、建筑法规及国家电网内部制度进行深度校验。问题条款会在 A4 纸面上以红、黄高亮标出。右侧合规 Dock 展示强制性与建议性校验项，并支持一键转智能修订。',
    highlights: ['红划线高亮显示强制不合规条款', '自动比对《建设工程质量保证金管理办法》', '支持一键生成全篇合规诊断报告']
  },
  {
    id: 'ch4',
    startTime: 105,
    endTime: 145,
    title: '四、痕迹智能修订与 AI Copilot 协同',
    tab: 'revision',
    screenTitle: '智能修订工作台 (痕迹比对与 AI 对话助手)',
    narration: '在智能修订工作台，系统将法务审查意见映射为直观的修改痕迹卡片。您可以点击【采纳】或【拒绝】单项建议，也可使用 AI Copilot 助手发送指令，例如“将争议管辖变更为发包人所在地法院”，系统将实时更新纸面痕迹。',
    highlights: ['红绿对比直观保留修改痕迹', '一键采纳/拒绝法务修改建议', 'AI 助手对话式挂载修订条款']
  },
  {
    id: 'ch5',
    startTime: 145,
    endTime: 170,
    title: '五、版本红绿比对与终稿锁定归档',
    tab: 'version',
    screenTitle: '版本全生命周期追溯与锁定归档',
    narration: '系统具备严密的版本控制机制。支持 V1.0 初稿与 V2.0 审定稿之间逐字逐句的红绿 Diff 差异比对。确认无误后，法务主管可点击【锁定归档为终稿】，系统将归档快照并禁止后续未经授权的篡改。',
    highlights: ['左右双栏直观对比文本增删', '支持历史版本一键恢复快照', '终稿锁定归档与加密防护']
  },
  {
    id: 'ch6',
    startTime: 170,
    endTime: 180,
    title: '六、知识库管理与安全审计结语',
    tab: 'knowledge',
    screenTitle: '法务知识库体系与全流程安全审计',
    narration: '最后，系统内置了电网五大类标准范本与知识库规则管理，同时记录全流程安全操作日志。感谢观看国家电网法律文书智能生成系统演示视频，欢迎立即亲自体验！',
    highlights: ['法规条款与风险规则在线维护', '全流程 100% 审计日志留痕', '赋能电网企业法务内控合规管理']
  }
];

export const SystemDemoVideoModal: React.FC<SystemDemoVideoModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [currentTime, setCurrentTime] = useState<number>(0); // 0 to 180 seconds
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [enableVoiceover, setEnableVoiceover] = useState<boolean>(true);
  const [syncWithAppTab, setSyncWithAppTab] = useState<boolean>(true);

  const videoContainerRef = useRef<HTMLDivElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Determine current chapter
  const currentChapter = VIDEO_CHAPTERS.find(
    c => currentTime >= c.startTime && currentTime < c.endTime
  ) || VIDEO_CHAPTERS[VIDEO_CHAPTERS.length - 1];

  // Auto sync active tab with background system when playing
  useEffect(() => {
    if (isPlaying && syncWithAppTab && currentChapter) {
      onNavigateTab(currentChapter.tab);
    }
  }, [currentChapter?.id, isPlaying, syncWithAppTab, onNavigateTab]);

  // Auto increment video timer
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 180) {
            setIsPlaying(false);
            return 180;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  // Speech synthesis voiceover
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (!isPlaying || isMuted || !enableVoiceover) {
        window.speechSynthesis.cancel();
      } else if (currentChapter) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentChapter.narration);
        utterance.lang = 'zh-CN';
        utterance.rate = playbackSpeed;
        speechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentChapter?.id, isPlaying, isMuted, playbackSpeed, enableVoiceover]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
  };

  const handleCopyScript = () => {
    const fullText = VIDEO_CHAPTERS.map(c => `【${c.title}】(${formatTime(c.startTime)} - ${formatTime(c.endTime)})\n${c.narration}\n重点：${c.highlights.join(' | ')}`).join('\n\n');
    navigator.clipboard.writeText(fullText);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleTryScene = (tab: NavTab) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    onClose();
    onNavigateTab(tab);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div 
        ref={videoContainerRef}
        className={`bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isFullscreen 
            ? 'w-full h-full rounded-none border-none' 
            : 'max-w-6xl w-full max-h-[92vh] h-[850px]'
        }`}
      >
        
        {/* Top Video Window Bar */}
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
              <span>🎥</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm text-slate-100">国家电网法律文书智能生成系统 · 核心功能 3 分钟演示视频</h3>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-500/30 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>4K 演示级播报</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400">核心流程一边演示一边解说（控制塔 → 智能起草 → 一键合规 → 痕迹修订 → 版本比对）</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyScript}
              className="hidden sm:flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
              title="复制完整解说词与解说剧本"
            >
              {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
              <span>{copiedScript ? '已复制解说脚本' : '导出解说词'}</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title={isFullscreen ? "退出全屏" : "全屏播放"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="关闭视频"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Main Body Layout (Left Video Screen Stage + Right Chapters & Script) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-black">
          
          {/* Left: Animated Simulated Video Screen Stage (Cols 1-8) */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-slate-950 relative overflow-hidden group">
            
            {/* Simulated Live Video Screen Render */}
            <div className="flex-1 relative bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 p-4 sm:p-6 flex flex-col justify-between overflow-hidden">
              
              {/* Background Tech Grid Lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none"></div>

              {/* Watermark & Time Indicator */}
              <div className="flex flex-wrap items-center justify-between gap-2 z-10 shrink-0">
                <div className="flex items-center space-x-2 bg-slate-900/90 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-800 shadow-md">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-mono text-indigo-300 font-bold">{formatTime(currentTime)}</span>
                  <span className="text-slate-500">/ 03:00</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSyncWithAppTab(!syncWithAppTab)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition flex items-center space-x-1.5 ${
                      syncWithAppTab 
                        ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700 shadow-sm' 
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                    title="开启后播放视频会自动同步切换后台系统页面"
                  >
                    <span className={`w-2 h-2 rounded-full ${syncWithAppTab ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
                    <span>{syncWithAppTab ? '⚡ 主界面同步联动中' : '静态演示模式'}</span>
                  </button>

                  <div className="hidden sm:flex items-center space-x-2 bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    <span>REC · 原型画面同步推流</span>
                  </div>
                </div>
              </div>

              {/* Central Video Screen Canvas (Dynamic Animated UI Preview for current Chapter) */}
              <div className="my-auto z-10 w-full max-w-2xl mx-auto bg-slate-900/90 rounded-2xl border border-indigo-500/30 p-5 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
                
                {/* Simulated Cursor Animation */}
                {isPlaying && (
                  <div className="absolute z-30 transition-all duration-700 ease-in-out pointer-events-none" style={{
                    top: `${40 + Math.sin(currentTime) * 20}%`,
                    left: `${50 + Math.cos(currentTime * 0.8) * 30}%`
                  }}>
                    <MousePointer className="w-5 h-5 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)] fill-indigo-500" />
                  </div>
                )}

                {/* Top Stage Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                    <span className="text-xs font-bold text-slate-200 ml-2">{currentChapter.screenTitle}</span>
                  </div>

                  <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded font-mono">
                    演示视角: {currentChapter.title}
                  </span>
                </div>

                {/* Stage Content based on Chapter */}
                <div className="space-y-4">
                  
                  {currentChapter.id === 'ch1' && (
                    <div className="space-y-3 animate-fadeIn">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-center">
                          <div className="text-[10px] text-slate-400">规避法律风险</div>
                          <div className="text-xl font-bold text-emerald-400 mt-1">128 项</div>
                        </div>
                        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-center">
                          <div className="text-[10px] text-slate-400">合规通过率</div>
                          <div className="text-xl font-bold text-indigo-400 mt-1">98.4%</div>
                        </div>
                        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-center">
                          <div className="text-[10px] text-slate-400">审阅用时缩短</div>
                          <div className="text-xl font-bold text-amber-400 mt-1">75%</div>
                        </div>
                      </div>
                      <div className="p-3 bg-indigo-950/60 rounded-xl border border-indigo-800/50 text-xs text-indigo-200 flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
                        <span>正在监控国网江苏、浙江、上海等单位法律文书起草与全流程合规控制塔...</span>
                      </div>
                    </div>
                  )}

                  {currentChapter.id === 'ch2' && (
                    <div className="space-y-3 animate-fadeIn">
                      <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 text-xs space-y-2">
                        <div className="flex justify-between text-slate-300 font-semibold">
                          <span>表单智能填充: 110kV 输变电工程施工合同范本</span>
                          <span className="text-emerald-400 text-[10px]">自动就位</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="bg-slate-900 p-2 rounded border border-slate-800 text-slate-300">发包方: 国网江苏省电力有限公司</div>
                          <div className="bg-slate-900 p-2 rounded border border-slate-800 text-slate-300">承包方: 华东电力建设工程总公司</div>
                          <div className="bg-slate-900 p-2 rounded border border-slate-800 text-slate-300">计划开工: 2026-09-01</div>
                          <div className="bg-slate-900 p-2 rounded border border-slate-800 text-slate-300">质保金留扣: 3% (符合建质138号)</div>
                        </div>
                      </div>
                      <div className="text-[11px] text-emerald-400 bg-emerald-950/50 p-2 rounded border border-emerald-800 flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>已回填生成 A4 标准格式文书，具备完整的第一条至第五条条款结构！</span>
                      </div>
                    </div>
                  )}

                  {currentChapter.id === 'ch3' && (
                    <div className="space-y-3 animate-fadeIn">
                      <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-800/60 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-rose-300 font-bold flex items-center space-x-1">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                            <span>合规性强力预警 (质保金留扣上限超标)</span>
                          </span>
                          <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">强制不合规</span>
                        </div>
                        <p className="text-[11px] text-slate-300 bg-slate-900/80 p-2 rounded border border-slate-800 font-serif">
                          原文条款：<span className="line-through text-rose-400">“(4) 剩余10%作为质量保证金，质保期满24个月后无息退还。”</span>
                        </p>
                        <p className="text-[10px] text-slate-400">依据依据：住建部《建设工程质量保证金管理办法》（建质〔2017〕138号）第六条规定保证金扣留比例上限不得高于工程价款结算总额的3%。</p>
                      </div>
                    </div>
                  )}

                  {currentChapter.id === 'ch4' && (
                    <div className="space-y-3 animate-fadeIn">
                      <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-300 flex items-center space-x-1">
                            <FileDiff className="w-3.5 h-3.5 text-indigo-400" />
                            <span>智能修订比对卡片</span>
                          </span>
                          <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">待审批复</span>
                        </div>
                        <div className="bg-slate-900 p-2.5 rounded border border-slate-800 space-y-1.5 text-[11px]">
                          <div className="text-rose-400 line-through">删除原文: (4) 剩余10%作为质量保证金，质保期满24个月后无息退还。</div>
                          <div className="text-emerald-400 font-semibold">替换为AI推荐: (4) 剩余3%作为质量保证金，质保期满24个月且无遗留质量缺陷后无息退还；乙方也可选择提供等额银行质量保函替代现金留扣。</div>
                        </div>
                        <div className="flex justify-end space-x-2 pt-1">
                          <button className="bg-slate-700 text-slate-200 px-3 py-1 rounded text-[10px]">维持原文</button>
                          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded text-[10px] font-bold shadow-sm">✓ 采纳并替换原文</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentChapter.id === 'ch5' && (
                    <div className="space-y-3 animate-fadeIn">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                          <div className="font-bold text-slate-400 mb-1">V1.0 初稿 (表单生成)</div>
                          <p className="text-[10px] text-slate-400 font-serif leading-relaxed">争议管辖: 向南京仲裁委员会申请仲裁...</p>
                        </div>
                        <div className="bg-slate-900 p-2.5 rounded-lg border border-indigo-800/80">
                          <div className="font-bold text-indigo-300 mb-1">V2.0 终稿 (法务审定)</div>
                          <p className="text-[10px] text-emerald-400 font-serif leading-relaxed">争议管辖: 向发包方所在地 (南京市) 有管辖权的人民法院提起诉讼。</p>
                        </div>
                      </div>
                      <div className="p-2 bg-amber-950/50 rounded-lg border border-amber-800/80 text-[11px] text-amber-200 flex items-center justify-between">
                        <span>🔒 该文书已锁定归档为终稿快照，不可随意篡改</span>
                        <span className="font-mono text-[10px] text-amber-400">HASH: e89a2b71f</span>
                      </div>
                    </div>
                  )}

                  {currentChapter.id === 'ch6' && (
                    <div className="space-y-3 text-center py-2 animate-fadeIn">
                      <Award className="w-10 h-10 text-amber-400 mx-auto animate-bounce" />
                      <h4 className="font-bold text-sm text-slate-100">国家电网法律文书智能生成系统</h4>
                      <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                        提质增效 · 严防风险 · 规范统一 · 数智护航电网高质量发展
                      </p>
                      <button 
                        onClick={() => handleTryScene('dashboard')}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2 rounded-xl transition shadow-lg inline-flex items-center space-x-1.5"
                      >
                        <span>🚀 立即进入系统亲自体验</span>
                      </button>
                    </div>
                  )}

                </div>

                {/* Highlights Bar */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
                  {currentChapter.highlights.map((hl, idx) => (
                    <span key={idx} className="bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 text-[10px] px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <span className="text-amber-400">★</span>
                      <span>{hl}</span>
                    </span>
                  ))}
                </div>

              </div>

              {/* Subtitles Overlay Bar */}
              {showSubtitles && (
                <div className="z-10 bg-slate-900/90 border border-slate-800 p-3 rounded-xl backdrop-blur-md max-w-3xl mx-auto w-full text-center text-xs text-slate-200 leading-relaxed shadow-lg mt-3">
                  <div className="flex items-center justify-center space-x-2 text-indigo-400 font-semibold text-[10px] mb-1">
                    <Subtitles className="w-3.5 h-3.5" />
                    <span>AI 旁白实时解说字幕</span>
                  </div>
                  <p className="font-medium text-slate-100 text-sm tracking-wide">
                    {currentChapter.narration}
                  </p>
                </div>
              )}

            </div>

            {/* Video Control Bar at Bottom */}
            <div className="bg-slate-900 border-t border-slate-800 p-3 flex flex-col space-y-2 shrink-0">
              
              {/* Progress Slider Bar */}
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono text-indigo-400 w-10 text-right">{formatTime(currentTime)}</span>
                
                <div className="flex-1 relative flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="0.5"
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
                  />
                  {/* Chapter Markers */}
                  {VIDEO_CHAPTERS.map(ch => (
                    <div 
                      key={ch.id}
                      className="absolute w-1.5 h-3 bg-slate-600 hover:bg-amber-400 cursor-pointer rounded-full transition transform -translate-x-1/2"
                      style={{ left: `${(ch.startTime / 180) * 100}%` }}
                      onClick={() => setCurrentTime(ch.startTime)}
                      title={`跳至 ${ch.title}`}
                    />
                  ))}
                </div>

                <span className="text-xs font-mono text-slate-500 w-10">03:00</span>
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-3">
                  {/* Play / Pause */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition shadow-md"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>

                  {/* Reset */}
                  <button
                    onClick={() => {
                      setCurrentTime(0);
                      setIsPlaying(true);
                    }}
                    className="p-2 text-slate-400 hover:text-white rounded-lg transition"
                    title="重新播放"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* Mute/Voiceover */}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-2 rounded-lg transition ${isMuted ? 'text-rose-400 bg-rose-950/40' : 'text-slate-400 hover:text-white'}`}
                    title={isMuted ? "取消静音" : "开启/静音旁白"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  {/* Toggle Voiceover Speech Synthesis */}
                  <button
                    onClick={() => setEnableVoiceover(!enableVoiceover)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${enableVoiceover ? 'bg-indigo-950 text-indigo-300 border-indigo-800' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
                  >
                    {enableVoiceover ? '🔊 AI 配音开启' : '🔇 纯字幕模式'}
                  </button>

                  {/* Subtitles Toggle */}
                  <button
                    onClick={() => setShowSubtitles(!showSubtitles)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${showSubtitles ? 'bg-slate-800 text-slate-200 border-slate-700' : 'text-slate-500 border-transparent'}`}
                  >
                    CC 字幕
                  </button>
                </div>

                {/* Speed Controls */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline">播放速度:</span>
                  {[1.0, 1.25, 1.5, 2.0].map(speed => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`text-[11px] px-2 py-0.5 rounded font-mono transition ${playbackSpeed === speed ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>

              </div>

            </div>

          </div>

          {/* Right: Chapter Navigator & Full Script (Cols 9-12) */}
          <div className="lg:col-span-4 bg-slate-900 border-l border-slate-800 flex flex-col h-full overflow-hidden">
            
            <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h4 className="font-bold text-xs text-slate-200">演示章节与交互导航</h4>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">6 个核心模块</span>
            </div>

            {/* Chapters List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {VIDEO_CHAPTERS.map((ch, idx) => {
                const isActive = currentChapter.id === ch.id;
                return (
                  <div
                    key={ch.id}
                    className={`p-3 rounded-xl border transition cursor-pointer ${
                      isActive 
                        ? 'bg-indigo-950/80 border-indigo-600 text-white shadow-md' 
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/60'
                    }`}
                    onClick={() => {
                      setCurrentTime(ch.startTime);
                      setIsPlaying(true);
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`font-bold text-xs ${isActive ? 'text-indigo-300' : 'text-slate-300'}`}>
                        {ch.title}
                      </span>
                      <span className="text-[10px] font-mono bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                        {formatTime(ch.startTime)} - {formatTime(ch.endTime)}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
                      {ch.narration}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/50">
                      <div className="flex items-center space-x-1 text-[10px] text-slate-500">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>时长 {ch.endTime - ch.startTime}s</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTryScene(ch.tab);
                        }}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1 hover:underline"
                      >
                        <span>亲自体验</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Presentation Script Export Box */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 shrink-0">
              <button
                onClick={handleCopyScript}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2 rounded-xl border border-slate-700 transition flex items-center justify-center space-x-2 font-medium"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
                <span>{copiedScript ? '解说词全文本已复制到剪贴板！' : '复制 3 分钟解说词全剧本'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
