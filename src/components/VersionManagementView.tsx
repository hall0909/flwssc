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
}

export const VersionManagementView: React.FC<VersionManagementViewProps> = ({
  currentDocument,
  allDocuments,
  onOpenDocument,
  onRestoreVersion,
  onLockFinalVersion
}) => {
  // Page mode: 'list_modal' | 'diff_page' | 'archived_library'
  const [viewMode, setViewMode] = useState<'list_modal' | 'diff_page' | 'archived_library'>('list_modal');
  
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
            {/* Left Column: Old Version */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 font-serif text-xs leading-relaxed space-y-3 shadow-sm">
              <div className="font-bold text-slate-500 pb-2 border-b border-slate-100">左侧 - 旧版本 (V1.0 初稿)</div>
              <p className="text-slate-700">
                第三条 (4) 剩余 <span className="line-through text-rose-600 font-bold bg-rose-50 p-0.5 rounded">10% 作为质量保证金</span>，质保期满24个月后无息退还。
              </p>
              <p className="text-slate-700">
                第四条 4.2 乙方负责施工现场安全生产。
              </p>
            </div>

            {/* Right Column: New Version */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 font-serif text-xs leading-relaxed space-y-3 shadow-sm">
              <div className="font-bold text-indigo-700 pb-2 border-b border-slate-100">右侧 - 新版本 (V1.1 评审稿 - AI合规修订后)</div>
              <p className="text-slate-800">
                第三条 (4) 剩余 <span className="underline text-emerald-700 font-bold bg-emerald-50 p-0.5 rounded">3% 作为质量保证金</span>，质保期满24个月且无遗留质量缺陷后无息退还；<span className="bg-amber-100 text-amber-900 p-0.5 rounded">承包人也可选择提供等额银行质量保函替代现金留扣</span>。
              </p>
              <p className="text-slate-800">
                第四条 4.2 乙方全面承担施工现场安全主体责任，遵守电网反违章规定。<span className="underline text-emerald-700 font-bold">如发生严重违章，单次扣罚5万元违约金</span>。
              </p>
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
