// Note: Kojak has no private chat by design — interactions stay public in post comments.
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, ShieldCheck, User as UserIcon } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/context/SessionContext";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AppHeader() {
  const { user, logout } = useSession();
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between gap-3 px-4">
        <Link to="/feed" className="flex items-center">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          {!user.verified && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden text-primary hover:text-primary sm:inline-flex"
            >
              <Link to="/verificar">
                <ShieldCheck className="mr-1 h-4 w-4" /> Verificar identidade
              </Link>
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Abrir menu da conta"
                className="rounded-full ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarFallback className="bg-secondary text-foreground">
                    {initials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex items-center gap-2">
                {user.name}
                {user.verified && <ShieldCheck className="h-4 w-4 text-primary" />}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/perfil">
                  <UserIcon className="mr-2 h-4 w-4" /> Meu perfil
                </Link>
              </DropdownMenuItem>
              {!user.verified && (
                <DropdownMenuItem asChild>
                  <Link to="/verificar">
                    <ShieldCheck className="mr-2 h-4 w-4" /> Verificar identidade
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  logout();
                  navigate({ to: "/" });
                }}
              >
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}