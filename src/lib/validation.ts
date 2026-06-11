import { z } from "zod";

function ageFrom(dateStr: string): number {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return -1;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto").max(60, "Nome muito longo"),
  email: z.string().trim().toLowerCase().email("E-mail inválido").max(120),
  password: z.string().min(8, "Mínimo de 8 caracteres").max(72),
  birthDate: z
    .string()
    .nonempty("Informe sua data de nascimento")
    .refine((d) => ageFrom(d) >= 16, "É necessário ter 16 anos ou mais"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
  password: z.string().min(1, "Informe sua senha"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;