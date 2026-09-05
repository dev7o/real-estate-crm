import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: string;
}

/** شارة حالة بلون مخصص — تُستخدم لعرض حالات الوحدات، العملاء، الأقساط... */
export function Badge({ className, color, style, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        className
      )}
      style={{
        backgroundColor: color ? `${color}1A` : undefined,
        color: color ?? undefined,
        ...style,
      }}
      {...props}
    >
      {color && <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />}
      {children}
    </span>
  );
}
