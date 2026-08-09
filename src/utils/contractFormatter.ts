/**
 * Contract Clause Formatting Utility
 * Formats plain text or structured contract content into standard Chinese legal contract clause HTML.
 */

export function formatContractContentToHtml(content: string): string {
  if (!content) return '';

  // Check if content already contains HTML block tags like <p>, <h2>, <h1>, <div>, <table>, <ul>
  const hasHtml = /<(p|h[1-6]|div|table|ul|ol|li)[ >]/i.test(content);
  if (hasHtml) {
    return content;
  }

  // Split plain text by line breaks
  const lines = content.split('\n');
  const formattedBlocks: string[] = [];

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Check if line is Document Title
    if (
      (trimmed.includes('合同') || trimmed.includes('协议') || trimmed.includes('范本') || trimmed.includes('办法')) &&
      !trimmed.startsWith('第') &&
      !/^\d+\./.test(trimmed) &&
      trimmed.length < 50
    ) {
      formattedBlocks.push(
        `<h1 style="text-align: center; font-size: 20px; font-weight: bold; margin-top: 12px; margin-bottom: 24px; color: #0f172a; letter-spacing: 0.05em;">${trimmed}</h1>`
      );
      return;
    }

    // Check if line is Contract Parties (e.g. 发包方（甲方）：... or 甲方：...)
    if (/^(发包方|承包方|甲方|乙方|买方|卖方|订立合同双方|发包单位|承包单位)[（(]?(甲方|乙方)?[）)]?[:：]/.test(trimmed)) {
      formattedBlocks.push(
        `<p style="text-indent: 2em; margin: 10px 0; font-size: 14px; color: #334155; font-weight: 600;">${trimmed}</p>`
      );
      return;
    }

    // Check if line is Article Heading (e.g., 第一条 工程概况与建设规模)
    if (/^第[一二三四五六七八九十0-9]+条\s*/.test(trimmed)) {
      formattedBlocks.push(
        `<h2 style="font-size: 15px; font-weight: bold; margin-top: 24px; margin-bottom: 12px; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 6px; color: #1e293b; display: flex; align-items: center; gap: 8px;">
          <span style="display: inline-block; width: 4px; height: 16px; background-color: #2563eb; border-radius: 2px;"></span>
          ${trimmed}
        </h2>`
      );
      return;
    }

    // Check if line is Sub-item under a clause (e.g. (1) ..., (2) ..., ① ..., ② ...)
    if (/^[\(（][0-9一二三四五六七八九十]+[\)）]/.test(trimmed) || /^[①②③④⑤⑥⑦⑧⑨⑩]/.test(trimmed)) {
      formattedBlocks.push(
        `<p style="margin: 6px 0 6px 3.5em; line-height: 1.85; font-size: 14px; color: #334155; text-align: justify;">${trimmed}</p>`
      );
      return;
    }

    // Check if line is Clause item (e.g., 1.1 ..., 1.2 ..., 2.1 ..., 3.2.1 ...)
    if (/^\d+\.\d+/.test(trimmed) || /^\d+\.\s*/.test(trimmed)) {
      formattedBlocks.push(
        `<p style="text-indent: 2em; margin: 10px 0; line-height: 1.85; font-size: 14px; color: #1e293b; text-align: justify;">${trimmed}</p>`
      );
      return;
    }

    // Regular clause paragraph
    formattedBlocks.push(
      `<p style="text-indent: 2em; margin: 10px 0; line-height: 1.85; font-size: 14px; color: #1e293b; text-align: justify;">${trimmed}</p>`
    );
  });

  return formattedBlocks.join('\n');
}
