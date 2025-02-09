"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutDashboard, MessageSquare, Lightbulb, BookOpen, Users, User, Sun, Moon } from "lucide-react";
import { UserNav } from "./user-nav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { useTheme } from "next-themes";

const routes = [
  {
    label: "アプリダッシュボード",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "要望・アイデア",
    icon: Lightbulb,
    href: "/requests",
    color: "text-yellow-500",
  },
  {
    label: "お困りごと",
    icon: MessageSquare,
    href: "/issues",
    color: "text-violet-500",
  },
  {
    label: "知識共有",
    icon: BookOpen,
    href: "/knowledge",
    color: "text-pink-500",
  },
  {
    label: "ユーザー一覧",
    icon: Users,
    href: "/users",
    color: "text-orange-500",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { email, role } = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <div className={cn(
      "space-y-4 py-4 flex flex-col h-full text-white",
      theme === 'dark' ? 'bg-gray-950' : 'bg-blue-500/80'
    )}>
      <div className="px-3 py-2 flex-1">
        <div className="flex items-center justify-between pl-3 mb-14">
          <Link href="/dashboard">
            <h1 className="text-2xl font-bold text-white">Cocrea</h1>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-white hover:text-white hover:bg-white/10"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <UserNav />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-1">
            {routes.map((route) => (
              <Link key={route.href} href={route.href}>
                <Button
                  variant={pathname === route.href ? "secondary" : "ghost"}
                  className={cn("w-full justify-start text-white", {
                    [theme === 'dark' ? 'bg-gray-900/80' : 'bg-blue-600/20']: pathname === route.href,
                    'hover:bg-white/10': true
                  })}
                >
                  <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                  {route.label}
                </Button>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
      {email && (
        <div className={cn(
          "px-6 py-3 border-t",
          theme === 'dark' ? 'border-gray-800' : 'border-white/10'
        )}>
          <div className="flex items-center gap-2 text-sm text-white/90">
            <User className="h-4 w-4" />
            <div className="flex flex-col">
              <span>{email}</span>
              <span className="text-xs capitalize">({role})</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}