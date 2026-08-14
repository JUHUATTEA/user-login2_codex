import Link from 'next/link';
export default function Home() { return <section className="card hero"><p className="eyebrow">LOGIN · AUTHORIZATION DEMO</p><h1>用户登录授权演示</h1><p>注册名称经 LLM 审核后创建账号；普通用户可访问资源 A，特权测试账号可访问 A、B。</p><div className="actions"><Link className="button" href="/register">注册账号</Link><Link className="button secondary" href="/login">登录</Link></div></section>; }
