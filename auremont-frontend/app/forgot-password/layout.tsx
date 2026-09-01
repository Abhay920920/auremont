import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password | RARE NUTS',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
