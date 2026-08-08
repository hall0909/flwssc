/**
 * State Grid Legal Document Intelligent Generation System - Types Definition
 * 国家电网法律文书智能生成系统 (电网法规域 V1.0)
 */

export type DocumentCategory = 
  | 'power_engineering'  // 电力工程合同
  | 'procurement'        // 采购合同
  | 'legal_letter'       // 法务函件
  | 'internal_policy'    // 制度文件
  | 'compliance_report'; // 合规报告

export interface SubTypeOption {
  key: string;
  label: string;
  description: string;
  requiredFields: string[];
}

export interface DocumentTypeConfig {
  key: DocumentCategory;
  label: string;
  iconName: string;
  subTypes: SubTypeOption[];
}

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';
export type ComplianceLevel = 'mandatory' | 'suggestion';
export type RevisionType = 'mandatory' | 'optimization';
export type RevisionStatus = 'pending' | 'accepted' | 'rejected' | 'partial';
export type DocumentStatus = 'draft' | 'reviewing' | 'revised' | 'archived';
export type VersionLabel = '初稿' | '评审稿' | '终稿';

export type UserRole = 'sys_admin' | 'template_admin' | 'legal_reviewer' | 'business_staff';

export interface FormFields {
  partyA: string;              // 甲方名称 (电网单位)
  partyB: string;              // 乙方名称 (承包商/供应商)
  creditCodeA: string;         // 甲方统一社会信用代码
  creditCodeB: string;         // 乙方统一社会信用代码
  projectTarget: string;       // 业务标的/工程项目名称
  amount: number;              // 合同金额(万元)
  taxRate: number;             // 适用税率(%)
  startDate: string;           // 工期/服务开始日期
  endDate: string;             // 工期/服务截止日期
  location: string;            // 履行地点/施工场地
  qualityPeriod: string;       // 质保期限/责任保证期
  paymentNodes: string;        // 验收标准与付款节点
  breachTerms: string;         // 违约责任条款
  disputeResolution: string;   // 争议解决方式 (电网指定仲裁/法院)
  safetyResponsibility?: string; // 工程专属：安全责任与安规划分
  maintenanceScope?: string;    // 检修运维范围
  deliveryMethod?: string;      // 采购交付方式
  [key: string]: any;
}

export interface ComplianceIssue {
  id: string;
  ruleCategory: 'law' | 'internal_policy' | 'clause_completeness' | 'format_spec';
  title: string;
  description: string;
  level: ComplianceLevel;
  originalClause: string;
  basis: string;              // 依据法律法规或企业制度条文
  suggestion: string;
  linePosition?: number;      // 文书锚点行号
}

export interface RiskItem {
  id: string;
  location: string;           // 条款位置如第3.2条
  title: string;
  level: RiskLevel;
  description: string;
  consequence: string;        // 业务不利后果
  basis: string;              // 法律法规/行业规范依据
  optimization: string;       // 优化策略建议
  linePosition?: number;
}

export interface RevisionSuggestion {
  id: string;
  type: RevisionType;
  originalText: string;
  revisedText: string;
  status: RevisionStatus;
  reason: string;
  operator?: string;
  timestamp?: string;
}

export interface DocumentVersion {
  id: string;
  versionNumber: string;      // 如 V1.0, V1.1
  label: VersionLabel;
  createdBy: string;
  createdAt: string;
  notes: string;
  content: string;
  diffSummary?: {
    addedLines: number;
    deletedLines: number;
    modifiedLines: number;
  };
}

export interface LegalDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  subType: string;
  status: DocumentStatus;
  unit: string;               // 组织单位名称
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  formFields: FormFields;
  content: string;
  versions: DocumentVersion[];
  complianceIssues: ComplianceIssue[];
  riskItems: RiskItem[];
  revisionSuggestions: RevisionSuggestion[];
  isArchived: boolean;
  archivedAt?: string;
}

export interface KnowledgeItem {
  id: string;
  category: DocumentCategory | 'general_law' | 'industry_rule';
  title: string;
  code: string;               // 编号如 SGCC-LEG-2025-012
  publishDate: string;
  expiryDate?: string;
  scope: string;              // 适用业务范围
  content: string;
  status: 'active' | 'expired' | 'draft';
  tags: string[];
}

export interface RiskRule {
  id: string;
  category: DocumentCategory;
  ruleName: string;
  level: RiskLevel;
  description: string;
  triggerPattern: string;
  enabled: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  account: string;
  role: UserRole;
  actionType: '文书创建' | 'AI生成' | '合规校验' | '风险识别' | '智能修订' | '版本变更' | '知识库修改' | '草稿删除' | '终稿归档';
  details: string;
  documentId?: string;
  ipAddress: string;
}

export interface DashboardMetrics {
  monthlyGeneratedTotal: number;
  categoryBreakdown: Record<DocumentCategory, number>;
  complianceCheckCount: number;
  riskCountByLevel: Record<RiskLevel, number>;
  aiAdoptionRate: number;    // 百分比
  archivedCount: number;
}
