import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, useRouter, Link } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";

import { AppHeader, AppFooter } from "@/components/AppShell";
import { useWalletHydrate } from "@/hooks/useWalletHydrate";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass rounded-3xl p-10 max-w-md text-center">
        <h1 className="text-7xl font-black gradient-text-primary">404</h1>
        <h2 className="mt-3 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass rounded-3xl p-10 max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Try again
          </button>
          <a href="/" className="rounded-md border border-border px-4 py-2 text-sm">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function ClientGate({ children }: { children: React.ReactNode }) {
  // Stacks/connect needs window — only render the app shell on the client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useWalletHydrate();

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ClientGate>
        <div className="min-h-screen flex flex-col">
          <AppHeader />
          <main className="flex-1">
            <Outlet />
          </main>
          <AppFooter />
        </div>
      </ClientGate>
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.17 0.008 270 / 0.95)",
            border: "1px solid oklch(1 0 0 / 0.1)",
            color: "oklch(0.98 0.005 270)",
            backdropFilter: "blur(20px)",
          },
        }}
      />
    </QueryClientProvider>
  );
}
