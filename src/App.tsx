/**
 * State Grid Legal Document Intelligent Generation System
 * 国家电网法律文书智能生成系统 (电网法规域 V1.0)
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { DocumentDraftingView } from './components/DocumentDraftingView';
import { ComplianceReviewView } from './components/ComplianceReviewView';
import { RiskIdentificationView } from './components/RiskIdentificationView';
import { SmartRevisionView } from './components/SmartRevisionView';
import { VersionManagementView } from './components/VersionManagementView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { SystemAdminView } from './components/SystemAdminView';
import { WorkflowLogicVisualizer } from './components/WorkflowLogicVisualizer';

import { AIDisclaimerModal } from './components/modals/AIDisclaimerModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { SystemDemoVideoModal } from './components/modals/SystemDemoVideoModal';
import { LiveOperationDemo } from './components/LiveOperationDemo';

import { 
  LegalDocument, 
  UserRole, 
  DocumentCategory, 
  KnowledgeItem, 
  RiskRule, 
  AuditLog, 
  DocumentVersion 
} from './types';

import { 
  INITIAL_DOCUMENTS, 
  INITIAL_KNOWLEDGE_BASE, 
  INITIAL_RISK_RULES, 
  INITIAL_AUDIT_LOGS, 
  MOCK_DASHBOARD_METRICS 
} from './data/mockData';

import { generateDocumentContent } from './utils/documentTemplates';

export default function App() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('business_staff');
  const [selectedUnit, setSelectedUnit] = useState<string>('国网江苏省电力有限公司');
  const [aiEnabled, setAiEnabled] = useState<boolean>(true);

  // App Data State
  const [documents, setDocuments] = useState<LegalDocument[]>(INITIAL_DOCUMENTS);
  const [currentDocId, setCurrentDocId] = useState<string>(INITIAL_DOCUMENTS[0].id);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItem[]>(INITIAL_KNOWLEDGE_BASE);
  const [riskRules, setRiskRules] = useState<RiskRule[]>(INITIAL_RISK_RULES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Modals & Demo
  const [showAIDisclaimer, setShowAIDisclaimer] = useState<boolean>(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState<boolean>(false);
  const [showSystemDemoVideo, setShowSystemDemoVideo] = useState<boolean>(false);
  const [isLiveDemoRunning, setIsLiveDemoRunning] = useState<boolean>(false);
  const [demoTime, setDemoTime] = useState<number>(0);

  const currentDocument = documents.find(d => d.id === currentDocId) || documents[0] || null;

  // Add Log Entry
  const addAuditLog = (actionType: AuditLog['actionType'], details: string, docId?: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      account: currentRole === 'sys_admin' ? '系统管理员' : currentRole === 'legal_reviewer' ? '李敏（法务审核员）' : '张立华（法务专员）',
      role: currentRole,
      actionType,
      details,
      documentId: docId,
      ipAddress: '10.128.42.105'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Document Handlers
  const handleSaveDocument = (updatedDoc: LegalDocument) => {
    setDocuments(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d));
    addAuditLog('文书创建', `保存了文书《${updatedDoc.title}》的草稿修改`, updatedDoc.id);
  };

  const handleCreateNewDocument = (category: DocumentCategory, subType: string, mode: 'form' | 'blank' | 'ai') => {
    const newId = `DOC-${Date.now()}`;
    const initialFormFields = {
      partyA: selectedUnit,
      partyB: category === 'legal_letter' ? '安徽建工第三建设集团有限公司' : category === 'procurement' ? '威胜集团股份有限公司' : '华东电力建设工程总公司',
      creditCodeA: '91320000134769018A',
      creditCodeB: '91310000100028912C',
      projectTarget: category === 'power_engineering' ? '110kV输变电新建与技改工程' : category === 'procurement' ? '智能电能表及变压器设备集中采购' : category === 'legal_letter' ? '关于工期进度滞后与违约整改催告' : category === 'internal_policy' ? '法律文书合规管理办法' : '年度法务风控与合规自查报告',
      amount: category === 'power_engineering' ? 3200 : category === 'procurement' ? 1200 : 500,
      taxRate: category === 'procurement' ? 13 : 9,
      startDate: '2026-09-01',
      endDate: '2027-08-31',
      location: '发包人指定现场',
      qualityPeriod: '24个月',
      paymentNodes: '预付款20%，进度款75%，竣工验收90%，质保金留扣3%',
      breachTerms: '按违约每日0.05%扣减违约金',
      disputeResolution: '向发包人所在地人民法院提起诉讼',
      safetyResponsibility: '承包人全面承担施工现场安全生产主体责任，遵守电网反违章规定'
    };

    const categoryNames: Record<string, string> = {
      power_engineering: '电力工程合同',
      procurement: '采购合同',
      legal_letter: '法务函件',
      internal_policy: '制度文件',
      compliance_report: '合规报告'
    };

    const generatedContent = generateDocumentContent(category, subType, initialFormFields, selectedUnit);

    const newDoc: LegalDocument = {
      id: newId,
      title: `${selectedUnit}${initialFormFields.projectTarget} (${categoryNames[category] || '文书'})`,
      category,
      subType,
      status: 'draft',
      unit: selectedUnit,
      createdBy: currentRole === 'legal_reviewer' ? '李敏' : '张立华',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      formFields: initialFormFields,
      content: generatedContent,
      versions: [
        {
          id: `VER-${Date.now()}`,
          versionNumber: 'V1.0',
          label: '初稿',
          createdBy: '张立华',
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          notes: 'AI智能表单生成初稿版本',
          content: '...'
        }
      ],
      complianceIssues: [
        {
          id: `COMP-${Date.now()}`,
          ruleCategory: 'law',
          title: '质保金留扣符合建设部3%上限规定',
          description: '预留3%质量保证金符合建质〔2017〕138号文规范。',
          level: 'suggestion',
          originalClause: '预留 3% 作为质量保证金。',
          basis: '《建设工程质量保证金管理办法》',
          suggestion: '条款合规。'
        }
      ],
      riskItems: [],
      revisionSuggestions: [],
      isArchived: false
    };

    setDocuments(prev => [newDoc, ...prev]);
    setCurrentDocId(newId);
    addAuditLog('文书创建', `新建了《${newDoc.title}》（模式：${mode}）`, newId);
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
    addAuditLog('草稿删除', `删除了文书草稿 (ID: ${docId})`, docId);
  };

  const handleTriggerComplianceCheck = (doc: LegalDocument) => {
    addAuditLog('合规校验', `对文书《${doc.title}》执行了一键合规校验`, doc.id);
    setActiveTab('review');
  };

  const handleTriggerRiskIdentify = (doc: LegalDocument) => {
    addAuditLog('风险识别', `对文书《${doc.title}》执行了全流程风险识别`, doc.id);
    setActiveTab('review');
  };

  const handleRestoreVersion = (version: DocumentVersion) => {
    if (currentDocument) {
      const updated = {
        ...currentDocument,
        content: version.content,
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      handleSaveDocument(updated);
      addAuditLog('版本变更', `恢复文书《${currentDocument.title}》至历史版本 ${version.versionNumber}`, currentDocument.id);
      alert(`成功恢复文书正文至版本 ${version.versionNumber}！`);
    }
  };

  const handleLockFinalVersion = (docId: string, versionId: string) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          status: 'archived',
          isArchived: true,
          archivedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
      }
      return d;
    }));
    addAuditLog('终稿归档', `将文书锁定归档为终稿 (ID: ${docId})`, docId);
    alert("该文书已正式锁定归档为终稿！后续禁止直接修改。");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-indigo-600 selection:text-white">
      
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        selectedUnit={selectedUnit}
        onUnitChange={setSelectedUnit}
        aiEnabled={aiEnabled}
        onToggleAi={() => setAiEnabled(!aiEnabled)}
        onOpenGlobalSearch={() => setShowGlobalSearch(true)}
        onOpenAIDisclaimer={() => setShowAIDisclaimer(true)}
        onOpenSystemDemoVideo={() => setShowSystemDemoVideo(true)}
        onStartLiveDemo={() => setIsLiveDemoRunning(true)}
      />

      {/* Main Body Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar Menu */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          currentRole={currentRole}
          pendingReviewCount={documents.filter(d => d.status === 'reviewing').length}
        />

        {/* Right Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          
          {activeTab === 'dashboard' && (
            <DashboardView
              documents={documents}
              metrics={MOCK_DASHBOARD_METRICS}
              onNavigateToDrafting={(category) => setActiveTab('drafting')}
              onOpenDocument={(doc) => {
                setCurrentDocId(doc.id);
                setActiveTab('drafting');
              }}
              onNavigateToReview={() => setActiveTab('review')}
              onNavigateToBatchReview={() => setActiveTab('review')}
              onOpenGlobalSearch={() => setShowGlobalSearch(true)}
              onOpenSystemDemoVideo={() => setShowSystemDemoVideo(true)}
              onStartLiveDemo={() => setIsLiveDemoRunning(true)}
              demoTime={isLiveDemoRunning ? demoTime : undefined}
            />
          )}

          {activeTab === 'drafting' && (
            <DocumentDraftingView
              currentDocument={currentDocument}
              allDocuments={documents}
              onSaveDocument={handleSaveDocument}
              onSelectDocument={(doc) => setCurrentDocId(doc.id)}
              onCreateNewDocument={handleCreateNewDocument}
              onDeleteDocument={handleDeleteDocument}
              knowledgeBase={knowledgeBase}
              aiEnabled={aiEnabled}
              onOpenAIDisclaimer={() => setShowAIDisclaimer(true)}
              onTriggerComplianceCheck={handleTriggerComplianceCheck}
              onTriggerRiskIdentify={handleTriggerRiskIdentify}
              onNavigateToRevision={() => setActiveTab('revision')}
              onNavigateToVersion={() => setActiveTab('version')}
              demoTime={isLiveDemoRunning ? demoTime : undefined}
            />
          )}

          {activeTab === 'review' && (
            <ComplianceReviewView
              currentDocument={currentDocument}
              allDocuments={documents}
              onOpenDocument={(doc) => {
                setCurrentDocId(doc.id);
                setActiveTab('drafting');
              }}
              onNavigateToRevision={() => setActiveTab('revision')}
              demoTime={isLiveDemoRunning ? demoTime : undefined}
            />
          )}

          {activeTab === 'revision' && (
            <SmartRevisionView
              currentDocument={currentDocument}
              onSaveDocument={handleSaveDocument}
              onNavigateToVersion={() => setActiveTab('version')}
              demoTime={isLiveDemoRunning ? demoTime : undefined}
            />
          )}

          {activeTab === 'version' && (
            <VersionManagementView
              currentDocument={currentDocument}
              allDocuments={documents}
              onOpenDocument={(doc) => {
                setCurrentDocId(doc.id);
                setActiveTab('drafting');
              }}
              onRestoreVersion={handleRestoreVersion}
              onLockFinalVersion={handleLockFinalVersion}
              demoTime={isLiveDemoRunning ? demoTime : undefined}
            />
          )}

          {activeTab === 'knowledge' && (
            <KnowledgeBaseView
              knowledgeBase={knowledgeBase}
              riskRules={riskRules}
              currentRole={currentRole}
              onAddKnowledge={(item) => setKnowledgeBase(prev => [item, ...prev])}
              onToggleRule={(ruleId) => {
                setRiskRules(prev => prev.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r));
              }}
            />
          )}

          {activeTab === 'admin' && (
            <SystemAdminView
              auditLogs={auditLogs}
              aiEnabled={aiEnabled}
              onToggleAi={() => setAiEnabled(!aiEnabled)}
              currentRole={currentRole}
            />
          )}

          {activeTab === 'workflow_spec' && (
            <WorkflowLogicVisualizer />
          )}

        </main>

      </div>

      {/* Reusable Modals */}
      <AIDisclaimerModal
        isOpen={showAIDisclaimer}
        onClose={() => setShowAIDisclaimer(false)}
      />

      <GlobalSearchModal
        isOpen={showGlobalSearch}
        onClose={() => setShowGlobalSearch(false)}
        knowledgeBase={knowledgeBase}
        documents={documents}
        onOpenDocument={(doc) => {
          setCurrentDocId(doc.id);
          setActiveTab('drafting');
        }}
      />

      <SystemDemoVideoModal
        isOpen={showSystemDemoVideo}
        onClose={() => setShowSystemDemoVideo(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      <LiveOperationDemo
        isRunning={isLiveDemoRunning}
        onStop={() => setIsLiveDemoRunning(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onDemoTimeUpdate={(time) => setDemoTime(time)}
      />

    </div>
  );
}
