import { 
  DocumentTypeConfig, 
  LegalDocument, 
  KnowledgeItem, 
  RiskRule, 
  AuditLog, 
  DashboardMetrics 
} from '../types';

export const DOCUMENT_CATEGORIES: DocumentTypeConfig[] = [
  {
    key: 'power_engineering',
    label: '电力工程合同',
    iconName: 'Zap',
    subTypes: [
      { key: 'epc', label: 'EPC总承包合同', description: '电网基建/输变电新建项目工程总承包', requiredFields: ['partyA', 'partyB', 'amount', 'startDate', 'endDate', 'safetyResponsibility'] },
      { key: 'construction', label: '基建施工合同', description: '变电站、线路施工与现场安装工程', requiredFields: ['partyA', 'partyB', 'amount', 'startDate', 'endDate', 'location'] },
      { key: 'maintenance', label: '检修运维合同', description: '电网设备定期检修、巡检与抢修服务', requiredFields: ['partyA', 'partyB', 'amount', 'maintenanceScope'] },
      { key: 'supervision', label: '监理服务合同', description: '工程建设全过程监理及质量安全监督', requiredFields: ['partyA', 'partyB', 'amount', 'startDate', 'endDate'] }
    ]
  },
  {
    key: 'procurement',
    label: '采购合同',
    iconName: 'ShoppingBag',
    subTypes: [
      { key: 'equipment', label: '物资设备采购合同', description: '变压器、开关柜、线缆等电力物资采购', requiredFields: ['partyA', 'partyB', 'amount', 'deliveryMethod', 'qualityPeriod'] },
      { key: 'framework', label: '服务框架协议', description: '年度信息技术、咨询或维保服务框架协议', requiredFields: ['partyA', 'partyB', 'amount', 'startDate', 'endDate'] },
      { key: 'spot_order', label: '零星采购订单', description: '紧急缺口物资或短期临时服务采购', requiredFields: ['partyA', 'partyB', 'amount', 'location'] }
    ]
  },
  {
    key: 'legal_letter',
    label: '法务函件',
    iconName: 'FileText',
    subTypes: [
      { key: 'reminder', label: '催告函', description: '工期延误催告、欠款催收或违约限期整改通知', requiredFields: ['partyA', 'partyB', 'projectTarget', 'breachTerms'] },
      { key: 'termination', label: '解除通知', description: '严重违约合同解除及善后处理法定通知', requiredFields: ['partyA', 'partyB', 'projectTarget', 'breachTerms'] },
      { key: 'dissent', label: '异议函', description: '对施工索赔、结算审计或验收结果的澄清异议', requiredFields: ['partyA', 'partyB', 'projectTarget'] },
      { key: 'notice', label: '法律告知函', description: '对外法律沟通、合规事项提示与权利主张函', requiredFields: ['partyA', 'partyB', 'projectTarget'] }
    ]
  },
  {
    key: 'internal_policy',
    label: '制度文件',
    iconName: 'BookOpen',
    subTypes: [
      { key: 'compliance_method', label: '合规管理办法', description: '企业内部专项合规治理与审查管理流程', requiredFields: ['partyA', 'projectTarget'] },
      { key: 'legal_control', label: '法务内控细则', description: '合同签署审批、法律风险防控与授权管理', requiredFields: ['partyA', 'projectTarget'] },
      { key: 'safety_rule', label: '工程安全管理制度', description: '电网施工现场安全红线与违章处罚办法', requiredFields: ['partyA', 'safetyResponsibility'] }
    ]
  },
  {
    key: 'compliance_report',
    label: '合规报告',
    iconName: 'ShieldCheck',
    subTypes: [
      { key: 'annual_report', label: '年度合规报告', description: '单位年度法务风控与重大合规事项总结', requiredFields: ['partyA', 'startDate', 'endDate'] },
      { key: 'project_self_check', label: '工程专项自查报告', description: '重点基建项目建设合规与劳务用工自查', requiredFields: ['partyA', 'projectTarget'] },
      { key: 'procurement_eval', label: '采购合规评估报告', description: '招标采购全流程廉洁与合规性审查评估', requiredFields: ['partyA', 'amount'] }
    ]
  }
];

