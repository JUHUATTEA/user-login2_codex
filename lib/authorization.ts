import type { Session } from './auth';
/** 独立的 RBAC 授权策略：普通用户仅 A，特权账号 A/B。 */
export type Resource = 'A' | 'B';
export function canAccess(session: Session, resource: Resource) { return resource === 'A' || session.role === 'PRIVILEGED'; }
export function requireResource(session: Session | null, resource: Resource) { if (!session) return { ok: false as const, status: 401, message: '请先登录' }; if (!canAccess(session, resource)) return { ok: false as const, status: 403, message: '当前账号无权访问资源 B' }; return { ok: true as const }; }
