"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutDashboard, MessageSquare, Lightbulb, BookOpen, Users, User } from "lucide-react";
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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-gray-900 text-white">
      <div className="px-3 py-2 flex-1">
        <div className="flex items-center justify-between pl-3 mb-14">
          <Link href="/dashboard">
            <h1 className="text-2xl font-bold text-white">Cocrea</h1>
          </Link>
          <UserNav />
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-1">
            {routes.map((route) => (
              <Link key={route.href} href={route.href}>
                <Button
                  variant={pathname === route.href ? "secondary" : "ghost"}
                  className={cn("w-full justify-start text-white", {
                    "bg-gray-800/50": pathname === route.href,
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
      <div className="px-6 py-3 border-t border-gray-800">
        <Button variant="themeToggle" onClick={toggleTheme}>
          {theme === "dark" ? "ライトモード" : "ダークモード"}
        </Button>
      </div>
      {email && (
        <div className="px-6 py-3 border-t border-gray-800">
          <div className="flex items-center gap-2 text-sm text-gray-400">
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
