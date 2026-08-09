/**
 * State Grid Standard Legal Document Generator
 * 国家电网标准法律文书范本生成器
 * 
 * 包含五大类核心文书类型：
 * 1. 电力工程合同（基建、技改、检修、运维）
 * 2. 采购合同（框架采购、单次采购、物资采购、服务采购）
 * 3. 法务函件（催告、告知、警示、联络、答复）
 * 4. 制度文件（总则、适用范围、职责分工、管理流程、管控要求、附则、释义）
 * 5. 合规报告（数据统计、问题梳理、成效总结、风险分析、下一步计划）
 */

import { DocumentCategory, FormFields } from '../types';

export function generateDocumentContent(
  category: DocumentCategory,
  subType: string,
  formFields: FormFields,
  unitName: string = '国家电网有限公司'
): string {
  const partyA = formFields.partyA || unitName;
  const partyB = formFields.partyB || '承包商/供应商单位';
  const amount = formFields.amount || 1000;
  const projectTarget = formFields.projectTarget || '工程建设/采购业务项目';
  const startDate = formFields.startDate || '2026-09-01';
  const endDate = formFields.endDate || '2027-08-31';
  const location = formFields.location || '发包人指定现场';

  switch (category) {
    // ==================== 1. 电力工程合同 ====================
    case 'power_engineering': {
      const isEpc = subType === 'epc';
      const isRenovation = subType === 'renovation' || subType === 'jigai';
      const isMaintenance = subType === 'maintenance' || subType === 'yunwei';
      const isSupervision = subType === 'supervision';

      const sceneTag = isEpc ? '基建EPC总承包' : isRenovation ? '技术改造与升级' : isMaintenance ? '检修运维抢修' : isSupervision ? '工程监理服务' : '基建工程施工';

      return `
<h1 style="text-align: center; font-size: 22px; font-weight: bold; margin-bottom: 20px; color: #0f172a;">${partyA} ${projectTarget} (${sceneTag}) 施工合同</h1>

<div style="font-size: 13px; color: #475569; margin-bottom: 20px; padding: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
  <p style="margin: 2px 0;"><strong>发包方（甲方）：</strong> ${partyA} （统一社会信用代码：${formFields.creditCodeA || '91320000134769018A'}）</p>
  <p style="margin: 2px 0;"><strong>承包方（乙方）：</strong> ${partyB} （统一社会信用代码：${formFields.creditCodeB || '91310000100028912C'}）</p>
  <p style="margin: 2px 0;"><strong>适配工程场景：</strong> 电力工程 - ${sceneTag}（严格匹配国网公司建设管理规定）</p>
</div>

<h2 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">第一条 工程概况与建设规模</h2>
<p style="text-indent: 2em; margin: 8px 0;">1.1 本工程名称为：<strong>${projectTarget}</strong>。</p>
<p style="text-indent: 2em; margin: 8px 0;">1.2 施工地点与范围：位于 ${location}。工程包含电网变电站、输电线路及配套自动化、二次保护装置的建设与调试。</p>
<p style="text-indent: 2em; margin: 8px 0;">1.3 建设规模与技术指标：严格执行国家电力行业标准及国家电网有限公司《输变电工程达标投产考核评定标准》，建设规模与工程量以经批复的施工图纸及工程量清单为准。</p>

<h2 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">第二条 施工范围与工作内容</h2>
<p style="text-indent: 2em; margin: 8px 0;">2.1 乙方负责完成承包范围内的土建施工、设备安装、电缆敷设、二次接线、单体调试、系统联调及配合带电试运行。</p>
<p style="text-indent: 2em; margin: 8px 0;">2.2 乙方须向甲方提供全套竣工技术图纸、试验报告及合规资料，确保工程顺利通过电网质量监督机构质监验收及国家电网竣工验收。</p>

<h2 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">第三条 工期约定与里程碑节点</h2>
<p style="text-indent: 2em; margin: 8px 0;">3.1 本工程计划开工日期为：<strong>${startDate}</strong>，计划竣工日期为：<strong>${endDate}</strong>，总工期为日历天。</p>
<p style="text-indent: 2em; margin: 8px 0;">3.2 里程碑节点：乙方须严格遵守基础出零米、主变就位、电气安装完成、带电试运行等电网管控节点。因乙方原因导致工期延误的，每延误一日，乙方应向甲方支付合同总价 <strong>0.05%</strong> 的违约金。</p>

<h2 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">第四条 质量标准与工程验收</h2>
<p style="text-indent: 2em; margin: 8px 0;">4.1 工程质量标准：符合国家建设工程质量验收规范及电网工程优质工程评审标准，一次验收合格率必须达到100%。</p>
<p style="text-indent: 2em; margin: 8px 0;">4.2 隐蔽工程验收：隐蔽工程覆盖前，乙方须提前24小时通知甲方及监理工程师现场验收，验收合格签署记录后方可进入下道工序。</p>

<h2 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">第五条 安全责任与电网反违章管理（电网专属重难点条款）</h2>
<p style="text-indent: 2em; margin: 8px 0;">5.1 乙方必须严格遵守《中华人民共和国安全生产法》及国家电网有限公司《安全生产反违章管理办法》、《基建安全红线十六条》，对施工现场负全面安全生产主体责任。</p>

<div style="background-color: #f0f9ff; border: 1px solid #bae6fd; padding: 12px; border-radius: 6px; margin: 12px 0;">
  <p style="margin: 0; font-weight: bold; color: #0369a1; font-size: 12px;">✨ 【电网反违章专项扣罚条款】</p>
  <p style="margin: 4px 0 0 0; font-size: 13px; color: #0c4a6e; line-height: 1.6;">
    如乙方在作业现场发生Ⅲ级及以上严重违章行为，或擅自扩大工作范围、无票作业，甲方有权按照单次人民币 <strong>50,000 元</strong> 标准直接扣减安全违约金，并列入电网施工企业信用黑名单；造成人身伤亡或电网停电事故的，由乙方承担全部法律与经济赔偿责任。
  </p>
</div>

<h2 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">第六条 现场配合与交叉施工约定</h2>
<p style="text-indent: 2em; margin: 8px 0;">6.1 乙方在邻近带电设备区域施工时，必须严格保持国家规定的安全距离，设专职监护人员，服从电网调度部门及运行单位的统一安检指挥。</p>
<p style="text-indent: 2em; margin: 8px 0;">6.2 甲方负责协调外部施工环境及停电配合计划，乙方须积极配合电网停电窗口期紧凑施工，不得因内部原因拖延配合。</p>

<h2 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">第七条 验收结算与质保服务</h2>
<p style="text-indent: 2em; margin: 8px 0;">7.1 合同暂定总价为：人民币 <strong>${amount}</strong> 万元（大写：人民币伍仟万元整），含 9% 增值税。</p>
<p style="text-indent: 2em; margin: 8px 0;">7.2 工程质量保证金：按照住建部《建设工程质量保证金管理办法》（建质〔2017〕138号）规定，本工程预留 <strong>3%</strong> 结算价款作为质量保证金（或由乙方提供等额银行质量保函）。</p>
<p style="text-indent: 2em; margin: 8px 0;">7.3 质保服务与故障响应：本工程保修期为 <strong>${formFields.qualityPeriod || '24个月'}</strong>。质保期内发生设备质量缺陷，乙方须在接到通知后 <strong>2 小时内到达现场</strong> 并免费修复。</p>

<h2 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">第八条 违约责任与不可抗力</h2>
<p style="text-indent: 2em; margin: 8px 0;">8.1 因不可抗力（如特大自然灾害、政策性停工）导致无法履行的，双方按《民法典》相关规定核算免责。</p>
<p style="text-indent: 2em; margin: 8px 0;">8.2 争议解决：双方协商不成时，均应向甲方所在地（${location.substring(0, 3) || '南京市'}）有管辖权的人民法院提起诉讼。</p>
      `.trim();
    }

    // ==================== 2. 采购合同 ====================
    case 'procurement': {
      const isFramework = subType === 'framework';
      const isSingle = subType === 'single_purchase';
      const isService = subType === 'service';
      const isEquipment = subType === 'equipment';

      const typeLabel = isFramework ? '框架采购协议' : isSingle ? '单次采购合同' : isService ? '服务采购合同' : '物资设备采购合同';

      return `
<h1 style="text-align: center; font-size: 22px; font-weight: bold; margin-bottom: 20px; color: #0f172a;">${partyA} ${projectTarget} (${typeLabel})</h1>

<div style="font-size: 13px; color: #475569; margin-bottom: 20px; padding: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
  <p style="margin: 2px 0;"><strong>买方（甲方）：</strong> ${partyA}</p>
  <p style="margin: 2px 0;"><strong>卖方（乙方）：</strong> ${partyB}</p>
  <p style="margin: 2px 0;"><strong>采购模式分类：</strong> ${typeLabel}（标准化条文防范规避采购风险）</p>
</div>

<h2 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">第一条 标的明细与规格参数</h2>
<p style="text-indent: 2em; margin: 8px 0;">1.1 本合同/协议标的为：<strong>${projectTarget}</strong>。具体包含配电变压器、智能电能表、高压开关柜或信息技术服务等物资/服务。</p>
<p style="text-indent: 2em; margin: 8px 0;">1.2 规格型号与技术要求：严格符合国家标准、行业标准及国家电网有限公司《采购设备通用技术规范书》要求。</p>

<h2 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">第二条 价格税率与预估金额</h2>
<p style="text-indent: 2em; margin: 8px 0;">2.1 本合同不含税金额为人民币 <strong>${(amount * 0.87).toFixed(2)}</strong> 万元，适用增值税税率 <strong>${formFields.taxRate || 13}%</strong>，含税总金额为人民币 <strong>${amount}</strong> 万元。</p>
<p style="text-indent: 2em; margin: 8px 0;">2.2 计价方式：${isFramework ? '本协议为框架计价，实际结算金额以甲方下达的分批次具体订单为准。' : '本合同为固定总价合同，在合同履约期内价格保持固定不变。'}</p>

<h2 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">第三条 交付要求与运输包装</h2>
<p style="text-indent: 2em; margin: 8px 0;">3.1 交付地点与时限：乙方须于 <strong>${endDate}</strong> 前，将物资运输送达甲方指定的集约化仓库或项目工地（${location}）。</p>
<p style="text-indent: 2em; margin: 8px 0;">3.2 运输与包装：乙方负责防护包装与运输保险，确保物资在运输过程中无受潮、碰撞及损坏。</p>

<h2 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">第四条 验收标准与电网抽检机制</h2>
<p style="text-indent: 2em; margin: 8px 0;">4.1 到货验收：物资到达后，双方共同开箱查验出厂检验合格证、出厂试验报告及电网计量器具许可证。</p>
<p style="text-indent: 2em; margin: 8px 0;">4.2 电网抽检规则：甲方有权委托第三方权威电网检测中心对交付物资进行抽检。如抽检指标不合格，乙方须在5日内无条件免费退换货，并承担一切抽检及延误费用。</p>

<h2 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">第五条 付款节点与发票开具</h2>
<p style="text-indent: 2em; margin: 8px 0;">5.1 预付款/到货款：货到验收合格凭乙方开具的合规增值税专用发票支付 <strong>70%</strong>；安装上线运行满一年支付 <strong>20%</strong>。</p>
<p style="text-indent: 2em; margin: 8px 0;">5.2 质量保证金：剩余 <strong>10%</strong> 款项留扣作为质量保证金，质保期 <strong>36个月</strong> 满且无质量争议后无息退还。</p>

<h2 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">第六条 知识产权、保密与退换货约定</h2>
<p style="text-indent: 2em; margin: 8px 0;">6.1 知识产权担保：乙方保证交付的软硬件物资不侵犯任何第三方的专利权、著作权或商业秘密。</p>
<p style="text-indent: 2em; margin: 8px 0;">6.2 商业保密：双方对履约过程中获取的电网运行数据、技术文档及商业信息负严格保密义务。</p>
<p style="text-indent: 2em; margin: 8px 0;">6.3 违约追责：若乙方出现质量缺陷拒不退换或延迟交货，甲方有权列入电网供应商黑名单并暂停其投标资格。</p>
      `.trim();
    }

    // ==================== 3. 法务函件 ====================
    case 'legal_letter': {
      const isReminder = subType === 'reminder';
      const isWarning = subType === 'warning';
      const isNotice = subType === 'notice';
      const isReply = subType === 'reply';

      const letterTypeLabel = isReminder ? '法务催告函' : isWarning ? '严厉警示函' : isReply ? '官方复函' : isNotice ? '法律告知函' : '法务联络函';
      const toneNotice = isReminder ? '行文语气：严肃催告，限定履约期限' : isWarning ? '行文语气：严厉警示，告诫违约后果' : '行文语气：庄重规范，严谨陈述法律事实';

      return `
<h1 style="text-align: center; font-size: 22px; font-weight: bold; margin-bottom: 20px; color: #991b1b;">${partyA} ${letterTypeLabel}</h1>

<div style="font-size: 13px; color: #475569; margin-bottom: 20px; padding: 12px; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 6px;">
  <p style="margin: 2px 0;"><strong>致函单位（相对人）：</strong> ${partyB}</p>
  <p style="margin: 2px 0;"><strong>发函单位（甲方）：</strong> ${partyA}</p>
  <p style="margin: 2px 0;"><strong>函件用途：</strong> ${letterTypeLabel}（${toneNotice}，适配电网对外正式行文规范）</p>
</div>

<h2 style="font-size: 15px; font-weight: bold; color: #7f1d1d; margin-top: 16px;">一、 事实陈述与背景说明</h2>
<p style="text-indent: 2em; margin: 8px 0;">
  贵司与我司于 <strong>${startDate}</strong> 签订了关于 <strong>《${projectTarget}》</strong>（合同编号：SGCC-2026-CTR）。按合同约定，贵司应于 <strong>${endDate}</strong> 前完成约定履约义务。
</p>
<p style="text-indent: 2em; margin: 8px 0;">
  经我司现场核查与核算，截至目前，贵司存在以下违约事实：未按期推进工程节点/欠付货款/现场安全违章严重，已严重影响电网建设整体进度与安全稳定运行。
</p>

<h2 style="font-size: 15px; font-weight: bold; color: #7f1d1d; margin-top: 16px;">二、 法律援引与合同依据</h2>
<p style="text-indent: 2em; margin: 8px 0;">
  1. 依据《中华人民共和国民法典》第五百七十七条：“当事人一方不履行合同义务或者履行合同义务不符合约定的，应当承担继续履行、采取补救措施或者赔偿损失等违约责任”；
</p>
<p style="text-indent: 2em; margin: 8px 0;">
  2. 依据双方签订之《${projectTarget}》第违约责任条款约定：贵司须按每日合同总价 0.05% 支付违约赔偿金。
</p>

<h2 style="font-size: 15px; font-weight: bold; color: #7f1d1d; margin-top: 16px;">三、 正式诉求内容与限期履约要求</h2>
<p style="text-indent: 2em; margin: 8px 0;">
  鉴于上述事实，我司特向贵司提出如下正式法律诉求：
</p>

<div style="background-color: #fef1f2; border-left: 4px solid #dc2626; padding: 10px 14px; margin: 10px 0; font-size: 13px; color: #881337;">
  <p style="margin: 4px 0;"><strong>1. 限期纠正：</strong> 请贵司自收到本函之日起 <strong>7 日内</strong> 纠正违约行为，补齐施工力量/支付违约金。</p>
  <p style="margin: 4px 0;"><strong>2. 方案报备：</strong> 提交经贵司法定代表人签署的书面整改与追赶计划方案。</p>
</div>

<h2 style="font-size: 15px; font-weight: bold; color: #7f1d1d; margin-top: 16px;">四、 法律后果警示与送达说明</h2>
<p style="text-indent: 2em; margin: 8px 0;">
  若贵司期满仍未按要求履行，我司将立即启动法律程序：包括但不限于解除合同、向法院申请财产保冷、追究全部经济损失，并将贵司列入国家电网黑名单禁入名单。
</p>
<p style="text-indent: 2em; margin: 8px 0;">
  本函件通过 EMS 快递及电网企业官方邮箱同步送达，自送达之日起产生法律效力。
</p>

<div style="margin-top: 40px; text-align: right; padding-right: 20px;">
  <p style="margin: 2px 0; font-weight: bold; font-size: 14px;">${partyA}</p>
  <p style="margin: 2px 0; font-size: 12px; color: #64748b;">法务与合规管理部（印）</p>
  <p style="margin: 2px 0; font-size: 12px; color: #64748b;">日期：${new Date().toISOString().substring(0, 10)}</p>
</div>
      `.trim();
    }

    // ==================== 4. 制度文件 ====================
    case 'internal_policy': {
      return `
<h1 style="text-align: center; font-size: 22px; font-weight: bold; margin-bottom: 20px; color: #0f172a;">${partyA} ${projectTarget} 管理办法 (试行)</h1>

<div style="font-size: 13px; color: #475569; margin-bottom: 20px; padding: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
  <p style="margin: 2px 0;"><strong>发布单位：</strong> ${partyA}</p>
  <p style="margin: 2px 0;"><strong>文号：</strong> 国网江苏法务〔2026〕28号</p>
  <p style="margin: 2px 0;"><strong>章节规范：</strong> 制度总则、适用范围、职责分工、管理流程、管控要求、附则、释义</p>
</div>

<h2 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">第一章 制度总则</h2>
<p style="text-indent: 2em; margin: 8px 0;"><strong>第一条 制定目的：</strong> 为贯彻落实国家电力法律法规，提升电网法务内控与合规管理水平，规范法律文书审查与风险防控，特制定本办法。</p>
<p style="text-indent: 2em; margin: 8px 0;"><strong>第二条 制定依据：</strong> 依据《中华人民共和国电力法》、《中华人民共和国民法典》及国家电网有限公司《法务与合规管理规定》等国家与企业规章。</p>

<h2 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">第二章 适用范围</h2>
<p style="text-indent: 2em; margin: 8px 0;"><strong>第三条 适用对象：</strong> 本办法适用于公司本部各部门、各下属分公司、子公司以及承接电网工程施工与物资采购的所有外部合作单位。</p>

<h2 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">第三章 职责分工</h2>
<p style="text-indent: 2em; margin: 8px 0;"><strong>第四条 法务部门职责：</strong> 负责全公司法律文书的合规性审查、风控引擎规则维护、合同纠纷处理及诉讼仲裁对接。</p>
<p style="text-indent: 2em; margin: 8px 0;"><strong>第五条 业务承办部门职责：</strong> 负责合同履约过程监管、工程现场安全质量督导及商务条款初步把关。</p>

<h2 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">第四章 管理流程与审查关口</h2>
<p style="text-indent: 2em; margin: 8px 0;"><strong>第六条 智能起草与校验流程：</strong> 所有法律合同须优先通过电网智能文书生成系统采用标准范本起草，并完成合规一键校验。</p>
<p style="text-indent: 2em; margin: 8px 0;"><strong>第七条 审批与盖章：</strong> 未未经法务审核或存在“强制不合规”风险未整改的文书，一律不得加盖公章。</p>

<h2 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">第五章 管控要求与红线问责</h2>
<p style="text-indent: 2em; margin: 8px 0;"><strong>第八条 禁止性红线行为：</strong> 严禁未经审批擅自修改标准范本核心条款；严禁违规提高质保金比例超出3%上限。</p>

<h2 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">第六章 附则与生效日期</h2>
<p style="text-indent: 2em; margin: 8px 0;"><strong>第九条 解释归口：</strong> 本办法由公司法务与合规管理部负责解释。</p>
<p style="text-indent: 2em; margin: 8px 0;"><strong>第十条 施行日期：</strong> 本办法自发布之日起施行。</p>
      `.trim();
    }

    // ==================== 5. 合规报告 ====================
    case 'compliance_report': {
      const isAnnual = subType === 'annual_report';
      const reportTitle = isAnnual ? `${partyA} 2026年度法务与合规自查总结报告` : `${partyA} ${projectTarget} 专项合规诊断评估报告`;

      return `
<h1 style="text-align: center; font-size: 22px; font-weight: bold; margin-bottom: 20px; color: #0f172a;">${reportTitle}</h1>

<div style="font-size: 13px; color: #475569; margin-bottom: 20px; padding: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
  <p style="margin: 2px 0;"><strong>评估主导部门：</strong> ${partyA} 法务与合规管理部</p>
  <p style="margin: 2px 0;"><strong>评估统计周期：</strong> ${startDate} 至 ${endDate}</p>
  <p style="margin: 2px 0;"><strong>报告功能说明：</strong> 自动抓取合规工作数据、风险排查数据、整改数据与制度执行数据，构建结构化报告。</p>
</div>

<h2 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">一、 报告概述与审查范围</h2>
<p style="text-indent: 2em; margin: 8px 0;">本报告覆盖我单位基建工程、物资采购、运维检修等全业务领域。采用 AI 智能风控引擎与法务人工复审结合模式，对周期内履约文书执行全覆盖诊断。</p>

<h2 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">二、 周期内合规工作数据抓取与汇总</h2>
<table style="width: 100%; border-collapse: collapse; margin: 12px 0; border: 1px solid #cbd5e1; font-size: 12px;">
  <thead>
    <tr style="background-color: #f1f5f9; text-align: left;">
      <th style="border: 1px solid #cbd5e1; padding: 8px;">统计指标项目</th>
      <th style="border: 1px solid #cbd5e1; padding: 8px;">全周期数值</th>
      <th style="border: 1px solid #cbd5e1; padding: 8px;">同比/环比变化</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">审查法律文书总份数</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold;">342 份</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; color: #16a34a;">↑ 12.5%</td>
    </tr>
    <tr>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">AI 智能合规识别准确率</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold;">98.5%</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; color: #16a34a;">↑ 4.2%</td>
    </tr>
    <tr>
      <td style="border: 1px solid #cbd5e1; padding: 8px;">挽回潜在经济风险损失金额</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold; color: #b91c1c;">1,850 万元</td>
      <td style="border: 1px solid #cbd5e1; padding: 8px; color: #16a34a;">显著提升</td>
    </tr>
  </tbody>
</table>

<h2 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">三、 风险排查与违规问题梳理</h2>
<p style="text-indent: 2em; margin: 8px 0;">周期内共识别合规问题及隐患 <strong>40 项</strong>：其中“一级极高风险”（如质保金比例超标3%）12项；“二级高风险”28项。高频隐患主要集中于：质保金超标留扣、工程安全责任规避、抽检免责条款不符。</p>

<h2 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">四、 成效总结与整改落实情况</h2>
<p style="text-indent: 2em; margin: 8px 0;">全单位已针对排查出的问题全部完成在线智能修订，整改率达到 <strong>100%</strong>。有效避免了司法败诉及建设主管部门通报风险。</p>

<h2 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-top: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">五、 下一步工作计划撰写</h2>
<p style="text-indent: 2em; margin: 8px 0;">1. 持续扩充电网知识库与工程反违章规则库；</p>
<p style="text-indent: 2em; margin: 8px 0;">2. 强化各基建项目部与采购分公司的法律文书在线表单填报约束，源头防范合规漏洞。</p>
      `.trim();
    }

    default:
      return `<p>请选择具体的文书类型以生成标准化文本。</p>`;
  }
}
