import type { Config } from "tailwindcss";

// ============================================================================
// نظام التصميم — لكل قسم في المنصة هوية لونية مستقلة مبنية على طبيعة عمله،
// ضمن مظلة بصرية عقارية احترافية موحّدة (كحلي + محايد دافئ).
// ============================================================================

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-cairo)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      colors: {
        // الهوية الأساسية
        navy: {
          50: "#EEF1F5",
          100: "#D3DBE6",
          200: "#B0BDD0",
          300: "#8A9DB8",
          400: "#3A4D68",
          500: "#2E4060",
          600: "#1C2C42",
          700: "#162234",
          800: "#121D2E",
          900: "#0B1420",
          950: "#060D17",
        },
        surface: {
          DEFAULT: "#FAF9F6",
          raised: "#FFFFFF",
          sunken: "#F1EFEA",
        },
        gold: {
          DEFAULT: "#B8934A",
          light: "#D6B876",
          dark: "#8F7038",
        },
        ink: {
          DEFAULT: "#1C2430",
          muted: "#5B6472",
          faint: "#8B93A0",
        },
        // ألوان الأقسام — module accents
        module: {
          leads: "#2E6F9E", // العملاء — أزرق فولاذي
          "leads-bg": "#EAF2F8",
          projects: "#A85327", // المشاريع والوحدات — طوبي/طيني
          "projects-bg": "#F8EEE7",
          pipeline: "#2F7D6E", // متابعة المبيعات — أخضر زمردي
          "pipeline-bg": "#E9F5F1",
          visits: "#6552A6", // المعاينات — بنفسجي
          "visits-bg": "#F0EDF9",
          reservations: "#7A3B69", // الحجوزات والعقود — عنابي
          "reservations-bg": "#F7ECF4",
          payments: "#8A6D1E", // التحصيل — ذهبي غامق
          "payments-bg": "#F8F2E2",
          reports: "#334155", // التقارير — رمادي داكن
          "reports-bg": "#EEF1F4",
        },
        success: "#2F7D4F",
        warning: "#B8802E",
        danger: "#B0402E",
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        lg: "14px",
        xl: "20px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,20,32,0.04), 0 4px 16px rgba(11,20,32,0.06)",
        raised: "0 2px 4px rgba(11,20,32,0.06), 0 8px 24px rgba(11,20,32,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
