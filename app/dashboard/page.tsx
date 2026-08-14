import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '../../lib/auth';
export default async function Dashboard() {
  const session = await getSession(); if (!session) redirect('/login');
  return <section className="card"><p className="eyebrow">CONTROL CENTER</p><h1>你好，{session.username}</h1><p>当前身份：<strong>{session.role === 'PRIVILEGED' ? '专属测试账号（资源 A / B）' : '普通账号（仅资源 A）'}</strong></p><div className="resource-grid"><Link href="/resource-a" className="resource"><span>资源 A</span><small>所有登录用户可访问</small></Link><Link href="/resource-b" className="resource"><span>资源 B</span><small>需要专属测试账号</small></Link></div><form action="/api/auth/logout" method="post"><button className="secondary">退出登录</button></form></section>;
}
