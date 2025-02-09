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
    color: "text-[#7A95B8]", // メインブルー
  },
  {
    label: "要望・アイデア",
    icon: Lightbulb,
    href: "/requests",
    color: "text-[#A5C9DD]", // ライトブルー
  },
  {
    label: "お困りごと",
    icon: MessageSquare,
    href: "/issues",
    color: "text-[#6889A8]", // ミッドブルー
  },
  {
    label: "知識共有",
    icon: BookOpen,
    href: "/knowledge",
    color: "text-[#9FB7D4]", // ソフトブルー
  },
  {
    label: "ユーザー一覧",
    icon: Users,
    href: "/users",
    color: "text-[#95A8C7]", // グレイッシュブルー
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { email, role } = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <div className={cn(
      "space-y-4 py-4 flex flex-col h-full",
      theme === 'dark' ? 'bg-[#2D394D] text-[#E5EBF3]' : 'bg-[#9FB7D4] text-[#353B48]'
    )}>
      <div className="px-3 py-2 flex-1">
        <div className="flex items-center justify-between pl-3 mb-14">
          <Link href="/dashboard">
            <h1 className={cn("text-2xl font-bold",
              theme === 'dark' ? 'text-[#E5EBF3]' : 'text-[#353B48]'
            )}>Cocrea</h1>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "w-8 h-8",
                theme === 'dark' 
                  ? 'text-[#E5EBF3] hover:text-[#E5EBF3] hover:bg-[#202A3C]' 
                  : 'text-[#353B48] hover:text-[#353B48] hover:bg-[#B8CFDF]'
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
                    "w-full justify-start",
                    theme === 'dark' ? 'text-[#E5EBF3]' : 'text-[#353B48]',
                    {
                      [theme === 'dark' 
                        ? 'bg-[#202A3C] hover:bg-[#202A3C]/80' 
                        : 'bg-[#B8CFDF] hover:bg-[#B8CFDF]/80'
                      ]: pathname === route.href,
                      [theme === 'dark'
                        ? 'hover:bg-[#202A3C]/50'
                        : 'hover:bg-[#B8CFDF]/50'
                      ]: pathname !== route.href
                    }
                  )}
                >
                  <route.icon className={cn("h-5 w-5 mr-3", 
                    theme === 'dark' ? 'text-[#7A95B8]' : 'text-[#353B48]'
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
          "px-6 py-3 border-t",
          theme === 'dark' 
            ? 'border-[#202A3C] text-[#E5EBF3]/90' 
            : 'border-[#B8CFDF] text-[#353B48]/90'
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