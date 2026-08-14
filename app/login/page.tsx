import Link from 'next/link'; import AuthForm from '../../components/auth-form';
export default function Login() { return <section className="card"><h1>登录</h1><AuthForm mode="login"/><p>还没有账号？<Link href="/register">注册</Link></p></section>; }
