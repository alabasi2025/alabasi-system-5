import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, Download, Printer, Calendar } from "lucide-react";

export default function TrialBalance() {
  // بيانات وهمية للعرض
  const accounts = [
    { code: "1000", name: "النقدية", debit: 50000, credit: 0 },
    { code: "1100", name: "البنك", debit: 120000, credit: 0 },
    { code: "2000", name: "الموردون", debit: 0, credit: 35000 },
    { code: "3000", name: "رأس المال", debit: 0, credit: 200000 },
    { code: "4000", name: "المبيعات", debit: 0, credit: 150000 },
    { code: "5000", name: "المشتريات", debit: 100000, credit: 0 },
    { code: "6000", name: "الرواتب", debit: 80000, credit: 0 },
    { code: "7000", name: "الإيجار", debit: 35000, credit: 0 },
  ];

  const totalDebit = accounts.reduce((sum, acc) => sum + acc.debit, 0);
  const totalCredit = accounts.reduce((sum, acc) => sum + acc.credit, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            ميزان المراجعة
          </h1>
          <p className="text-muted-foreground mt-1">عرض أرصدة جميع الحسابات</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 ml-2" />
            طباعة
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 ml-2" />
            تصدير Excel
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>الفترة الزمنية</CardTitle>
          <CardDescription>اختر الفترة المراد عرض ميزان المراجعة لها</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="from-date">من تاريخ</Label>
              <Input
                id="from-date"
                type="date"
                defaultValue="2025-01-01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to-date">إلى تاريخ</Label>
              <Input
                id="to-date"
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <Calendar className="h-4 w-4 ml-2" />
                عرض التقرير
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ميزان المراجعة</CardTitle>
          <CardDescription>كشف بأرصدة جميع الحسابات</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-right font-semibold">رقم الحساب</th>
                  <th className="p-3 text-right font-semibold">اسم الحساب</th>
                  <th className="p-3 text-center font-semibold">مدين</th>
                  <th className="p-3 text-center font-semibold">دائن</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-3 text-right">{account.code}</td>
                    <td className="p-3 text-right font-medium">{account.name}</td>
                    <td className="p-3 text-center">
                      {account.debit > 0 ? account.debit.toLocaleString() : "-"}
                    </td>
                    <td className="p-3 text-center">
                      {account.credit > 0 ? account.credit.toLocaleString() : "-"}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-primary bg-primary/5 font-bold">
                  <td className="p-3 text-right" colSpan={2}>الإجمالي</td>
                  <td className="p-3 text-center text-blue-600">
                    {totalDebit.toLocaleString()} ر.س
                  </td>
                  <td className="p-3 text-center text-green-600">
                    {totalCredit.toLocaleString()} ر.س
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {totalDebit === totalCredit ? (
            <div className="mt-4 p-4 bg-green-50 text-green-800 rounded-lg">
              <p className="font-semibold">✓ الميزان متوازن</p>
              <p className="text-sm mt-1">إجمالي المدين يساوي إجمالي الدائن</p>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-red-50 text-red-800 rounded-lg">
              <p className="font-semibold">✗ الميزان غير متوازن</p>
              <p className="text-sm mt-1">
                الفرق: {Math.abs(totalDebit - totalCredit).toLocaleString()} ر.س
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