export const INITIAL_DOCUMENTS: LegalDocument[] = [
  {
    id: 'DOC-20260801-001',
    title: '国网江苏电力110kV输变电新建工程EPC总承包合同',
    category: 'power_engineering',
    subType: 'epc',
    status: 'reviewing',
    unit: '国网江苏省电力有限公司',
    createdBy: '张立华（法务专员）',
    createdAt: '2026-08-01 10:30',
    updatedAt: '2026-08-07 14:20',
    formFields: {
      partyA: '国网江苏省电力有限公司',
      partyB: '华东电力建设工程总公司',
      creditCodeA: '91320000134769018A',
      creditCodeB: '91310000100028912C',
      projectTarget: '南京南郊110kV输变电新建工程EPC总承包',
      amount: 4850.00,
      taxRate: 9,
      startDate: '2026-09-01',
      endDate: '2027-08-31',
      location: '南京市江宁区谷里街道',
      qualityPeriod: '竣工验收合格之日起24个月',
      paymentNodes: '预付款20%，按工程月进度支付至75%，竣工验收支付至90%，质保金留扣10%',
      breachTerms: '承包人延误工期每日按合同总价0.05%支付违约金，最高不超过合同金额10%',
      disputeResolution: '提交南京仲裁委员会按其届时有效的仲裁规则进行仲裁',
      safetyResponsibility: '承包人承担施工现场全过程安全生产主体责任，严格执行《国网工程安全红线十六条》'
    },
    content: `第一条 工程概况与建设规模
1.1 本工程名称为：国网江苏电力110kV输变电新建工程EPC总承包项目。
1.2 工程建设地点：江苏省南京市江宁区谷里街道。
1.3 建设规模：新建110kV变电站1座，主变容量2×50MVA；新建110kV架空与电缆线路长约18.6公里。

第二条 承包范围与工期要求
2.1 承包范围包括本工程的勘察设计、设备材料采购、土建施工、设备安装调试、试运行及竣工验收全过程EPC总承包。
2.2 本工程计划开工日期为2026年09月01日，计划竣工日期为2027年08月31日，总工期为365日历天。
2.3 因承包人原因导致工期延误的，每延误一日，承包人应向发包人支付合同总价0.05%的违约金。

第三条 合同价款与付款方式
3.1 本合同暂定总价为人民币（大写）肆仟捌佰伍拾万元整（￥48,500,000.00），含9%增值税。
3.2 付款进度：
(1) 合同签订并提供履约保函后15日内，支付预付款20%；
(2) 按经监理与发包人确认的月度完成工程量支付进度款，累计支付不超过工程结算价的75%；
(3) 工程通过达标投产及竣工验收后，支付至结算总价的90%；
(4) 剩余10%作为质量保证金，质保期满24个月后无质量遗留问题无息退还。

第四条 质量、安全与环保责任
4.1 工程质量标准：符合国家及电网公司《输变电工程达标投产考核评定标准》，确保争创省部级优质工程。
4.2 安全责任划分：承包人全面负责施工现场安全生产，遵守《中华人民共和国安全生产法》及国家电网公司安全管理制度。因承包人原因造成人身伤亡或电网安全事故的，由承包人承担全部法律责任及经济损失。
4.3 环保与文明施工：承包人在施工过程中须采取抑尘降噪措施，达标排放。

第五条 争议解决方式
5.1 凡因执行本合同所发生的或与本合同有关的一切争议，双方应首先通过友好协商解决。
5.2 协商不成的，任何一方均可向南京仲裁委员会申请仲裁，仲裁裁决是终局的，对双方均有约束力。`,
    versions: [
      {
        id: 'VER-001',
        versionNumber: 'V1.0',
        label: '初稿',
        createdBy: '张立华（法务专员）',
        createdAt: '2026-08-01 10:30',
        notes: '基于电网EPC总承包标准范本AI生成初始版本',
        content: `第一条 工程概况与建设规模...`
      },
      {
        id: 'VER-002',
        versionNumber: 'V1.1',
        label: '评审稿',
        createdBy: '李敏（法务审核员）',
        createdAt: '2026-08-05 16:40',
        notes: 'AI合规校验后调整了安全责任划分与质保金支付节点',
        content: `第一条 工程概况与建设规模...`
      }
    ],
    complianceIssues: [
      {
        id: 'COMP-001',
        ruleCategory: 'law',
        title: '质保金留扣比例超出法规上限告警',
        description: '第三条第3.2款约定质保金比例为10%，违反住房城乡建设部《建设工程质量保证金管理办法》第六条“保证金总预留比例不得高于工程价款结算总额的3%”的强制性规定。',
        level: 'mandatory',
        originalClause: '(4) 剩余10%作为质量保证金，质保期满24个月后无质量遗留问题无息退还。',
        basis: '《建设工程质量保证金管理办法》(建质〔2017〕138号) 第六条',
        suggestion: '建议将质保金留扣比例修改为“3%”，或调整为提供银行履约质保保函替代扣留现金保证金。',
        linePosition: 18
      },
      {
        id: 'COMP-002',
        ruleCategory: 'internal_policy',
        title: '工程安全违约金未设专项违章处罚条款',
        description: '第四条未明确电网《反违章管理办法》关于发生严重违章行为时按次扣罚安全违约金的具体标准。',
        level: 'suggestion',
        originalClause: '4.2 安全责任划分：承包人全面负责施工现场安全生产...',
        basis: '《国家电网有限公司安全生产反违章管理办法》第十五条',
        suggestion: '建议增加：“若发生Ⅲ级及以上严重违章行为，发包人有权按照单次人民币50,000元标准直接扣减安全违约金”。',
        linePosition: 22
      }
    ],
    riskItems: [
      {
        id: 'RISK-001',
        location: '第三条 3.2(4)',
        title: '质保金高额沉淀与合规争议风险',
        level: 'critical',
        description: '合同约定的10%质保金超出了法定上限3%，若施工方提起诉讼，溢出的7%部分将被法院认定无效并判令退回，且可能按违约计息。',
        consequence: '面临司法败诉、支付逾期退还利息以及被建设主管部门行政通报的风险。',
        basis: '最高人民法院关于审理建设工程施工合同纠纷案件适用法律问题的解释（一）',
        optimization: '将现金质保金调整为3%，其余7%可要求乙方在竣工结算前提供同等金额的银行保函。',
        linePosition: 18
      },
      {
        id: 'RISK-002',
        location: '第二条 2.3',
        title: '工期延误违约金责任封顶偏低风险',
        level: 'high',
        description: '违约金封顶10%在电网基建工程中可能无法覆盖因延误投产导致的电网供电损失与系统调度违约金。',
        consequence: '若工期严重滞后，发包人实际经济损失难以获得完全赔偿。',
        basis: '《中华人民共和国民法典》第五百八十五条',
        optimization: '建议增加“违约金不足以弥补发包人实际损失的，承包人仍应就差额部分承担赔偿责任”。',
        linePosition: 10
      }
    ],
    revisionSuggestions: [
      {
        id: 'REV-001',
        type: 'mandatory',
        originalText: '(4) 剩余10%作为质量保证金，质保期满24个月后无质量遗留问题无息退还。',
        revisedText: '(4) 剩余3%作为质量保证金，质保期满24个月且无遗留质量缺陷后无息退还；承包人也可选择提供等额银行质量保函替代现金留扣。',
        status: 'pending',
        reason: '合规强制性修改：符合建质〔2017〕138号文关于质保金不超过3%的限制。'
      },
      {
        id: 'REV-002',
        type: 'optimization',
        originalText: '5.2 协商不成的，任何一方均可向南京仲裁委员会申请仲裁，仲裁裁决是终局的，对双方均有约束力。',
        revisedText: '5.2 协商不成的，任何一方均应向发包人所在地（南京市）有管辖权的人民法院提起诉讼。',
        status: 'pending',
        reason: '优化建议：贴合电网企业诉讼维权习惯，法院诉讼可更好地配合保全措施。'
      }
    ],
    isArchived: false
  },
  {
    id: 'DOC-20260802-002',
    title: '国网浙江电力2026年度智能电能表物资采购框架协议',
    category: 'procurement',
    subType: 'equipment',
    status: 'draft',
    unit: '国网浙江省电力有限公司',
    createdBy: '王建国（采购经理）',
    createdAt: '2026-08-02 11:00',
    updatedAt: '2026-08-06 09:15',
    formFields: {
      partyA: '国网浙江省电力有限公司物资分公司',
      partyB: '威胜集团股份有限公司',
      creditCodeA: '91330000142981023X',
      creditCodeB: '91430100717082103E',
      projectTarget: '2026年度单相/三相智能电能表集中采购框架协议',
      amount: 12500.00,
      taxRate: 13,
      startDate: '2026-08-10',
      endDate: '2027-08-09',
      location: '浙江省电力公司指定各集约化仓库',
      qualityPeriod: '自到货验收合格之日起36个月',
      paymentNodes: '货到验收合格凭发票支付70%，安装上线满1年支付20%，10%作为质保金期满无息退还',
      breachTerms: '延迟交货每日扣减订单金额0.1%，抽检不合格双倍赔偿并列入电网黑名单',
      disputeResolution: '向甲方所在地杭州市西湖区人民法院提起诉讼'
    },
    content: `第一条 采购标的与预估数量
1.1 本协议为智能电能表框架采购协议，标的包含三相智能电表、单相智能电表及配套采集终端。
1.2 预估采购金额：人民币1.25亿元（大写：壹亿贰仟伍佰万元整）。实际采购数量以各分批次订单为准。

第二条 交货与验收
2.1 卖方必须按照买方下达的采购订单要求，将物资送达浙江省电力公司指定的集约化仓库。
2.2 交付验收必须包含全套出厂检验合格证书及计量器具型式批准证书。

第三条 质量保证与违约责任
3.1 质保期为物资安装上线并运行合格之日起36个月。
3.2 若抽样检测发现计量误差超标或存在重大缺陷，买方有权拒绝收货并取消卖方参与后续招标资格。`,
    versions: [
      {
        id: 'VER-101',
        versionNumber: 'V1.0',
        label: '初稿',
        createdBy: '王建国（采购经理）',
        createdAt: '2026-08-02 11:00',
        notes: '创建采购框架协议草稿',
        content: `第一条 采购标的与预估数量...`
      }
    ],
    complianceIssues: [],
    riskItems: [],
    revisionSuggestions: [],
    isArchived: false
  },
  {
    id: 'DOC-20260725-003',
    title: '关于工程进度滞后与违约责任追究的法务催告函',
    category: 'legal_letter',
    subType: 'reminder',
    status: 'archived',
    unit: '国网安徽省电力有限公司',
    createdBy: '刘洋（法务主管）',
    createdAt: '2026-07-25 09:00',
    updatedAt: '2026-07-28 17:00',
    formFields: {
      partyA: '国网安徽省电力有限公司合肥供电公司',
      partyB: '安徽建工第三建设集团有限公司',
      creditCodeA: '91340100149021980Q',
      creditCodeB: '91340000148900129K',
      projectTarget: '合肥滨湖新区220kV输变电工程土建施工',
      amount: 1800.00,
      taxRate: 9,
      startDate: '2026-01-01',
      endDate: '2026-06-30',
      location: '合肥市滨湖新区',
      qualityPeriod: '按原施工合同执行',
      paymentNodes: '按原施工合同执行',
      breachTerms: '限期15日内补足施工人员与机械，否则直接启动合同解除程序并要求索赔',
      disputeResolution: '合肥仲裁委员会'
    },
    content: `合肥滨湖新区220kV输变电工程土建施工项目部（贵司）：
经我司核查，贵司承建的合肥滨湖新区220kV输变电工程土建施工项目，原定竣工日期为2026年6月30日。截至2026年7月25日，形象进度仅完成70%，已严重违反《施工合同》第二条工期承诺。

特此催告如下：
1. 请贵司自收到本函之日起15日内增加现场施工人员与机械设备，制定书面赶工计划；
2. 若期满仍未达到赶工目标，我司将按照合同约定追究违约金，并保留解除合同、要求贵司承担一切损失的权利。`,
    versions: [
      {
        id: 'VER-201',
        versionNumber: 'V1.0',
        label: '初稿',
        createdBy: '刘洋',
        createdAt: '2026-07-25 09:00',
        notes: '生成初始催告函',
        content: `...`
      },
      {
        id: 'VER-202',
        versionNumber: 'V2.0',
        label: '终稿',
        createdBy: '陈副总（法务总监）',
        createdAt: '2026-07-28 17:00',
        notes: '终稿审定签发归档',
        content: `...`
      }
    ],
    complianceIssues: [],
    riskItems: [],
    revisionSuggestions: [],
    isArchived: true,
    archivedAt: '2026-07-28 17:05'
  }
];

