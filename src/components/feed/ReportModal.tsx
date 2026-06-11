import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const REASONS = [
  { id: "abuse", label: "Abuso ou assédio" },
  { id: "hate", label: "Discurso de ódio" },
  { id: "offense", label: "Ofensas ou linguagem imprópria" },
  { id: "sensitive", label: "Conteúdo sensível sem aviso" },
  { id: "other", label: "Outro" },
];

export function ReportModal({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const [reason, setReason] = useState(REASONS[0].id);
  const [details, setDetails] = useState("");

  function submit() {
    onConfirm();
    toast.success("Denúncia recebida. Nossa equipe vai revisar.");
    onOpenChange(false);
    setReason(REASONS[0].id);
    setDetails("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Denunciar publicação</DialogTitle>
          <DialogDescription>
            Conte o que aconteceu. Denúncias são anônimas e revisadas pela equipe Kojak.
          </DialogDescription>
        </DialogHeader>
        <RadioGroup value={reason} onValueChange={setReason} className="space-y-2">
          {REASONS.map((r) => (
            <div key={r.id} className="flex items-center gap-2">
              <RadioGroupItem id={`r-${r.id}`} value={r.id} />
              <Label htmlFor={`r-${r.id}`} className="font-normal">
                {r.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
        <div className="space-y-2">
          <Label htmlFor="report-details">Detalhes (opcional)</Label>
          <Textarea
            id="report-details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={3}
            placeholder="Descreva o motivo da denúncia"
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={submit}>
            Enviar denúncia
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}