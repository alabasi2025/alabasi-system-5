import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { FileDown, Printer, Calendar } from "lucide-react";
import { useState } from "react";
import { useParams } from "wouter";

export default function TrialBalance() {
  const { id } = useParams<{ id: string }>();
  const organizationId = parseInt(id || "0");
  const { user } = useAuth();

  // تاريخ ميزان المراجعة
  const [fromDate, setFromDate] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);

  // جلب ميزان المراجعة من API
  const { data: trialBalanceData, isLoading, refetch } = trpc.reports.trialBalance.useQuery(
    {
      organizationId,
      fromDate,
      toDate,
    },
    {
      enabled: organizationId > 0,
    }
  );

  const balances = trialBalanceData?.accounts.map((account: any) => ({
    id: account.accountId,
    code: account.accountCode,
    name: account.accountName,
    openingDebit: 0, // TODO: إضافة الرصيد الافتتاحي في API
    openingCredit: 0,
    periodDebit: Number(account.totalDebit),
    periodCredit: Number(account.totalCredit),
    closingDebit: Number(account.balance) > 0 ? Number(account.balance) : 0,
    closingCredit: Number(account.balance) < 0 ? Math.abs(Number(account.balance)) : 0,
  })) || [];

  // حساب المجاميع من API
  const totals = trialBalanceData
    ? {
        openingDebit: 0,
        openingCredit: 0,
        periodDebit: Number(trialBalanceData.totals.totalDebit),
        periodCredit: Number(trialBalanceData.totals.totalCredit),
        closingDebit: Number(trialBalanceData.totals.totalDebit),
        closingCredit: Number(trialBalanceData.totals.totalCredit),
      }
    : { openingDebit: 0, openingCredit: 0, periodDebit: 0, periodCredit: 0, closingDebit: 0, closingCredit: 0 };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // TODO: تصدير إلى Excel
    console.log("Export to Excel");
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              ميزان المراجعة
            </h1>
            <p className="text-muted-foreground mt-1">
              عرض الأرصدة الافتتاحية والحركة والأرصدة الختامية
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 ml-2" />
              طباعة
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <FileDown className="h-4 w-4 ml-2" />
              تصدير
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              الفترة المحاسبية
            </CardTitle>
            <CardDescription>حدد الفترة الزمنية لميزان المراجعة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromDate">من تاريخ</Label>
                <Input
                  id="fromDate"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="toDate">إلى تاريخ</Label>
                <Input
                  id="toDate"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trial Balance Table */}
        <Card>
          <CardHeader>
            <CardTitle>ميزان المراجعة التفصيلي</CardTitle>
            <CardDescription>
              من {new Date(fromDate).toLocaleDateString('ar-EG')} إلى {new Date(toDate).toLocaleDateString('ar-EG')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-blue-50 to-cyan-50">
                    <TableHead className="text-center font-bold" rowSpan={2}>رمز الحساب</TableHead>
                    <TableHead className="text-center font-bold" rowSpan={2}>اسم الحساب</TableHead>
                    <TableHead className="text-center font-bold border-x" colSpan={2}>الرصيد الافتتاحي</TableHead>
                    <TableHead className="text-center font-bold border-x" colSpan={2}>حركة الفترة</TableHead>
                    <TableHead className="text-center font-bold border-x" colSpan={2}>الرصيد الختامي</TableHead>
                  </TableRow>
                  <TableRow className="bg-gradient-to-r from-blue-50 to-cyan-50">
                    <TableHead className="text-center text-green-700 font-semibold border-l">مدين</TableHead>
                    <TableHead className="text-center text-red-700 font-semibold border-r">دائن</TableHead>
                    <TableHead className="text-center text-green-700 font-semibold border-l">مدين</TableHead>
                    <TableHead className="text-center text-red-700 font-semibold border-r">دائن</TableHead>
                    <TableHead className="text-center text-green-700 font-semibold border-l">مدين</TableHead>
                    <TableHead className="text-center text-red-700 font-semibold border-r">دائن</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {balances.map((balance) => (
                    <TableRow key={balance.id} className="hover:bg-blue-50/50">
                      <TableCell className="text-center font-mono text-blue-600">{balance.code}</TableCell>
                      <TableCell className="font-medium">{balance.name}</TableCell>
                      <TableCell className="text-center text-green-700 border-l">
                        {balance.openingDebit > 0 ? balance.openingDebit.toLocaleString('ar-EG') : '-'}
                      </TableCell>
                      <TableCell className="text-center text-red-700 border-r">
                        {balance.openingCredit > 0 ? balance.openingCredit.toLocaleString('ar-EG') : '-'}
                      </TableCell>
                      <TableCell className="text-center text-green-700 border-l">
                        {balance.periodDebit > 0 ? balance.periodDebit.toLocaleString('ar-EG') : '-'}
                      </TableCell>
                      <TableCell className="text-center text-red-700 border-r">
                        {balance.periodCredit > 0 ? balance.periodCredit.toLocaleString('ar-EG') : '-'}
                      </TableCell>
                      <TableCell className="text-center text-green-700 border-l font-semibold">
                        {balance.closingDebit > 0 ? balance.closingDebit.toLocaleString('ar-EG') : '-'}
                      </TableCell>
                      <TableCell className="text-center text-red-700 border-r font-semibold">
                        {balance.closingCredit > 0 ? balance.closingCredit.toLocaleString('ar-EG') : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Totals Row */}
                  <TableRow className="bg-gradient-to-r from-blue-100 to-cyan-100 font-bold">
                    <TableCell colSpan={2} className="text-center">الإجمالي</TableCell>
                    <TableCell className="text-center text-green-700 border-l">
                      {totals.openingDebit.toLocaleString('ar-EG')}
                    </TableCell>
                    <TableCell className="text-center text-red-700 border-r">
                      {totals.openingCredit.toLocaleString('ar-EG')}
                    </TableCell>
                    <TableCell className="text-center text-green-700 border-l">
                      {totals.periodDebit.toLocaleString('ar-EG')}
                    </TableCell>
                    <TableCell className="text-center text-red-700 border-r">
                      {totals.periodCredit.toLocaleString('ar-EG')}
                    </TableCell>
                    <TableCell className="text-center text-green-700 border-l">
                      {totals.closingDebit.toLocaleString('ar-EG')}
                    </TableCell>
                    <TableCell className="text-center text-red-700 border-r">
                      {totals.closingCredit.toLocaleString('ar-EG')}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Balance Check */}
            <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold">حالة التوازن:</span>
                {totals.closingDebit === totals.closingCredit ? (
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                    ✓ متوازن
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold">
                    ✗ غير متوازن
                  </span>
                )}
              </div>
              {totals.closingDebit !== totals.closingCredit && (
                <div className="mt-2 text-sm text-red-600">
                  الفرق: {Math.abs(totals.closingDebit - totals.closingCredit).toLocaleString('ar-EG')}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
