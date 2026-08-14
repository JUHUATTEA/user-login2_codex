import './style.css';
export const metadata = { title: '授权 Demo', description: '用户登录与资源授权演示' };
export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="zh-CN"><body><main>{children}</main></body></html>; }
