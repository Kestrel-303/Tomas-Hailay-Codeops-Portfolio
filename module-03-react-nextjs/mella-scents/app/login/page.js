import { safeNext } from '@/lib/safe-next';
import LoginForm from './LoginForm';

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to Mella Scents to check out, save fragrances to your wishlist and see your orders.',
  alternates: { canonical: '/login' },
};

export default async function LoginPage({ searchParams }) {
  const { next } = await searchParams;
  return (
    <section className="page-section container login-page">
      <p className="page-section__eyebrow">Welcome Back</p>
      <h1 className="page-section__title">Sign In</h1>
      <p className="page-section__body">Sign in to check out, save fragrances to your wishlist and see your orders.</p>
      <LoginForm next={safeNext(next)} />
      <p className="demo-note">
        Demo accounts: <strong>selam@mellascents.et</strong> or <strong>dawit@mellascents.et</strong>, password <strong>mella123</strong>.
      </p>
    </section>
  );
}
