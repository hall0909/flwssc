import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  X, 
  FastForward, 
  Clock, 
  Sparkles,
  Radio
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface DemoChapter {
  id: string;
  title: string;
  tab: NavTab;
  startTime: number; // in seconds
  endTime: number;
  narration: string;
}

const DEMO_CHAPTERS: DemoChapter[] = [
  {
    id: 'ch1',
    title: '一、首页控制塔全景风控',
    tab: 'dashboard',
    startTime: 0,
    endTime: 25,
    narration: '欢迎体验国家电网法律文书智能生成系统！该系统实现法律文书全流程智能化，聚焦在电力工程合同、采购合同、法务函件、制度文件、合规报告五大类核心法律文书场景，将AI能力融合到智能撰写、合规校验、风险识别、智能修订、版本管理等流程中，下面具体介绍其功能。'
  },
  {
    id: 'ch2',
    title: '二、智能范本选定与填报',
    tab: 'drafting',
    startTime: 25,
    endTime: 51,
    narration: '进入文书智能撰写，系统内置电网标准范本库。选择110千伏输变电工程EPC总承包范本，向导式录入发包方国网江苏电力、工程金额及质保金比例等关键要素，一键生成标准A4合同正文。这大幅降低了人工起草与要素编排的繁琐程度，将文本生成效率提升了80%以上。'
  },
  {
    id: 'ch3',
    title: '三、法规库联动与示范条款',
    tab: 'drafting',
    startTime: 51,
    endTime: 76,
    narration: '正文起草中，右侧国家电网法规库实时联动。检索反违章管理办法，可将电网安全生产示范条款一键插入合同正文，显著提升文书规范性。这有效确保了电力施工安全条款的依法严密，极大增强了合同履约的法律合规性与严谨度。'
  },
  {
    id: 'ch4',
    title: '四、一键合规校验与风险识别',
    tab: 'drafting',
    startTime: 76,
    endTime: 102,
    narration: '起草完成后，在顶部点击一键合规校验与风险一键识别。AI大模型瞬间对比国家法规与电网规章，实时扫描出质保金比例超标等潜在合规风险。这实现了对合同隐患的秒级精准扫描，有效预防了后续履行中的法律争议与经济损失。'
  },
  {
    id: 'ch5',
    title: '五、合规审查中心深度诊断',
    tab: 'review',
    startTime: 102,
    endTime: 129,
    narration: '自动跳转至合规审查中心，在A4纸面上以红黄双色精准高亮风险条款。系统清晰提示：质保金扣留比例5%超出法定3%上限，并给出权威合规替换建议。这彻底改变了传统人工逐字审查的低效模式，显著减轻了法务人员的核查负担并提高了审查准确率。'
  },
  {
    id: 'ch6',
    title: '六、一键跳转智能修改工作台',
    tab: 'revision',
    startTime: 129,
    endTime: 158,
    narration: '点击一键跳转智能修改工作台，审查意见转化为修改痕迹卡片。在右侧AI Copilot中输入自然语言指令：将质保金比例修改为3%，并变更管辖法院为发包方所在地南京市人民法院。这打通了从审查诊断到交互修改的无缝衔接，极大缩短了争议条款的沟通与法务修改周期。'
  },
  {
    id: 'ch7',
    title: '七、AI Copilot 人机协同留痕',
    tab: 'revision',
    startTime: 158,
    endTime: 181,
    narration: 'AI即刻在A4正文中生成红绿修改痕迹，点击一键采纳所有修改，高效完成条款的智能纠偏与最终确认。这大幅提升了人机协同修订的智能化水平，确保合同每一处修改均有据可查、清清楚楚。'
  },
  {
    id: 'ch8',
    title: '八、历史版本对照与全流程归档',
    tab: 'version',
    startTime: 181,
    endTime: 209,
    narration: '最后进入版本管理，点击查看历史版本对照，双栏直观比对起草稿与修订稿差异。确认无误后锁定终稿，生成区块链防篡改存证，完成合同全生命周期闭环！这确保了合同全流程数据可追溯与不可篡改，全面提升了企业法律事务全生命周期的合规闭环管理水平。'
  }
];

interface LiveOperationDemoProps {
  isRunning: boolean;
  onStop: () => void;
  onNavigateTab: (tab: NavTab) => void;
  onDemoTimeUpdate?: (time: number) => void;
}

