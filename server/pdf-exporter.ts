import { jsPDF } from "jspdf";
import "jspdf-autotable";

/**
 * تصدير ميزان المراجعة إلى PDF
 */
export async function exportTrialBalanceToPDF(data: any[]) {
  const doc = new jsPDF();
  
  // إضافة خط عربي (يجب تضمينه في المشروع)
  doc.setFont("helvetica");
  doc.setFontSize(16);
  doc.text("Trial Balance Report", 105, 15, { align: "center" });
  
  const tableData = data.map((item) => [
    item.accountName,
    item.debit.toFixed(2),
    item.credit.toFixed(2),
    item.balance.toFixed(2),
  ]);
  
  (doc as any).autoTable({
    head: [["Account", "Debit", "Credit", "Balance"]],
    body: tableData,
    startY: 25,
  });
  
  return doc.output("arraybuffer");
}

/**
 * تصدير قائمة الدخل إلى PDF
 */
export async function exportIncomeStatementToPDF(data: any) {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text("Income Statement", 105, 15, { align: "center" });
  
  const tableData = [
    ["Revenue", data.revenue.toFixed(2)],
    ["Expenses", data.expenses.toFixed(2)],
    ["Net Income", data.netIncome.toFixed(2)],
  ];
  
  (doc as any).autoTable({
    body: tableData,
    startY: 25,
  });
  
  return doc.output("arraybuffer");
}

/**
 * تصدير قائمة المركز المالي إلى PDF
 */
export async function exportBalanceSheetToPDF(data: any) {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text("Balance Sheet", 105, 15, { align: "center" });
  
  const tableData = [
    ["Assets", data.assets.toFixed(2)],
    ["Liabilities", data.liabilities.toFixed(2)],
    ["Equity", data.equity.toFixed(2)],
  ];
  
  (doc as any).autoTable({
    body: tableData,
    startY: 25,
  });
  
  return doc.output("arraybuffer");
}
