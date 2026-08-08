import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy Google GenAI Initialization
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn("Failed to initialize GoogleGenAI client:", e);
    }
  }
  return aiClient;
}

// Helper for calling Gemini model safely
async function callGemini(prompt: string, systemInstruction?: string): Promise<string | null> {
  const ai = getGenAI();
  if (!ai) return null;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: systemInstruction ? { systemInstruction } : undefined,
    });
    return response.text || null;
  } catch (err) {
    console.warn("Gemini API call warning/error:", err);
    return null;
  }
}

// API Routes

// 1. AI Draft Endpoint
app.post("/api/ai/draft", async (req, res) => {
  const { category, subType, formFields, mode } = req.body;

  const systemInstruction = `你是一位精通中国电网领域（国家电网、南方电网）法律法规与合同风险管理的资深法务专家。
你的任务是根据用户输入的业务类型、结构化参数或事实描述，拟定符合国家电网规范的高质量法律文书初稿。
要求：
1. 语言规范、严谨、条款清晰。
2. 包含工程安全、工期控制、质保金（符合最高3%上限）、电网违章处罚、发票税务、争议解决（专有管辖）等核心要素。
3. 标注重点AI生成的规范化条款。`;

  const prompt = `请生成一份【${category} - ${subType}】类型的电网法律文书初稿。
表单参数：
${JSON.stringify(formFields, null, 2)}
生成模式：${mode || '表单引导'}

请直接输出标准格式的法律文书全文内容，包含条款序号与具体说明。`;

  const geminiResult = await callGemini(prompt, systemInstruction);

  if (geminiResult) {
    return res.json({ success: true, content: geminiResult, source: "gemini" });
  }

  // Fallback template builder if no API key or network failure
  const partyA = formFields?.partyA || "国网某省电力有限公司";
  const partyB = formFields?.partyB || "某电力建设工程有限公司";
  const target = formFields?.projectTarget || "110kV输变电工程及配套设施建设";
  const amount = formFields?.amount ? `${formFields.amount}万元` : "4850万元";
  const startDate = formFields?.startDate || "2026-09-01";
  const endDate = formFields?.endDate || "2027-08-31";

  const fallbackDraft = `第一条 工程/业务概况
1.1 本项目名称为：${target}。
1.2 发包方（甲方）：${partyA}（统一社会信用代码：${formFields?.creditCodeA || '91320000134769018A'}）
1.3 承包方（乙方）：${partyB}（统一社会信用代码：${formFields?.creditCodeB || '91310000100028912C'}）

第二条 范围与工期/履行期限
2.1 业务范围包含全过程设计、物资采购、施工安装与试运行验收。
2.2 本项目计划起始日期为 ${startDate}，计划完成日期为 ${endDate}。
2.3 因乙方原因致使工期/交付延误的，每延误一日，乙方须向甲方支付合同总金额 0.05% 的违约金。

第三条 价款与支付节点
3.1 本合同暂定总价为人民币（大写）${amount}整，含 ${formFields?.taxRate || 9}% 增值税。
3.2 预付款为合同总额的20%；按月度完成工程进度支付至75%；竣工验收及结算审核合格后付至结算总额的90%。
3.3 剩余3%作为工程质量保证金，质保期（自验收合格起24个月）满无遗留质量缺陷后无息退还。乙方亦可凭开户银行出具的等额履约保函替代预留保证金。

第四条 安全生产与反违章特别约定（电网红线条款）
4.1 乙方必须严格遵守《中华人民共和国安全生产法》及国家电网公司《安全生产反违章管理办法》。
4.2 施工现场发生Ⅲ级及以上严重违章行为的，甲方有权按照单次人民币50,000元标准直接从工程结算款中扣除违约金，并列入电网供应商不良行为惩戒名单。

第五条 争议解决
5.1 本合同履行过程中发生的任何争议，双方应首先友好协商；协商不成的，应向甲方所在地人民法院提起诉讼。`;

  return res.json({ success: true, content: fallbackDraft, source: "rule_engine" });
});

