"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  KanbanSquare,
  CalendarCheck,
  FileSignature,
  Wallet,
  BarChart3,
  Settings,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "لوحة التحكم", icon: LayoutDashboard, accent: "#B8934A" },
  { href: "/leads", label: "العملاء المحتملون", icon: Users, accent: "#2E6F9E" },
  { href: "/projects", label: "المشاريع والوحدات", icon: Building2, accent: "#A85327" },
  { href: "/pipeline", label: "متابعة المبيعات", icon: KanbanSquare, accent: "#2F7D6E" },
  { href: "/site-visits", label: "المعاينات الميدانية", icon: CalendarCheck, accent: "#6552A6" },
  { href: "/reservations", label: "الحجوزات والعقود", icon: FileSignature, accent: "#7A3B69" },
  { href: "/payments", label: "التحصيل والدفعات", icon: Wallet, accent: "#8A6D1E" },
  { href: "/reports", label: "التقارير", icon: BarChart3, accent: "#334155" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col bg-navy-900 text-white">
      <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-DEFAULT bg-gold">
          <Building className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">عقاري</p>
          <p className="text-[11px] leading-tight text-white/50">نظام متابعة المبيعات</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4 scrollbar-thin">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-DEFAULT px-3 py-2.5 text-sm transition-colors",
                active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <span
                className="flex h-7 w-7 items-center justify-center rounded-sm"
                style={{ backgroundColor: active ? item.accent : "transparent" }}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-DEFAULT px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <span className="flex h-7 w-7 items-center justify-center">
            <Settings className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <span className="font-medium">الإعدادات</span>
        </Link>
      </div>
    </aside>
  );
}
