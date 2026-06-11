import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, Users, VenetianMask } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { useSession } from "@/context/SessionContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kojak — Fale o que sente" },
      {
        name: "description",
        content:
          "Rede social híbrida para desabafos e saúde mental. Com sua identidade ou no anonimato total. Um espaço seguro.",
      },
      { property: "og:title", content: "Kojak — Fale o que sente" },
      {
        property: "og:description",
        content: "Desabafe com sua identidade ou no anonimato. Um espaço seguro.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { user } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: "/feed" });
  }, [user, navigate]);

  function scrollToAuth() {
    document.getElementById("auth")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={scrollToAuth}>
            Entrar
          </Button>
          <Button size="sm" onClick={scrollToAuth}>
            Criar conta
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-20">
        <section className="relative grid items-center gap-10 pt-6 pb-10 md:grid-cols-2 md:pt-16 md:pb-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
          />
          <div className="relative space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Espaço seguro de saúde mental
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
              Fale o que sente.
              <br />
              <span className="bg-gradient-to-r from-primary to-[var(--primary-glow)] bg-clip-text text-transparent">
                Com identidade
              </span>{" "}
              ou no anonimato total.
            </h1>
            <p className="max-w-md text-base text-muted-foreground md:text-lg">
              Kojak é uma comunidade pra desabafos honestos. Sem chat privado, sem julgamento — só
              conversa pública, gentil e com regras claras.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={scrollToAuth}>
                Começar agora
              </Button>
              <Button variant="ghost" size="lg" onClick={scrollToAuth}>
                Já tenho conta
              </Button>
            </div>
          </div>

          <div id="auth" className="relative">
            <Card className="border-border/60 bg-card/80 p-6 shadow-[var(--shadow-glow)] backdrop-blur">
              <AuthTabs />
            </Card>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <FeatureCard
            icon={<VenetianMask className="h-5 w-5" />}
            title="Identidade ou anônimo"
            text="A cada post você escolhe se aparece ou some atrás da máscara. Sem pegadinha."
          />
          <FeatureCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Verificação opcional"
            text="Suba um documento e ganhe o selo de identidade verificada — sem perder o direito ao anônimato."
          />
          <FeatureCard
            icon={<Users className="h-5 w-5" />}
            title="Comunidade segura"
            text="Sem mensagens privadas. Tudo acontece na luz, com filtros e denúncia em um clique."
          />
        </section>
      </main>

      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        Kojak MVP · não substitui acompanhamento profissional. Em crise? Ligue 188 (CVV).
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <Card className="space-y-2 border-border/60 bg-card p-5">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary">
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{text}</p>
    </Card>
  );
}