export const INITIAL_KNOWLEDGE_BASE: KnowledgeItem[] = [
  {
    id: 'KB-001',
    category: 'power_engineering',
    title: '国家电网有限公司电力工程施工合同示范文本（2025版）',
    code: 'SGCC-MB-2025-01',
    publishDate: '2025-01-01',
    scope: '集团公司所属各省级电力公司基建、输变电及检修工程',
    content: '【必备条款要求】电力工程合同必须包含：1.工期起止节点与不可抗力核算；2.施工安全责任划分与三不伤害条款；3.质量保证金留扣不超过3%；4.安全生产费用专项列支与监管；5.争议解决优先指定本单位所在地法院或仲裁机构。',
    status: 'active',
    tags: ['工程合同', '范本', 'SGCC标准']
  },
  {
    id: 'KB-002',
    category: 'general_law',
    title: '中华人民共和国民法典（合同编关键条款选编）',
    code: 'LAW-CIVIL-2021',
    publishDate: '2021-01-01',
    scope: '通用法律规范',
    content: '《民法典》第五百八十五条：当事人可以约定一方违约时应当根据违约情况向对方支付一定数额的违约金...约定的违约金低于造成的损失的，人民法院或者仲裁机构可以根据当事人的请求予以增加；约定的违约金过分高于造成的损失的，人民法院或者仲裁机构可以根据当事人的请求予以适当减少。',
    status: 'active',
    tags: ['民法典', '违约金', '国家法律']
  },
  {
    id: 'KB-003',
    category: 'internal_policy',
    title: '国家电网有限公司安全生产反违章管理办法',
    code: 'SGCC-SAFE-2024-08',
    publishDate: '2024-05-15',
    scope: '全集团施工与检修现场安全监督',
    content: '对在国家电网公司基建与检修现场发现的严重违章行为，一律实行“零容忍”。施工单位发生严重违章的，合同中应约定处以单次不低于3万元的安全违约金，并记入企业信用评价体系。',
    status: 'active',
    tags: ['反违章', '安全责任', '企业制度']
  }
];

