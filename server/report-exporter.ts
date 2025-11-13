import * as XLSX from "xlsx";

/**
 * تصدير ميزان المراجعة إلى Excel
 */
export function exportTrialBalanceToExcel(data: any[]) {
  const worksheet = XLSX.utils.json_to_sheet(
    data.map((item) => ({
      "اسم الحساب": item.accountName,
      "مدين": item.debit,
      "دائن": item.credit,
      "الرصيد": item.balance,
    }))
  );
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "ميزان المراجعة");
  
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}

/**
 * تصدير قائمة الدخل إلى Excel
 */
export function exportIncomeStatementToExcel(data: any) {
  const worksheet = XLSX.utils.json_to_sheet([
    { "البند": "الإيرادات", "المبلغ": data.revenue },
    { "البند": "المصروفات", "المبلغ": data.expenses },
    { "البند": "صافي الربح", "المبلغ": data.netIncome },
  ]);
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "قائمة الدخل");
  
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}

/**
 * تصدير قائمة المركز المالي إلى Excel
 */
export function exportBalanceSheetToExcel(data: any) {
  const worksheet = XLSX.utils.json_to_sheet([
    { "البند": "الأصول", "المبلغ": data.assets },
    { "البند": "الخصوم", "المبلغ": data.liabilities },
    { "البند": "حقوق الملكية", "المبلغ": data.equity },
  ]);
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "قائمة المركز المالي");
  
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}

/**
 * تصدير كشف الحساب إلى Excel
 */
export function exportAccountStatementToExcel(data: any[]) {
  const worksheet = XLSX.utils.json_to_sheet(
    data.map((item) => ({
      "التاريخ": item.date,
      "البيان": item.description,
      "مدين": item.debit,
      "دائن": item.credit,
      "الرصيد": item.balance,
    }))
  );
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "كشف الحساب");
  
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}
