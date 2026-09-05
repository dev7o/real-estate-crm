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
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";

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
  const { isOpen, setIsOpen } = useSidebar();

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex h-screen w-72 flex-col bg-navy-900/95 dark:bg-navy-950/95 backdrop-blur-xl text-white shadow-2xl border-l border-white/5 transition-transform duration-300 md:relative md:w-64 md:translate-x-0",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-gold-dark shadow-lg">
          <Building className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-base font-bold tracking-wide">عقاري</p>
          <p className="text-xs text-white/60">نظام إدارة المبيعات</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6 scrollbar-thin">
        {NAV_ITEMS.map((item, index) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
              <motion.div
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-200 overflow-hidden",
                  active ? "text-white" : "text-white/70 hover:text-white"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="active-sidebar-bg"
                    className="absolute inset-0 bg-white/10 backdrop-blur-sm"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                
                <span
                  className={cn(
                    "relative z-10 flex h-8 w-8 items-center justify-center rounded-lg shadow-sm transition-transform group-hover:scale-110",
                    !active && "bg-white/5 group-hover:bg-white/10"
                  )}
                  style={{ backgroundColor: active ? item.accent : undefined }}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </span>
                <span className="relative z-10 font-semibold">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link href="/settings">
          <motion.div
            whileHover={{ x: -4 }}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/70 transition-all hover:bg-white/10 hover:text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
              <Settings className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="font-semibold">الإعدادات</span>
          </motion.div>
        </Link>
      </div>
    </motion.aside>
    </>
  );
}
