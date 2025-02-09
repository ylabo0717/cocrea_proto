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
    color: "text-[#33DFF2]", // より鮮やかなシアン
  },
  {
    label: "要望・アイデア",
    icon: Lightbulb,
    href: "/requests",
    color: "text-[#20E9E3]", // ビビッドシアン
  },
  {
    label: "お困りごと",
    icon: MessageSquare,
    href: "/issues",
    color: "text-[#1EBBEA]", // ブライトブルー
  },
  {
    label: "知識共有",
    icon: BookOpen,
    href: "/knowledge",
    color: "text-[#0DCBDF]", // クリアブルー
  },
  {
    label: "ユーザー一覧",
    icon: Users,
    href: "/users",
    color: "text-[#39E5E5]", // アクアブルー
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { email, role } = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <div className={cn(
      "space-y-4 py-4 flex flex-col h-full transition-colors duration-200",
      theme === 'dark' 
        ? 'bg-[#1F2937] text-[#F8FAFD]' 
        : 'bg-gradient-to-br from-[#33DFF2] via-[#20E9E3] to-[#1EBBEA] text-white shadow-lg'
    )}>
      <div className="px-3 py-2 flex-1">
        <div className="flex items-center justify-between pl-3 mb-14">
          <Link href="/dashboard">
            <h1 className="text-2xl font-bold text-white drop-shadow transition-all duration-200 hover:scale-105">Cocrea</h1>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "w-8 h-8 transition-all duration-200",
                theme === 'dark' 
                  ? 'text-[#F8FAFD] hover:text-[#F8FAFD] hover:bg-[#151B26] hover:scale-110' 
                  : 'text-white hover:text-white hover:bg-white/20 backdrop-blur-sm hover:scale-110'
              )}
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
                  className={cn(
                    "w-full justify-start backdrop-blur-sm transition-all duration-200",
                    theme === 'dark' ? 'text-[#F8FAFD]' : 'text-white',
                    {
                      [theme === 'dark' 
                        ? 'bg-[#151B26] hover:bg-[#151B26]/80 hover:scale-[1.02]' 
                        : 'bg-white/20 hover:bg-white/30 shadow-sm hover:scale-[1.02]'
                      ]: pathname === route.href,
                      [theme === 'dark'
                        ? 'hover:bg-[#151B26]/50 hover:scale-[1.02]'
                        : 'hover:bg-white/10 hover:scale-[1.02]'
                      ]: pathname !== route.href
                    }
                  )}
                >
                  <route.icon className={cn(
                    "h-5 w-5 mr-3 transition-transform duration-200", 
                    theme === 'dark' ? route.color : 'text-white drop-shadow-sm',
                    pathname === route.href ? 'scale-110' : 'group-hover:scale-110'
                  )} />
                  {route.label}
                </Button>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
      {email && (
        <div className={cn(
          "px-6 py-3 border-t backdrop-blur-sm transition-colors duration-200",
          theme === 'dark' 
            ? 'border-[#151B26] text-[#F8FAFD]/90' 
            : 'border-white/20 text-white/90 shadow-sm'
        )}>
          <div className="flex items-center gap-2 text-sm">
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