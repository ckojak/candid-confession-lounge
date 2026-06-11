import { useEffect } from "react";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/layout/AppHeader";
import { useSession } from "@/context/SessionContext";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { user } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      if (!user) navigate({ to: "/" });
    }, 30);
    return () => clearTimeout(t);
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}