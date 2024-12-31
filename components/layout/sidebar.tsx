"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutDashboard, MessageSquare, BookOpen, Users } from "lucide-react";
import { UserNav } from "./user-nav";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Issues",
    icon: MessageSquare,
    href: "/issues",
    color: "text-violet-500",
  },
  {
    label: "Knowledge",
    icon: BookOpen,
    href: "/knowledge",
    color: "text-pink-500",
  },
  {
    label: "Users",
    icon: Users,
    href: "/users",
    color: "text-orange-500",
  },
];

export function Sidebar() {
  const pathname = usePathname();

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
    </div>
  );
}