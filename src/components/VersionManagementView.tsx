import React, { useState } from 'react';
import { 
  Archive, 
  GitCompare, 
  RotateCcw, 
  Lock, 
  FileText, 
  Download, 
  Plus, 
  CheckCircle2, 
  ArrowRight,
  Search,
  Filter,
  Eye
} from 'lucide-react';
import { LegalDocument, DocumentVersion } from '../types';

interface VersionManagementViewProps {
  currentDocument: LegalDocument | null;
  allDocuments: LegalDocument[];
  onOpenDocument: (doc: LegalDocument) => void;
  onRestoreVersion: (version: DocumentVersion) => void;
  onLockFinalVersion: (docId: string, versionId: string) => void;
  demoTime?: number;
}

export const VersionManagementView: React.FC<VersionManagementViewProps> = ({
  currentDocument,
  allDocuments,
  onOpenDocument,
  onRestoreVersion,
  onLockFinalVersion,
  demoTime
}) => {
  // Page mode: 'list_modal' | 'diff_page' | 'archived_library'
  const [viewMode, setViewMode] = useState<'list_modal' | 'diff_page' | 'archived_library'>('list_modal');
  const [demoArchived, setDemoArchived] = useState<boolean>(false);

  // React to Demo Timeline
  React.useEffect(() => {
    if (demoTime !== undefined) {
      if (demoTime >= 181 && demoTime < 195) {
        setViewMode('diff_page');
        setDemoArchived(false);
      } else if (demoTime >= 195) {
        setViewMode('diff_page');
        setDemoArchived(true);
      }
    } else {
      setDemoArchived(false);
    }
  }, [demoTime]);
  
  // Versions array
  const versions = currentDocument?.versions || [];
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

  // Filter archived
  const archivedDocs = allDocuments.filter(d => d.isArchived);

  const toggleVersionSelect = (vId: string) => {
    if (selectedVersions.includes(vId)) {
      setSelectedVersions(prev => prev.filter(id => id !== vId));
    } else {
      if (selectedVersions.length >= 2) {
        setSelectedVersions([selectedVersions[1], vId]); // keep max 2
      } else {
        setSelectedVersions(prev => [...prev, vId]);
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 text-slate-800 overflow-hidden">
      
      {/* Floating Demo Archive Notification */}
      {demoArchived && (
        <div className="fixed bottom-24 right-8 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-500/40 flex items-center space-x-3.5 animate-bounce">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-300 flex items-center space-x-1">
              <span>全流程归档完成</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">区块链存证已生效</span>
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5">
              文书终稿哈希: 0x8f2a9c4b...c91e 已锁定，版本归档不可篡改
            </div>
          </div>
        </div>
      )}

      {/* Sub-header Controls */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('list_modal')}
              className={`px-3 py-1 rounded text-xs font-medium transition ${viewMode === 'list_modal' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              版本快照列表
            </button>
            <button
              onClick={() => setViewMode('diff_page')}
              className={`px-3 py-1 rounded text-xs font-medium transition ${viewMode === 'diff_page' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              双栏差异比对
            </button>
            <button
              onClick={() => setViewMode('archived_library')}
              className={`px-3 py-1 rounded text-xs font-medium transition ${viewMode === 'archived_library' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              文书归档库总页 ({archivedDocs.length})
            </button>
          </div>

          {currentDocument && (
            <span className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded font-medium">
              当前文书: {currentDocument.title}
            </span>
          )}
        </div>

        <button
          onClick={() => alert("差异比对报告已导出 Word/PDF 格式 (带划线修订标注)")}
          className="bg-white hover:bg-slate-50 text-indigo-700 text-xs px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center space-x-1 font-medium transition"
        >
          <Download className="w-3.5 h-3.5 text-indigo-600" />
          <span>导出版本比对报告</span>
        </button>
      </div>

      {/* ==================== 页面 7.1: 文书版本列表弹窗与快照管理 ==================== */}
      {viewMode === 'list_modal' && (
        <div className="flex-1 overflow-y-auto p-6 max-w-[1400px] mx-auto w-full space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Archive className="w-5 h-5 text-indigo-600" />
                <span>文书历史版本快照列表</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                记录版本号、初稿/评审稿/终稿标识、操作人与变更备注，支持勾选2个版本打开差异对比
              </p>
            </div>

            <button
              onClick={() => setViewMode('diff_page')}
              disabled={selectedVersions.length !== 2}
              className={`text-xs px-4 py-2 rounded-lg font-semibold shadow-sm flex items-center space-x-1 transition ${
                selectedVersions.length === 2 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span>开启双栏差异比对 (已选 {selectedVersions.length}/2)</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <th className="py-3 px-4 w-12 text-center">对比</th>
                  <th className="py-3 px-4 font-semibold">版本号</th>
                  <th className="py-3 px-4 font-semibold">版本标记</th>
                  <th className="py-3 px-4 font-semibold">操作人</th>
                  <th className="py-3 px-4 font-semibold">快照时间</th>
                  <th className="py-3 px-4 font-semibold">版本修改备注</th>
                  <th className="py-3 px-4 font-semibold text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {versions.map((ver) => {
                  const isChecked = selectedVersions.includes(ver.id);

                  return (
                    <tr key={ver.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleVersionSelect(ver.id)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>

                      <td className="py-3 px-4 font-bold text-indigo-700">{ver.versionNumber}</td>

                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ver.label === '终稿' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                          ver.label === '评审稿' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {ver.label}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-700">{ver.createdBy}</td>
                      <td className="py-3 px-4 text-slate-500">{ver.createdAt}</td>
                      <td className="py-3 px-4 text-slate-700">{ver.notes}</td>

                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => onRestoreVersion(ver)}
                          className="bg-white hover:bg-slate-50 text-indigo-700 border border-slate-200 px-2.5 py-1 rounded-md text-[11px] inline-flex items-center space-x-1 font-medium transition shadow-sm"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>恢复此版本</span>
                        </button>

                        {ver.label !== '终稿' && (
                          <button
                            onClick={() => currentDocument && onLockFinalVersion(currentDocument.id, ver.id)}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-md text-[11px] inline-flex items-center space-x-1 font-medium transition"
                          >
                            <Lock className="w-3 h-3 text-amber-600" />
                            <span>锁定归档终稿</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== 页面 7.2: 版本差异比对独立页面 ==================== */}
      {viewMode === 'diff_page' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          
          <div className="bg-white border-b border-slate-200 px-6 py-2 flex items-center justify-between text-xs shadow-sm">
            <div className="flex items-center space-x-4">
              <span className="font-bold text-slate-900 flex items-center space-x-1">
                <GitCompare className="w-4 h-4 text-indigo-600" />
                <span>双栏语义级差异比对</span>
              </span>
              <span className="text-slate-500">
                左侧：旧版本 (V1.0 初稿) | 右侧：新版本 (V1.1 评审稿)
              </span>
            </div>

            <div className="flex items-center space-x-3 text-[11px]">
              <span className="flex items-center space-x-1 text-emerald-700"><span className="underline font-bold">绿色下划线</span>=新增内容</span>
              <span className="flex items-center space-x-1 text-rose-700"><span className="line-through font-bold">红色删除线</span>=删除内容</span>
              <span className="flex items-center space-x-1 text-amber-800"><span className="bg-amber-100 px-1 font-bold">黄色高亮</span>=修改内容</span>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4 p-6 overflow-y-auto">
            {/* Left Column: Old Version Full Contract */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 font-serif text-xs leading-relaxed space-y-4 shadow-sm relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 font-sans">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  <span className="font-bold text-slate-700 text-sm">左侧 - 旧版本 (V1.0 初稿)</span>
                </div>
                <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-mono">2026-03-15 归档快照</span>
              </div>

              {/* Full Contract Paper Styling */}
              <div className="bg-slate-50/50 p-6 rounded-lg border border-slate-100 space-y-4 text-slate-700">
                <div className="text-center space-y-1 pb-2 border-b border-slate-200">
                  <h3 className="font-bold text-sm text-slate-900 font-sans">110千伏输变电新建工程EPC总承包合同</h3>
                  <p className="text-[10px] text-slate-500 font-mono">合同编号：SG-2026-EPC-001 (V1.0)</p>
                </div>

                <div className="text-[11px] space-y-1 bg-white p-3 rounded border border-slate-200 font-sans">
                  <p><strong>发包方（甲方）：</strong>国网江苏省电力有限公司</p>
                  <p><strong>承包方（乙方）：</strong>南京电力建设集团有限公司</p>
                  <p className="text-slate-500 text-[10px] mt-1">根据《中华人民共和国民法典》、《中华人民共和国建筑法》及国家电网物资与工程管理规定，就110千伏输变电工程总承包事宜签订本合同。</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 font-sans">第一条 工程概况与承包范围</h4>
                  <p>1.1 工程名称：110千伏输变电新建工程EPC总承包项目。</p>
                  <p>1.2 工程地点：发包方指定南京市江宁区施工现场。</p>
                  <p>1.3 承包范围：包含工程勘察设计、物资设备采购、土建施工、设备安装及竣工验收交接等全过程总承包。</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 font-sans">第二条 合同价款与支付方式</h4>
                  <p>2.1 本合同暂定签约总价为人民币：陆仟捌佰万元整（¥68,000,000.00）。</p>
                  <p>2.2 支付节点：预付款20%，按工程进度款付至75%，竣工验收合格付至90%。</p>
                </div>

                <div className="space-y-1 bg-rose-50/60 p-2.5 rounded border border-rose-200/60">
                  <h4 className="font-bold text-rose-900 font-sans flex items-center justify-between">
                    <span>第三条 质量保证金与缺陷责任</span>
                    <span className="text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.2 rounded font-sans font-normal">差异条款 1</span>
                  </h4>
                  <p>3.1 质量保证期为24个月，自工程竣工验收合格之日起计算。</p>
                  <p>
                    3.2 剩余 <span className="line-through text-rose-600 font-bold bg-rose-100/80 px-1 py-0.5 rounded">10% 作为质量保证金</span>，质保期满24个月后无息退还。
                  </p>
                </div>

                <div className="space-y-1 bg-rose-50/60 p-2.5 rounded border border-rose-200/60">
                  <h4 className="font-bold text-rose-900 font-sans flex items-center justify-between">
                    <span>第四条 安全生产与反违章管理</span>
                    <span className="text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.2 rounded font-sans font-normal">差异条款 2</span>
                  </h4>
                  <p>4.1 乙方必须遵守国家安全生产法律法规及发包方施工现场规章。</p>
                  <p>
                    4.2 <span className="line-through text-rose-600 font-bold bg-rose-100/80 px-1 py-0.5 rounded">乙方负责施工现场安全生产。</span>
                  </p>
                </div>

                <div className="space-y-1 bg-rose-50/60 p-2.5 rounded border border-rose-200/60">
                  <h4 className="font-bold text-rose-900 font-sans flex items-center justify-between">
                    <span>第五条 违约责任与争议解决</span>
                    <span className="text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.2 rounded font-sans font-normal">差异条款 3</span>
                  </h4>
                  <p>5.1 乙方延误工期的，每日按合同暂定价的0.05%支付违约金。</p>
                  <p>
                    5.2 双方因本合同发生争议的，<span className="line-through text-rose-600 font-bold bg-rose-100/80 px-1 py-0.5 rounded">提交南京仲裁委员会申请仲裁</span>。
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 font-sans">第六条 附则</h4>
                  <p>6.1 本合同一式四份，甲乙双方各执两份，经双方法定代表人或授权代表签字并加盖公章后生效。</p>
                </div>

                <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-4 text-[11px] font-sans">
                  <div>
                    <p className="font-bold text-slate-900">甲方（盖章）：国网江苏省电力有限公司</p>
                    <p className="text-slate-500 mt-1">法定代表人或授权代表：李伟</p>
                    <p className="text-slate-500">日期：2026年03月15日</p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">乙方（盖章）：南京电力建设集团有限公司</p>
                    <p className="text-slate-500 mt-1">法定代表人或授权代表：张建国</p>
                    <p className="text-slate-500">日期：2026年03月15日</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: New Version Full Contract */}
            <div className="bg-white border border-indigo-200 rounded-xl p-6 font-serif text-xs leading-relaxed space-y-4 shadow-sm relative">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-100 font-sans">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                  <span className="font-bold text-indigo-900 text-sm">右侧 - 新版本 (V1.1 评审稿 - AI合规修订后)</span>
                </div>
                <span className="text-[11px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-mono font-bold border border-indigo-200">2026-03-20 归档终稿</span>
              </div>

              {/* Full Contract Paper Styling */}
              <div className="bg-slate-50/50 p-6 rounded-lg border border-slate-100 space-y-4 text-slate-800">
                <div className="text-center space-y-1 pb-2 border-b border-slate-200">
                  <h3 className="font-bold text-sm text-slate-900 font-sans">110千伏输变电新建工程EPC总承包合同</h3>
                  <p className="text-[10px] text-indigo-600 font-mono">合同编号：SG-2026-EPC-001 (V1.1 终稿)</p>
                </div>

                <div className="text-[11px] space-y-1 bg-white p-3 rounded border border-indigo-100 font-sans">
                  <p><strong>发包方（甲方）：</strong>国网江苏省电力有限公司</p>
                  <p><strong>承包方（乙方）：</strong>南京电力建设集团有限公司</p>
                  <p className="text-slate-500 text-[10px] mt-1">根据《中华人民共和国民法典》、《中华人民共和国建筑法》及国家电网物资与工程管理规定，就110千伏输变电工程总承包事宜签订本合同。</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 font-sans">第一条 工程概况与承包范围</h4>
                  <p>1.1 工程名称：110千伏输变电新建工程EPC总承包项目。</p>
                  <p>1.2 工程地点：发包方指定南京市江宁区施工现场。</p>
                  <p>1.3 承包范围：包含工程勘察设计、物资设备采购、土建施工、设备安装及竣工验收交接等全过程总承包。</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 font-sans">第二条 合同价款与支付方式</h4>
                  <p>2.1 本合同暂定签约总价为人民币：陆仟捌佰万元整（¥68,000,000.00）。</p>
                  <p>2.2 支付节点：预付款20%，按工程进度款付至75%，竣工验收合格付至90%。</p>
                </div>

                <div className="space-y-1 bg-emerald-50/60 p-2.5 rounded border border-emerald-200/80">
                  <h4 className="font-bold text-emerald-900 font-sans flex items-center justify-between">
                    <span>第三条 质量保证金与缺陷责任</span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-sans font-bold">符合住建部3%规范</span>
                  </h4>
                  <p>3.1 质量保证期为24个月，自工程竣工验收合格之日起计算。</p>
                  <p>
                    3.2 剩余 <span className="underline text-emerald-800 font-bold bg-emerald-100 px-1 py-0.5 rounded">3% 作为质量保证金</span>，质保期满24个月且无遗留质量缺陷后无息退还；<span className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-bold">承包人也可选择提供等额银行质量保函替代现金留扣</span>。
                  </p>
                </div>

                <div className="space-y-1 bg-emerald-50/60 p-2.5 rounded border border-emerald-200/80">
                  <h4 className="font-bold text-emerald-900 font-sans flex items-center justify-between">
                    <span>第四条 安全生产与反违章管理</span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-sans font-bold">引入电网反违章示范条款</span>
                  </h4>
                  <p>4.1 乙方必须遵守国家安全生产法律法规及发包方施工现场规章。</p>
                  <p>
                    4.2 乙方全面承担施工现场安全主体责任，遵守电网反违章规定。<span className="underline text-emerald-800 font-bold bg-emerald-100 px-1 py-0.5 rounded">如发生严重违章，单次扣罚5万元违约金</span>。
                  </p>
                </div>

                <div className="space-y-1 bg-emerald-50/60 p-2.5 rounded border border-emerald-200/80">
                  <h4 className="font-bold text-emerald-900 font-sans flex items-center justify-between">
                    <span>第五条 违约责任与争议解决</span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-sans font-bold">发包方所在地法院管辖</span>
                  </h4>
                  <p>5.1 乙方延误工期的，每日按合同暂定价的0.05%支付违约金。</p>
                  <p>
                    5.2 双方因本合同发生争议的，<span className="underline text-emerald-800 font-bold bg-emerald-100 px-1 py-0.5 rounded">向发包方所在地（南京市）人民法院提起诉讼</span>。
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 font-sans">第六条 附则</h4>
                  <p>6.1 本合同一式四份，甲乙双方各执两份，经双方法定代表人或授权代表签字并加盖公章后生效。</p>
                </div>

                <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-4 text-[11px] font-sans">
                  <div>
                    <p className="font-bold text-slate-900">甲方（盖章）：国网江苏省电力有限公司</p>
                    <p className="text-slate-500 mt-1">法定代表人或授权代表：李伟</p>
                    <p className="text-slate-500">日期：2026年03月20日</p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">乙方（盖章）：南京电力建设集团有限公司</p>
                    <p className="text-slate-500 mt-1">法定代表人或授权代表：张建国</p>
                    <p className="text-slate-500">日期：2026年03月20日</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ==================== 页面 7.3: 文书归档库总页面 ==================== */}
      {viewMode === 'archived_library' && (
        <div className="flex-1 overflow-y-auto p-6 max-w-[1600px] mx-auto w-full space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Lock className="w-5 h-5 text-amber-500" />
                <span>文书归档库 (锁定终稿总库)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                已归档终稿文书受严格保护，不可二次直接编辑，仅支持查阅历史全版本、导出文书与复制新建副本
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <th className="py-3 px-4 font-semibold">归档文书名称</th>
                  <th className="py-3 px-4 font-semibold">文书场景类型</th>
                  <th className="py-3 px-4 font-semibold">所属组织单位</th>
                  <th className="py-3 px-4 font-semibold">归档锁定时间</th>
                  <th className="py-3 px-4 font-semibold">状态</th>
                  <th className="py-3 px-4 font-semibold text-right">归档操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {archivedDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-semibold text-indigo-700 flex items-center space-x-1.5">
                      <Lock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{doc.title}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{doc.category} - {doc.subType}</td>
                    <td className="py-3 px-4 text-slate-700">{doc.unit}</td>
                    <td className="py-3 px-4 text-slate-500">{doc.archivedAt || doc.updatedAt}</td>
                    <td className="py-3 px-4">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] border border-indigo-200 font-bold">
                        已终稿归档
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => onOpenDocument(doc)}
                        className="bg-white hover:bg-slate-50 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 text-xs font-medium transition shadow-sm"
                      >
                        查阅历史版本
                      </button>
                      <button
                        onClick={() => alert("已基于该终稿复制生成新草稿副本，可进行二次衍生编辑")}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-200 text-xs font-medium transition"
                      >
                        新建副本编辑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
