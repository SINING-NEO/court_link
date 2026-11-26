"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Search,
  CalendarDays,
  MapPinned,
  MessageCircle,
  UserRound,
  LogOut,
  Menu,
} from "lucide-react";
import { BrandMark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCourtlink } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const nav = [
  { href: "/app", label: "Feed", icon: Home },
  { href: "/app/discover", label: "Discover", icon: Search },
  { href: "/app/sessions", label: "Sessions", icon: CalendarDays },
  { href: "/app/courts", label: "Courts", icon: MapPinned },
  { href: "/app/messages", label: "Messages", icon: MessageCircle },
  { href: "/app/profile", label: "Profile", icon: UserRound },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, ready } = useCourtlink();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (ready && !currentUser) {
      router.replace("/login");
    }
  }, [ready, currentUser, router]);

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const active =
          item.href === "/app"
            ? pathname === "/app"
            : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-court-deep text-ball"
                : "text-foreground/80 hover:bg-secondary"
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-6xl gap-6 px-4 py-4 md:px-6 md:py-6">
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-56 shrink-0 flex-col justify-between md:flex">
          <div className="space-y-8">
            <BrandMark />
            <NavLinks />
          </div>
          <div className="space-y-3 rounded-2xl border border-border/80 bg-card/80 p-4 backdrop-blur">
            <p className="font-display text-sm font-semibold">
              {currentUser?.name ?? "…"}
            </p>
            <p className="text-xs text-muted-foreground">
              @{currentUser?.username}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={() => {
                logout();
                router.push("/");
              }}
            >
              <LogOut className="size-3.5" />
              Sign out
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="mb-4 flex items-center justify-between md:hidden">
            <BrandMark />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                render={<Button variant="outline" size="icon" />}
              >
                <Menu className="size-4" />
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-4">
                <div className="mb-6 mt-2">
                  <BrandMark />
                </div>
                <NavLinks onNavigate={() => setOpen(false)} />
                <Button
                  variant="outline"
                  className="mt-6 w-full gap-2"
                  onClick={() => {
                    logout();
                    setOpen(false);
                    router.push("/");
                  }}
                >
                  <LogOut className="size-3.5" />
                  Sign out
                </Button>
              </SheetContent>
            </Sheet>
          </header>

          <main className="flex-1 pb-24 md:pb-8">{children}</main>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-card/95 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1 px-2 py-2">
          {nav.slice(0, 5).map((item) => {
            const active =
              item.href === "/app"
                ? pathname === "/app"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-[10px] font-medium",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