export const INITIAL_RISK_RULES: RiskRule[] = [
  {
    id: 'RULE-001',
    category: 'power_engineering',
    ruleName: '质保金比例超标规则 (建质〔2017〕138号)',
    level: 'critical',
    description: '检测合同中扣留现金保证金比例是否高于工程结算总额的3%。',
    triggerPattern: '质保金.*(5%|10%|高于3%|超过3%)',
    enabled: true,
    createdAt: '2026-01-10'
  },
  {
    id: 'RULE-002',
    category: 'procurement',
    ruleName: '电网物资抽检免责条款失衡规则',
    level: 'high',
    description: '识别采购合同中供应商单方免除抽检不合格经济赔偿责任的非对等条款。',
    triggerPattern: '不承担.*赔偿|免除.*抽检责任',
    enabled: true,
    createdAt: '2026-02-15'
  },
  {
    id: 'RULE-003',
    category: 'power_engineering',
    ruleName: '工程施工安全责任外包规避规则',
    level: 'critical',
    description: '检测发包人非法将法定安全监督与安全主体责任全部转嫁给承包人的免责条款。',
    triggerPattern: '发包人不承担任何安全责任|全部安全责任由乙方',
    enabled: true,
    createdAt: '2026-03-01'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-20260808-001',
    timestamp: '2026-08-08 09:12:04',
    account: '张立华（法务专员）',
    role: 'business_staff',
    actionType: '文书创建',
    details: '创建了《国网江苏电力110kV输变电新建工程EPC总承包合同》初稿草稿',
    documentId: 'DOC-20260801-001',
    ipAddress: '10.128.42.105'
  },
  {
    id: 'LOG-20260808-002',
    timestamp: '2026-08-08 09:15:30',
    account: '张立华（法务专员）',
    role: 'business_staff',
    actionType: 'AI生成',
    details: '通过表单引导模式，AI一键生成工程EPC合同正文草稿',
    documentId: 'DOC-20260801-001',
    ipAddress: '10.128.42.105'
  },
  {
    id: 'LOG-20260808-003',
    timestamp: '2026-08-08 09:20:11',
    account: '张立华（法务专员）',
    role: 'business_staff',
    actionType: '合规校验',
    details: '对《110kV输变电EPC总承包合同》执行全套合规校验，发现1项强制不合规与1项建议优化',
    documentId: 'DOC-20260801-001',
    ipAddress: '10.128.42.105'
  },
  {
    id: 'LOG-20260808-004',
    timestamp: '2026-08-08 09:25:44',
    account: '李敏（法务审核员）',
    role: 'legal_reviewer',
    actionType: '风险识别',
    details: '触发AI风险识别，检测出1项严重风险（质保金比例超标）与1项高风险',
    documentId: 'DOC-20260801-001',
    ipAddress: '10.128.42.112'
  }
];

export const MOCK_DASHBOARD_METRICS: DashboardMetrics = {
  monthlyGeneratedTotal: 128,
  categoryBreakdown: {
    power_engineering: 52,
    procurement: 41,
    legal_letter: 18,
    internal_policy: 9,
    compliance_report: 8
  },
  complianceCheckCount: 342,
  riskCountByLevel: {
    critical: 12,
    high: 28,
    medium: 64,
    low: 115
  },
  aiAdoptionRate: 88.5,
  archivedCount: 96
};
