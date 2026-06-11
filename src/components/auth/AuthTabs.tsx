import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function AuthTabs({ defaultTab = "login" }: { defaultTab?: "login" | "register" }) {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid h-10 w-full grid-cols-2 bg-secondary/60">
        <TabsTrigger value="login">Entrar</TabsTrigger>
        <TabsTrigger value="register">Criar conta</TabsTrigger>
      </TabsList>
      <TabsContent value="login" className="mt-6">
        <LoginForm />
      </TabsContent>
      <TabsContent value="register" className="mt-6">
        <RegisterForm />
      </TabsContent>
    </Tabs>
  );
}