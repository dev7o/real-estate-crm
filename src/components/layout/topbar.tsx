import { Search, Bell } from "lucide-react";

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="flex items-center justify-between border-b border-navy-100 bg-surface-raised px-8 py-5">
      <div>
        <h1 className="text-xl font-semibold text-ink">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-ink-muted">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            placeholder="بحث سريع..."
            className="h-9 w-56 rounded-DEFAULT border border-navy-100 bg-surface pe-9 ps-3 text-sm placeholder:text-ink-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          />
        </div>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-DEFAULT border border-navy-100 text-ink-muted hover:bg-navy-50">
          <Bell className="h-4 w-4" />
          <span className="absolute -left-0.5 -top-0.5 h-2 w-2 rounded-full bg-danger" />
        </button>
        <div className="flex items-center gap-2.5 border-s border-navy-100 ps-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-800 text-xs font-semibold text-white">
            سع
          </div>
          <div className="hidden text-xs leading-tight md:block">
            <p className="font-medium text-ink">سارة العتيبي</p>
            <p className="text-ink-faint">مدير مبيعات</p>
          </div>
        </div>
      </div>
    </header>
  );
}