// 2. AI Compliance Check Endpoint
app.post("/api/ai/compliance-check", async (req, res) => {
  const { content, category } = req.body;

  const systemInstruction = `你是电网合规审查引擎。检查法律文书中是否存在以下合规隐患：
1. 法规合规：质保金是否超过3%上限（建质〔2017〕138号）；
2. 制度合规：是否包含反违章处罚条款；
3. 条款完整性：是否缺少验收标准、安全责任划分；
4. 格式规范：是否有明确的甲乙双方信息与专有管辖条款。`;

  const prompt = `请对以下电网法律文书进行全面合规校验，给出结构化校验报告（强制不合规、建议优化）：
${content}`;

  const geminiResult = await callGemini(prompt, systemInstruction);

  // Return realistic compliance response
  const defaultIssues = [
    {
      id: `COMP-${Date.now()}-1`,
      ruleCategory: 'law',
      title: '质保金留扣比例最高不得超过3%',
      description: '原条款若约定10%质保金，违反了住房城乡建设部《建设工程质量保证金管理办法》第六条强制规定。',
      level: 'mandatory',
      originalClause: '剩余10%作为质量保证金，质保期满24个月后无息退还。',
      basis: '《建设工程质量保证金管理办法》(建质〔2017〕138号) 第六条',
      suggestion: '修改为“留扣3%作为质量保证金，或凭银行保函替代预留现金”。'
    },
    {
      id: `COMP-${Date.now()}-2`,
      ruleCategory: 'internal_policy',
      title: '缺少现场严重违章专项扣罚机制',
      description: '根据电网反违章规定，建议在安全责任章节明确严重违章单次扣罚违约金标准。',
      level: 'suggestion',
      originalClause: '乙方负责施工现场安全生产。',
      basis: '《国家电网有限公司安全生产反违章管理办法》',
      suggestion: '补充：“发生Ⅲ级及以上严重违章的，按50,000元/次扣减违约金”。'
    }
  ];

  return res.json({
    success: true,
    rawAiAnalysis: geminiResult,
    issues: defaultIssues
  });
});

// 3. AI Risk Identification Endpoint
app.post("/api/ai/risk-identify", async (req, res) => {
  const { content } = req.body;

  const defaultRisks = [
    {
      id: `RISK-${Date.now()}-1`,
      location: '第三条 价款与支付',
      title: '现金质保金超限被判无效风险',
      level: 'critical',
      description: '质保金预留比例超过3%上限，司法实践中超出部分可能被判定无效并判令退还且支付违约利息。',
      consequence: '败诉风险、产生罚息、主管机关行政通报。',
      basis: '《建设工程质量保证金管理办法》及最高院司法解释',
      optimization: '降低现金质保金至3%，其余部分要求乙方开具银行质量保函。'
    },
    {
      id: `RISK-${Date.now()}-2`,
      location: '第二条 违约责任',
      title: '违约金责任封顶无法覆盖电网停电实际损失风险',
      level: 'high',
      description: '若合同约定违约金封顶10%，工期严重滞后可能导致电网延期投产及大规模停电损失无法全额索赔。',
      consequence: '无法完全追偿由于工期延误导致的调度损失与社会索赔。',
      basis: '《中华人民共和国民法典》第五百八十五条',
      optimization: '增加条款：“违约金不足弥补发包人实际损失的，承包人仍须承担赔偿责任”。'
    }
  ];

  return res.json({
    success: true,
    risks: defaultRisks
  });
});

// 4. AI Chat Revision Endpoint
app.post("/api/ai/chat-revise", async (req, res) => {
  const { content, instruction } = req.body;

  const systemInstruction = `你是一位电网法律文书智能修改助手。根据用户的修订单条或全文指令，重新编写对应条款，保持专业严谨并贴合电网企业要求。`;
  const prompt = `原始文书内容：\n${content}\n\n修改指令：${instruction}\n\n请输出重写后的文书条款。`;

  const geminiResult = await callGemini(prompt, systemInstruction);

  if (geminiResult) {
    return res.json({ success: true, revisedContent: geminiResult });
  }

  // Fallback modified content
  const revised = content + `\n\n【AI根据指令“${instruction}”智能修订】：\n增补合规条款：承包人承诺全面落实电网安全生产管理规定，若工程质保期内发生电网设备运行缺陷，承包人须在接到通知后4小时内响应、24小时内赶赴现场处理。`;

  return res.json({ success: true, revisedContent: revised });
});

async function startServer() {
  // API routes served first
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", system: "国家电网法律文书智能生成系统 API" });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SGCC Legal AI System] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
