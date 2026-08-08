import React, { useState } from 'react';
import { Search, X, BookOpen, FileText, ShieldAlert } from 'lucide-react';
import { KnowledgeItem, LegalDocument } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  knowledgeBase: KnowledgeItem[];
  documents: LegalDocument[];
  onOpenDocument: (doc: LegalDocument) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  knowledgeBase,
  documents,
  onOpenDocument
}) => {
  const [query, setQuery] = useState<string>('');

  if (!isOpen) return null;

  const filteredKb = knowledgeBase.filter(item => 
    item.title.includes(query) || item.content.includes(query) || item.code.includes(query)
  );

  const filteredDocs = documents.filter(doc => 
    doc.title.includes(query) || doc.content.includes(query)
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-5 shadow-2xl text-slate-100 space-y-4 animate-in fade-in zoom-in duration-150">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 flex-1 mr-3">
            <Search className="w-4 h-4 text-emerald-400" />
            <input
              type="text"
              autoFocus
              placeholder="全库检索：输入范本名称、法律法规条文或文书关键词..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-none text-xs text-white focus:outline-none placeholder:text-slate-500"
            />
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto space-y-3 text-xs">
          {query.trim() === '' ? (
            <div className="text-center text-slate-500 py-8">
              请输入关键词开始检索知识库与业务文书
            </div>
          ) : (
            <>
              {filteredDocs.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">匹配文书 ({filteredDocs.length})</div>
                  <div className="space-y-1.5">
                    {filteredDocs.map((doc) => (
                      <div 
                        key={doc.id}
                        onClick={() => {
                          onOpenDocument(doc);
                          onClose();
                        }}
                        className="p-2.5 bg-slate-950 hover:bg-slate-800 rounded-lg border border-slate-800 cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="font-semibold text-slate-200">{doc.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">{doc.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredKb.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">匹配知识库法规条文 ({filteredKb.length})</div>
                  <div className="space-y-1.5">
                    {filteredKb.map((kb) => (
                      <div key={kb.id} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                        <div className="font-bold text-emerald-400 text-xs flex items-center space-x-2">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{kb.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 line-clamp-2">{kb.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
