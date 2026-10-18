import { createRootRoute, Outlet } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { DiscardGuard } from '@/app/DiscardGuard';
import { Footer } from '@/app/Footer';
import { Header } from '@/app/Header';
import { NotFoundPage } from '@/app/NotFoundPage';

export const Route = createRootRoute({
  component: () => (
    <RootLayout>
      <Outlet />
    </RootLayout>
  ),
  notFoundComponent: NotFoundPage,
});

export function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div data-testid="app-root" className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-340 flex-1 px-4 pt-7 pb-12 sm:px-6">{children}</main>
      <Footer />
      <DiscardGuard />
    </div>
  );
}
