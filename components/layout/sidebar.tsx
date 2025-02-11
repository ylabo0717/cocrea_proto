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
    label: "マイページ",
    icon: User,
    href: "/mypage",
    color: "text-[#ACB0B9]",
  },
  {
    label: "アプリケーション",
    icon: LayoutDashboard,
    href: "/applications",
    color: "text-[#959AA3]",
  },
  {
    label: "アプリダッシュボード",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-[#959AA3]",
  },
  {
    label: "要望・アイデア",
    icon: Lightbulb,
    href: "/requests",
    color: "text-[#8B919C]",
  },
  {
    label: "お困りごと",
    icon: MessageSquare,
    href: "/issues",
    color: "text-[#696F7C]",
  },
  {
    label: "知識共有",
    icon: BookOpen,
    href: "/knowledge",
    color: "text-[#959AA3]",
  },
  {
    label: "ユーザー一覧",
    icon: Users,
    href: "/users",
    color: "text-[#7A8290]",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { email, role } = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <div className={cn(
      "space-y-4 py-4 flex flex-col h-full transition-all duration-300 relative",
      theme === 'dark' 
        ? 'bg-[#1A1E26] text-[#F5F6F8] shadow-[1px_0_3px_rgba(0,0,0,0.1)]' 
        : 'bg-gradient-to-br from-[#696F7C] from-5% via-[#666B78] via-40% to-[#5F646E] to-90% text-white shadow-[1px_0_5px_rgba(0,0,0,0.05)]'
    )}>
      <div className="px-3 py-2 flex-1">
        <div className="flex items-center justify-between pl-3 mb-14">
          <Link href="/dashboard">
            <h1 className="text-2xl font-bold text-white/95 drop-shadow-sm transition-all duration-300 hover:text-white hover:scale-[1.03]">Cocrea</h1>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "w-8 h-8 transition-all duration-300",
                theme === 'dark' 
                  ? 'text-[#F5F6F8]/90 hover:text-[#F5F6F8] hover:bg-[#13161D]/90 hover:scale-110' 
                  : 'text-white/90 hover:text-white hover:bg-white/5 backdrop-blur-sm hover:scale-110'
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
                    "w-full justify-start backdrop-blur-sm transition-all duration-300 group",
                    theme === 'dark' ? 'text-[#F5F6F8]/90' : 'text-white/90',
                    {
                      [theme === 'dark' 
                        ? 'bg-[#13161D]/90 hover:bg-[#13161D] hover:scale-[1.02] hover:text-[#F5F6F8]' 
                        : 'bg-black/5 hover:bg-black/10 shadow-sm hover:scale-[1.02] hover:text-white'
                      ]: pathname === route.href,
                      [theme === 'dark'
                        ? 'hover:bg-[#13161D]/60 hover:scale-[1.02] hover:text-[#F5F6F8]'
                        : 'hover:bg-black/5 hover:scale-[1.02] hover:text-white'
                      ]: pathname !== route.href
                    }
                  )}
                >
                  <route.icon className={cn(
                    "h-5 w-5 mr-3 transition-all duration-300", 
                    theme === 'dark' ? route.color : 'text-white/90 group-hover:text-white',
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
          "px-6 py-3 border-t backdrop-blur-sm transition-all duration-300",
          theme === 'dark' 
            ? 'border-[#13161D] text-[#F5F6F8]/85 hover:text-[#F5F6F8]' 
            : 'border-black/5 text-white/85 hover:text-white shadow-sm'
        )}>
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 opacity-80" />
            <div className="flex flex-col">
              <span className="opacity-90 transition-opacity duration-200 hover:opacity-100">{email}</span>
              <span className="text-xs capitalize opacity-75 transition-opacity duration-200 hover:opacity-85">({role})</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}