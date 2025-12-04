import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ContestMaster - Contest Management Platform',
  description: 'Manage contests, candidates, and jury evaluations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
