/** 仅需调整此处 PROMPT 即可迭代真实 LLM 的审核语境与判断标准。 */
export const USERNAME_MODERATION_PROMPT = `你是社区用户名审核员。判断用户名是否包含辱骂、仇恨、色情、暴力、违法或冒充平台官方等社区违规含义。只返回严格 JSON：{"allowed":true|false,"reason":"不超过30字"}。用户名：`;
export type ModerationResult = { allowed: boolean; reason: string; provider: 'llm' | 'local-fallback' };
function localCheck(username: string): ModerationResult { const forbidden = ['admin', '管理员', '官方', '傻逼', '诈骗', '色情', '赌博', '毒品']; const hit = forbidden.find(x => username.toLowerCase().includes(x.toLowerCase())); return hit ? { allowed: false, reason: '用户名命中演示违规词规则', provider: 'local-fallback' } : { allowed: true, reason: '本地演示规则通过', provider: 'local-fallback' }; }
/** LLM 审核不可用时安全降级为本地规则，保证演示可用；生产可改为失败即拒绝。 */
export async function moderateUsername(username: string): Promise<ModerationResult> {
  if (!process.env.LLM_API_KEY) return localCheck(username);
  try { const res = await fetch(`${process.env.LLM_BASE_URL || 'https://api.openai.com/v1'}/chat/completions`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.LLM_API_KEY}` }, body: JSON.stringify({ model: process.env.LLM_MODEL || 'gpt-4o-mini', temperature: 0, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: USERNAME_MODERATION_PROMPT }, { role: 'user', content: username }] }) }); if (!res.ok) throw new Error('LLM request failed'); const data = await res.json(); const parsed = JSON.parse(data.choices[0].message.content); return { allowed: Boolean(parsed.allowed), reason: String(parsed.reason || 'LLM 审核完成').slice(0, 100), provider: 'llm' }; } catch { return localCheck(username); }
}
