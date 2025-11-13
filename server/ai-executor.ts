import * as db from "./db";

/**
 * تنفيذ الإجراءات المحاسبية من نتائج الذكاء الاصطناعي
 */
export async function executeAction(action: string, data: any, userId: number) {
  try {
    switch (action) {
      case "create_journal_entry":
        if (!data.lines || data.lines.length < 2) {
          return { success: false, message: "القيد يجب أن يحتوي على سطرين على الأقل" };
        }
        const entryData = {
          entryNumber: `JE-${Date.now()}`,
          branchId: data.branchId || 1,
          date: data.date || new Date(),
          description: data.description || "",
          status: "posted" as const,
          createdBy: userId,
        };
        
        const lines = data.lines.map((line: any) => {
          const lineType: "debit" | "credit" = line.debit > 0 ? "debit" : "credit";
          return {
            accountId: line.accountId,
            type: lineType,
            amount: Math.round((line.debit || line.credit || 0) * 100),
            currencyId: data.currencyId || 1,
            description: line.description || "",
          };
        });
        
        await db.createJournalEntry(entryData, lines);
        return { success: true, message: "تم إنشاء القيد بنجاح" };

      case "create_receipt_voucher":
        const receiptId = await db.createVoucher({
          voucherNumber: `RV-${Date.now()}`,
          type: "receipt",
          voucherType: "cash",
          branchId: data.branchId || 1,
          currencyId: data.currencyId || 1,
          toAccountId: data.accountId,
          amount: Math.round(data.amount * 100),
          date: data.date || new Date(),
          statement: data.description || "",
          status: "draft",
          createdBy: userId,
        });
        return { success: true, message: "تم إنشاء سند القبض بنجاح", voucherId: receiptId };

      case "create_payment_voucher":
        const paymentId = await db.createVoucher({
          voucherNumber: `PV-${Date.now()}`,
          type: "payment",
          voucherType: "cash",
          branchId: data.branchId || 1,
          currencyId: data.currencyId || 1,
          fromAccountId: data.accountId,
          amount: Math.round(data.amount * 100),
          date: data.date || new Date(),
          statement: data.description || "",
          status: "draft",
          createdBy: userId,
        });
        return { success: true, message: "تم إنشاء سند الصرف بنجاح", voucherId: paymentId };

      default:
        return { success: false, message: "إجراء غير مدعوم" };
    }
  } catch (error) {
    console.error("[AI Executor] Error:", error);
    return { success: false, message: "حدث خطأ أثناء تنفيذ الإجراء" };
  }
}