export const LiveOperationDemo: React.FC<LiveOperationDemoProps> = ({
  isRunning,
  onStop,
  onNavigateTab,
  onDemoTimeUpdate
}) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeakingFinished, setIsSpeakingFinished] = useState<boolean>(false);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Find current chapter by time
  const currentChapter = DEMO_CHAPTERS.find(
    c => currentTime >= c.startTime && currentTime < c.endTime
  ) || DEMO_CHAPTERS[DEMO_CHAPTERS.length - 1];

  const totalTime = DEMO_CHAPTERS[DEMO_CHAPTERS.length - 1]?.endTime || 209;

  // Reset speech finished state whenever chapter changes
  useEffect(() => {
    setIsSpeakingFinished(false);
  }, [currentChapter?.id]);

  // Start timer when running & playing
  useEffect(() => {
    if (!isRunning) {
      setCurrentTime(0);
      setIsPlaying(true);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          // If we reach the end of current chapter, but speech hasn't finished yet and sound is on, hold time to let voice complete naturally
          if (prev + 1 >= currentChapter.endTime && !isSpeakingFinished && !isMuted) {
            return prev;
          }

          const nextTime = prev >= totalTime ? totalTime : prev + 1;
          if (nextTime >= totalTime) {
            setIsPlaying(false);
          }
          return nextTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPlaying, totalTime, currentChapter?.endTime, isSpeakingFinished, isMuted]);

  // Sync demo time with parent App component
  useEffect(() => {
    if (isRunning && onDemoTimeUpdate) {
      onDemoTimeUpdate(currentTime);
    }
  }, [currentTime, isRunning, onDemoTimeUpdate]);

  // Handle Tab Switch whenever Chapter changes
  useEffect(() => {
    if (isRunning && currentChapter) {
      onNavigateTab(currentChapter.tab);
    }
  }, [currentChapter?.id, isRunning, onNavigateTab]);

  // Voice Speech Synthesis (Rate = 1.25x)
  useEffect(() => {
    if (!isRunning) return;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any previous speech

      if (isPlaying && !isMuted && currentChapter) {
        const utterance = new SpeechSynthesisUtterance(currentChapter.narration);
        utterance.lang = 'zh-CN';
        utterance.rate = 1.25; // 语速设置为 1.25 倍，自然清晰且与动作完美对齐

        utterance.onend = () => {
          setIsSpeakingFinished(true);
        };
        utterance.onerror = () => {
          setIsSpeakingFinished(true);
        };

        speechUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentChapter?.id, isRunning, isPlaying, isMuted]);

  if (!isRunning) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      setIsPlaying(true);
    }
  };

  const handleNextChapter = () => {
    const currentIndex = DEMO_CHAPTERS.findIndex(c => c.id === currentChapter.id);
    if (currentIndex < DEMO_CHAPTERS.length - 1) {
      setCurrentTime(DEMO_CHAPTERS[currentIndex + 1].startTime);
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleStopDemo = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    onStop();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      {/* Sleek Floating Audio Player Capsule - Pure Voice Audio (No Text Output On Screen) */}
      <div className="bg-slate-900/95 text-white border border-indigo-500/40 rounded-2xl shadow-2xl backdrop-blur-md px-4 py-3 flex items-center space-x-3.5 max-w-md ring-1 ring-indigo-500/20">
        
        {/* Animated Equalizer Sound Wave */}
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/50 shrink-0 relative overflow-hidden">
          {isPlaying && !isMuted ? (
            <div className="flex items-end space-x-0.5 h-4">
              <span className="w-1 bg-indigo-400 rounded-full animate-pulse h-3"></span>
              <span className="w-1 bg-amber-400 rounded-full animate-pulse h-4" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-2" style={{ animationDelay: '300ms' }}></span>
              <span className="w-1 bg-indigo-300 rounded-full animate-pulse h-3.5" style={{ animationDelay: '450ms' }}></span>
            </div>
          ) : (
            <Radio className="w-4 h-4 text-slate-400" />
          )}
        </div>

        {/* Demo Status Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-100 truncate">
              {currentChapter.title}
            </span>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded shrink-0">
              1.25x 语速
            </span>
          </div>

          <div className="flex items-center space-x-2 mt-0.5">
            <span className="text-[11px] text-indigo-300 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-indigo-400 animate-spin" />
              <span>音画实时同步解说中</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {formatTime(currentTime)} / {formatTime(totalTime)}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1 shrink-0 pl-1 border-l border-slate-800">
          
          {/* Pause / Play */}
          <button
            onClick={handleTogglePlay}
            className="p-1.5 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg transition"
            title={isPlaying ? "暂停演示与语音" : "继续演示与语音"}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Mute Voice */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition"
            title={isMuted ? "取消静音" : "静音语音解说"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Next Chapter */}
          <button
            onClick={handleNextChapter}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition"
            title="跳至下一章节"
          >
            <FastForward className="w-4 h-4" />
          </button>

          {/* Restart */}
          <button
            onClick={handleRestart}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition"
            title="重新开始演示"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Stop / Close */}
          <button
            onClick={handleStopDemo}
            className="p-1.5 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 rounded-lg transition ml-1"
            title="退出操作演示"
          >
            <X className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
};
