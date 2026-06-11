import { useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, ShieldCheck, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSession } from "@/context/SessionContext";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/verificar")({
  head: () => ({
    meta: [
      { title: "Verificar identidade · Kojak" },
      { name: "description", content: "Verifique sua identidade e ganhe o selo de verificado." },
    ],
  }),
  component: VerifyPage,
});

function VerifyPage() {
  const { user, setVerified } = useSession();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  if (!user) return null;

  function submit() {
    setVerified(true);
    toast.success("Identidade verificada. Seu selo já está ativo.");
    navigate({ to: "/feed" });
  }

  return (
    <Card className="space-y-5 border-border/60 bg-card p-6">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-semibold">Verificar identidade</h1>
          <p className="text-sm text-muted-foreground">
            Envie um documento com foto. Você continua podendo postar anônimo — o selo só aparece
            quando você escolhe se identificar.
          </p>
        </div>
      </div>

      {user.verified ? (
        <div className="flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 p-3 text-sm text-primary">
          <CheckCircle2 className="h-4 w-4" /> Sua conta já está verificada.
        </div>
      ) : (
        <>
          <div
            onClick={() => inputRef.current?.click()}
            className="grid cursor-pointer place-items-center rounded-xl border border-dashed border-border bg-background/40 p-8 text-center transition-colors hover:border-primary/60 hover:bg-primary/5"
          >
            <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
            <p className="text-sm font-medium">
              {fileName ?? "Clique para enviar (RG, CNH ou passaporte)"}
            </p>
            <p className="text-xs text-muted-foreground">JPG, PNG ou PDF · até 5 MB</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => navigate({ to: "/feed" })}>
              Pular por enquanto
            </Button>
            <Button onClick={submit} disabled={!fileName}>
              Enviar e verificar
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}