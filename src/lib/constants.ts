import type {
  DealStage,
  LeadSource,
  LeadStatus,
  LeadPurpose,
  UnitStatus,
  UnitType,
  ProjectStatus,
  VisitOutcome,
  ReservationStatus,
  InstallmentStatus,
  LossReason,
  Role,
} from "@prisma/client";

// ترتيب مراحل خط الأنابيب كما وردت في وثيقة المتطلبات
export const DEAL_STAGES: { value: DealStage; label: string; color: string }[] = [
  { value: "NEW_INQUIRY", label: "استفسار جديد", color: "#64748B" },
  { value: "CONTACTED", label: "تم التواصل", color: "#2E6F9E" },
  { value: "VISIT_SCHEDULED", label: "معاينة مجدولة", color: "#6552A6" },
  { value: "VISIT_COMPLETED", label: "معاينة تمت", color: "#7C5CC7" },
  { value: "NEGOTIATION", label: "تفاوض على السعر", color: "#B8802E" },
  { value: "RESERVED", label: "حجز مبدئي", color: "#2F7D6E" },
  { value: "CONTRACTED", label: "تعاقد نهائي", color: "#2F7D4F" },
  { value: "CLOSED_LOST", label: "مغلق خاسر", color: "#B0402E" },
];

export const dealStageLabel = (s: DealStage) =>
  DEAL_STAGES.find((d) => d.value === s)?.label ?? s;
export const dealStageColor = (s: DealStage) =>
  DEAL_STAGES.find((d) => d.value === s)?.color ?? "#64748B";

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  ADVERTISEMENT: "إعلان",
  REFERRAL: "إحالة",
  EXHIBITION: "معرض عقاري",
  WEBSITE: "موقع إلكتروني",
  INBOUND_CALL: "مكالمة واردة",
  OTHER: "أخرى",
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "جديد",
  CONTACTED: "تم التواصل",
  QUALIFIED: "مؤهل",
  UNQUALIFIED: "غير مؤهل",
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  NEW: "#2E6F9E",
  CONTACTED: "#6552A6",
  QUALIFIED: "#2F7D4F",
  UNQUALIFIED: "#8B93A0",
};

export const LEAD_PURPOSE_LABELS: Record<LeadPurpose, string> = {
  RESIDENTIAL: "سكن",
  INVESTMENT: "استثمار",
};

export const UNIT_TYPE_LABELS: Record<UnitType, string> = {
  APARTMENT: "شقة",
  VILLA: "فيلا",
  TOWNHOUSE: "تاون هاوس",
  LAND: "أرض",
  OFFICE: "مكتب",
  SHOP: "محل تجاري",
};

export const UNIT_STATUS_LABELS: Record<UnitStatus, string> = {
  AVAILABLE: "متاحة",
  RESERVED: "محجوزة مؤقتًا",
  SOLD: "مباعة",
};

export const UNIT_STATUS_COLORS: Record<UnitStatus, string> = {
  AVAILABLE: "#2F7D4F",
  RESERVED: "#B8802E",
  SOLD: "#8B93A0",
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  PLANNING: "تحت التخطيط",
  UNDER_CONSTRUCTION: "تحت الإنشاء",
  READY: "جاهز للتسليم",
  DELIVERED: "تم التسليم",
};

export const VISIT_OUTCOME_LABELS: Record<VisitOutcome, string> = {
  PENDING: "لم تتم بعد",
  INTERESTED: "مهتم",
  NOT_INTERESTED: "غير مهتم",
  NEEDS_DECISION: "يحتاج قرار",
  REQUESTED_ANOTHER: "يطلب معاينة أخرى",
};

export const VISIT_OUTCOME_COLORS: Record<VisitOutcome, string> = {
  PENDING: "#8B93A0",
  INTERESTED: "#2F7D4F",
  NOT_INTERESTED: "#B0402E",
  NEEDS_DECISION: "#B8802E",
  REQUESTED_ANOTHER: "#2E6F9E",
};

export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  ACTIVE: "ساري",
  CONVERTED: "تحول لعقد",
  EXPIRED: "منتهي الصلاحية",
  CANCELLED: "ملغى",
};

export const INSTALLMENT_STATUS_LABELS: Record<InstallmentStatus, string> = {
  PENDING: "مستحق",
  PAID: "مدفوع",
  OVERDUE: "متأخر",
};

export const INSTALLMENT_STATUS_COLORS: Record<InstallmentStatus, string> = {
  PENDING: "#2E6F9E",
  PAID: "#2F7D4F",
  OVERDUE: "#B0402E",
};

export const LOSS_REASON_LABELS: Record<LossReason, string> = {
  PRICE: "السعر",
  LOCATION: "الموقع",
  FINANCING: "التمويل",
  CUSTOMER_WITHDREW: "تراجع العميل",
  OTHER: "أخرى",
};

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "مدير عام",
  SALES_MANAGER: "مدير مبيعات",
  SALES_REP: "مندوب مبيعات",
  FINANCE: "مالي / تحصيل",
};
