import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Set New Password | RARE NUTS',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
