import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("🌱 جارٍ تعبئة قاعدة البيانات ببيانات تجريبية...");

  // تنظيف البيانات القديمة (بترتيب يحترم العلاقات)
  await db.installment.deleteMany();
  await db.paymentPlan.deleteMany();
  await db.contract.deleteMany();
  await db.reservation.deleteMany();
  await db.activity.deleteMany();
  await db.siteVisit.deleteMany();
  await db.deal.deleteMany();
  await db.lead.deleteMany();
  await db.unit.deleteMany();
  await db.project.deleteMany();
  await db.user.deleteMany();

  // -------------------- المستخدمون --------------------
  const admin = await db.user.create({
    data: { name: "سارة العتيبي", email: "sara@aqari.sa", role: "ADMIN" },
  });
  const manager = await db.user.create({
    data: { name: "فهد القحطاني", email: "fahad@aqari.sa", role: "SALES_MANAGER" },
  });
  const rep1 = await db.user.create({
    data: { name: "نورة السبيعي", email: "noura@aqari.sa", role: "SALES_REP" },
  });
  const rep2 = await db.user.create({
    data: { name: "عبدالله الزهراني", email: "abdullah@aqari.sa", role: "SALES_REP" },
  });
  const finance = await db.user.create({
    data: { name: "منيرة الدوسري", email: "muneera@aqari.sa", role: "FINANCE" },
  });

  // -------------------- المشاريع والوحدات --------------------
  const waha = await db.project.create({
    data: {
      name: "أبراج الواحة",
      developer: "شركة الإعمار العقارية",
      city: "الرياض",
      district: "حي الملقا",
      description: "مشروع سكني راقٍ يضم شققًا وتاون هاوس بتصميم عصري وإطلالات مفتوحة.",
      status: "UNDER_CONSTRUCTION",
      deliveryDate: new Date("2027-06-01"),
    },
  });

  const marsa = await db.project.create({
    data: {
      name: "مرسى الشاطئ",
      developer: "مجموعة الساحل للتطوير",
      city: "جدة",
      district: "حي الشاطئ",
      description: "فلل وشقق فاخرة على الواجهة البحرية مباشرة.",
      status: "READY",
      deliveryDate: new Date("2026-11-01"),
    },
  });

  const nakheel = await db.project.create({
    data: {
      name: "نخيل السلام",
      developer: "شركة السلام العقارية",
      city: "الدمام",
      district: "حي الفيصلية",
      description: "أراضٍ سكنية واستثمارية مخططة ضمن مخطط معتمد.",
      status: "PLANNING",
    },
  });

  const wahaUnits = await Promise.all([
    db.unit.create({ data: { code: "A-101", projectId: waha.id, type: "APARTMENT", floor: 1, areaSqm: 145, bedrooms: 3, price: 780000 } }),
    db.unit.create({ data: { code: "A-102", projectId: waha.id, type: "APARTMENT", floor: 1, areaSqm: 160, bedrooms: 3, price: 850000, status: "RESERVED" } }),
    db.unit.create({ data: { code: "A-203", projectId: waha.id, type: "APARTMENT", floor: 2, areaSqm: 190, bedrooms: 4, price: 990000, status: "SOLD" } }),
    db.unit.create({ data: { code: "TH-01", projectId: waha.id, type: "TOWNHOUSE", floor: 0, areaSqm: 280, bedrooms: 5, price: 1650000 } }),
    db.unit.create({ data: { code: "TH-02", projectId: waha.id, type: "TOWNHOUSE", floor: 0, areaSqm: 280, bedrooms: 5, price: 1680000 } }),
  ]);

  const marsaUnits = await Promise.all([
    db.unit.create({ data: { code: "V-01", projectId: marsa.id, type: "VILLA", areaSqm: 420, bedrooms: 6, price: 3200000 } }),
    db.unit.create({ data: { code: "V-02", projectId: marsa.id, type: "VILLA", areaSqm: 400, bedrooms: 5, price: 2950000, status: "SOLD" } }),
    db.unit.create({ data: { code: "B-301", projectId: marsa.id, type: "APARTMENT", floor: 3, areaSqm: 210, bedrooms: 3, price: 1450000 } }),
  ]);

  const nakheelUnits = await Promise.all([
    db.unit.create({ data: { code: "L-14", projectId: nakheel.id, type: "LAND", areaSqm: 500, price: 620000 } }),
    db.unit.create({ data: { code: "L-15", projectId: nakheel.id, type: "LAND", areaSqm: 550, price: 680000 } }),
  ]);

  // -------------------- العملاء المحتملون --------------------
  const lead1 = await db.lead.create({
    data: {
      name: "خالد الحربي", phone: "0501234567", email: "khalid@example.com",
      source: "WEBSITE", status: "QUALIFIED", purpose: "RESIDENTIAL",
      budgetMin: 700000, budgetMax: 900000, preferredCity: "الرياض", preferredRooms: 3,
      assignedToId: rep1.id,
    },
  });
  const lead2 = await db.lead.create({
    data: {
      name: "منى العنزي", phone: "0559876543", email: "mona@example.com",
      source: "EXHIBITION", status: "CONTACTED", purpose: "INVESTMENT",
      budgetMin: 1500000, budgetMax: 2000000, preferredCity: "جدة",
      assignedToId: rep2.id,
    },
  });
  const lead3 = await db.lead.create({
    data: {
      name: "تركي الشمري", phone: "0533456789",
      source: "REFERRAL", status: "NEW", purpose: "RESIDENTIAL",
      preferredCity: "الرياض", preferredRooms: 5, assignedToId: rep1.id,
    },
  });
  const lead4 = await db.lead.create({
    data: {
      name: "لمى الغامدي", phone: "0567891234", email: "lama@example.com",
      source: "ADVERTISEMENT", status: "QUALIFIED", purpose: "INVESTMENT",
      budgetMin: 500000, budgetMax: 700000, preferredCity: "الدمام", assignedToId: rep2.id,
    },
  });
  const lead5 = await db.lead.create({
    data: {
      name: "سلطان المطيري", phone: "0512345678",
      source: "INBOUND_CALL", status: "UNQUALIFIED", purpose: "RESIDENTIAL",
      preferredCity: "الرياض", notes: "الميزانية غير كافية لأي وحدة متاحة حاليًا",
    },
  });

  await db.activity.createMany({
    data: [
      { leadId: lead1.id, type: "NOTE", content: "تم إنشاء العميل المحتمل" },
      { leadId: lead1.id, type: "CALL", content: "مكالمة أولى — العميل مهتم بشقة 3 غرف بحي الملقا", userId: rep1.id },
      { leadId: lead2.id, type: "NOTE", content: "تم إنشاء العميل المحتمل" },
      { leadId: lead2.id, type: "STATUS_CHANGE", content: "تم تغيير حالة العميل" },
    ],
  });

  // -------------------- الصفقات (Pipeline) --------------------
  const deal1 = await db.deal.create({
    data: {
      title: "اهتمام بشقة 3 غرف — أبراج الواحة", leadId: lead1.id, unitId: wahaUnits[0].id,
      ownerId: rep1.id, stage: "NEGOTIATION", value: 780000,
    },
  });
  const deal2 = await db.deal.create({
    data: {
      title: "فيلا استثمارية — مرسى الشاطئ", leadId: lead2.id, unitId: marsaUnits[0].id,
      ownerId: rep2.id, stage: "VISIT_SCHEDULED", value: 3200000,
    },
  });
  const deal3 = await db.deal.create({
    data: {
      title: "تاون هاوس عائلي — أبراج الواحة", leadId: lead3.id, unitId: wahaUnits[3].id,
      ownerId: rep1.id, stage: "NEW_INQUIRY", value: 1650000,
    },
  });
  const deal4 = await db.deal.create({
    data: {
      title: "أرض استثمارية — نخيل السلام", leadId: lead4.id, unitId: nakheelUnits[0].id,
      ownerId: rep2.id, stage: "CONTACTED", value: 620000,
    },
  });
  await db.deal.create({
    data: {
      title: "استفسار عن شقة — مرسى الشاطئ", leadId: lead5.id,
      stage: "CLOSED_LOST", lossReason: "FINANCING", value: 1450000, ownerId: rep2.id,
    },
  });
  // صفقة محجوزة بالفعل (وحدة A-102 محجوزة)
  const dealReserved = await db.deal.create({
    data: {
      title: "شقة فاخرة محجوزة — أبراج الواحة", leadId: lead1.id, unitId: wahaUnits[1].id,
      ownerId: rep1.id, stage: "RESERVED", value: 850000,
    },
  });
  // صفقة متعاقد عليها (وحدة A-203 مباعة)
  const dealContracted = await db.deal.create({
    data: {
      title: "شقة بانوراما — أبراج الواحة", leadId: lead2.id, unitId: wahaUnits[2].id,
      ownerId: rep1.id, stage: "CONTRACTED", value: 990000,
    },
  });
  // صفقة فيلا مباعة في مرسى الشاطئ
  const dealVilla = await db.deal.create({
    data: {
      title: "فيلا بحرية — مرسى الشاطئ", leadId: lead4.id, unitId: marsaUnits[1].id,
      ownerId: rep2.id, stage: "CONTRACTED", value: 2950000,
    },
  });

  await db.activity.createMany({
    data: [
      { dealId: deal1.id, leadId: lead1.id, type: "STAGE_CHANGE", content: "انتقلت الصفقة إلى مرحلة: تفاوض على السعر" },
      { dealId: deal2.id, leadId: lead2.id, type: "STAGE_CHANGE", content: "انتقلت الصفقة إلى مرحلة: معاينة مجدولة" },
    ],
  });

  // -------------------- المعاينات الميدانية --------------------
  const inTwoDays = new Date(); inTwoDays.setDate(inTwoDays.getDate() + 2);
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const nextWeek = new Date(); nextWeek.setDate(nextWeek.getDate() + 7);

  await db.siteVisit.createMany({
    data: [
      { leadId: lead2.id, unitId: marsaUnits[0].id, repId: rep2.id, scheduledAt: inTwoDays, outcome: "PENDING" },
      { leadId: lead1.id, unitId: wahaUnits[0].id, repId: rep1.id, scheduledAt: yesterday, outcome: "INTERESTED", notes: "أبدى إعجابًا بالتشطيبات وطلب عرض سعر مفصّل" },
      { leadId: lead3.id, unitId: wahaUnits[3].id, repId: rep1.id, scheduledAt: nextWeek, outcome: "PENDING" },
      { leadId: lead4.id, unitId: nakheelUnits[0].id, repId: rep2.id, scheduledAt: yesterday, outcome: "NEEDS_DECISION" },
    ],
  });

  // -------------------- الحجوزات --------------------
  const expiresSoon = new Date(); expiresSoon.setDate(expiresSoon.getDate() + 3);
  const reservation1 = await db.reservation.create({
    data: {
      dealId: dealReserved.id, unitId: wahaUnits[1].id, repId: rep1.id,
      downPayment: 50000, expiresAt: expiresSoon,
    },
  });

  // -------------------- العقود وخطط السداد --------------------
  const contract1 = await db.contract.create({
    data: {
      reservationId: (await db.reservation.create({
        data: {
          dealId: dealContracted.id, unitId: wahaUnits[2].id, repId: rep1.id,
          downPayment: 100000, expiresAt: new Date("2026-08-01"), status: "CONVERTED",
        },
      })).id,
      contractNumber: "CT-2026-001",
      totalValue: 990000,
    },
  });

  const contract2 = await db.contract.create({
    data: {
      reservationId: (await db.reservation.create({
        data: {
          dealId: dealVilla.id, unitId: marsaUnits[1].id, repId: rep2.id,
          downPayment: 300000, expiresAt: new Date("2026-07-01"), status: "CONVERTED",
        },
      })).id,
      contractNumber: "CT-2026-002",
      totalValue: 2950000,
    },
  });

  const plan1 = await db.paymentPlan.create({ data: { contractId: contract1.id } });
  const past1 = new Date(); past1.setMonth(past1.getMonth() - 1);
  const past2 = new Date(); past2.setDate(past2.getDate() - 5);
  const future1 = new Date(); future1.setMonth(future1.getMonth() + 2);
  const future2 = new Date(); future2.setMonth(future2.getMonth() + 5);

  await db.installment.createMany({
    data: [
      { paymentPlanId: plan1.id, label: "الدفعة الأولى", amount: 200000, dueDate: past1, status: "PAID", paidAt: past1 },
      { paymentPlanId: plan1.id, label: "القسط 1", amount: 200000, dueDate: past2, status: "OVERDUE" },
      { paymentPlanId: plan1.id, label: "القسط 2", amount: 200000, dueDate: future1, status: "PENDING" },
      { paymentPlanId: plan1.id, label: "دفعة التسليم", amount: 390000, dueDate: future2, status: "PENDING" },
    ],
  });

  const plan2 = await db.paymentPlan.create({ data: { contractId: contract2.id } });
  await db.installment.createMany({
    data: [
      { paymentPlanId: plan2.id, label: "الدفعة الأولى", amount: 590000, dueDate: past1, status: "PAID", paidAt: past1 },
      { paymentPlanId: plan2.id, label: "القسط 1", amount: 590000, dueDate: future1, status: "PENDING" },
      { paymentPlanId: plan2.id, label: "القسط 2", amount: 590000, dueDate: future2, status: "PENDING" },
    ],
  });

  console.log("✅ تمت تعبئة قاعدة البيانات بنجاح");
  console.log(`   ${5} مستخدمين، ${3} مشاريع، ${wahaUnits.length + marsaUnits.length + nakheelUnits.length} وحدات`);
  console.log(`   ${5} عملاء محتملين، ${7} صفقات، ${2} عقود موقّعة`);
  process.exit(0);
}

main()
  .catch((e) => {
    console.error("❌ حدث خطأ أثناء تعبئة البيانات:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
