import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSession } from "@/context/SessionContext";
import { registerSchema } from "@/lib/validation";
import { toast } from "sonner";

export function RegisterForm() {
  const { register } = useSession();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", birthDate: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onChange<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        const k = i.path[0]?.toString();
        if (k) fieldErrors[k] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    const res = register(parsed.data);
    if (!res.ok) {
      setErrors({ email: res.error });
      return;
    }
    toast.success("Conta criada! Bem-vindo ao Kojak.");
    navigate({ to: "/feed" });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="reg-name">Nome</Label>
        <Input id="reg-name" value={form.name} onChange={(e) => onChange("name", e.target.value)} />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-email">E-mail</Label>
        <Input
          id="reg-email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-password">Senha</Label>
        <Input
          id="reg-password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => onChange("password", e.target.value)}
        />
        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-birth">Data de nascimento</Label>
        <Input
          id="reg-birth"
          type="date"
          value={form.birthDate}
          onChange={(e) => onChange("birthDate", e.target.value)}
        />
        <p className="text-xs text-muted-foreground">É necessário ter 16 anos ou mais.</p>
        {errors.birthDate && <p className="text-sm text-destructive">{errors.birthDate}</p>}
      </div>
      <Button type="submit" className="w-full">
        Criar conta
      </Button>
    </form>
  );
}