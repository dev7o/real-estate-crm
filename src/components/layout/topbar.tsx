"use client";

import { Search, Bell, Menu } from "lucide-react";
import { ThemeToggle } from "../theme-toggle";
import { motion } from "framer-motion";
import { useSidebar } from "./sidebar-context";

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { toggle } = useSidebar();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-30 flex items-center justify-between border-b border-navy-100/50 dark:border-navy-700/50 bg-white/70 dark:bg-navy-900/70 backdrop-blur-md px-4 md:px-8 py-4 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-navy-100 dark:border-navy-700 bg-white dark:bg-navy-800 text-ink-muted dark:text-navy-200 hover:bg-navy-50 dark:hover:bg-navy-700 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg md:text-xl font-bold text-ink dark:text-navy-50">{title}</h1>
          {subtitle && <p className="mt-0.5 text-xs md:text-sm text-ink-muted dark:text-navy-200 hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint dark:text-navy-300" />
          <input
            placeholder="بحث سريع..."
            className="h-10 w-64 rounded-xl border border-navy-100/50 dark:border-navy-700 bg-surface dark:bg-navy-800 pe-10 ps-4 text-sm placeholder:text-ink-faint dark:placeholder:text-navy-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-all"
          />
        </div>
        
        <ThemeToggle />

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-navy-100 dark:border-navy-700 text-ink-muted dark:text-navy-200 hover:bg-navy-50 dark:hover:bg-navy-800 transition-colors"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-danger ring-2 ring-white dark:ring-navy-900" />
        </motion.button>
        <div className="flex items-center gap-3 border-s border-navy-100 dark:border-navy-700 ps-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-gold-dark to-gold text-sm font-bold text-white shadow-md">
            سع
          </div>
          <div className="hidden text-sm leading-tight md:block">
            <p className="font-bold text-ink dark:text-navy-50">سارة العتيبي</p>
            <p className="text-xs text-ink-faint dark:text-navy-300">مدير مبيعات</p>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
