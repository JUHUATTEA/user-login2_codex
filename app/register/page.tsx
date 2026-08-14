import Link from 'next/link'; import AuthForm from '../../components/auth-form';
export default function Register() { return <section className="card"><h1>注册</h1><p>提交后将调用用户名审核模块。</p><AuthForm mode="register"/><p>已有账号？<Link href="/login">登录</Link></p></section>; }
