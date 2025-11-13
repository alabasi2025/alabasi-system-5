import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Download, Printer, Calendar, TrendingUp, TrendingDown } from "lucide-react";

export default function IncomeStatement() {
  // بيانات وهمية للعرض
  const revenues = [
    { name: "مبيعات المنتجات", amount: 450000 },
    { name: "مبيعات الخدمات", amount: 180000 },
    { name: "إيرادات أخرى", amount: 20000 },
  ];

  const costOfSales = [
    { name: "تكلفة البضاعة المباعة", amount: 280000 },
  ];

  const operatingExpenses = [
    { name: "الرواتب والأجور", amount: 120000 },
    { name: "الإيجار", amount: 48000 },
    { name: "الكهرباء والماء", amount: 12000 },
    { name: "مصاريف التسويق", amount: 25000 },
    { name: "مصاريف إدارية", amount: 15000 },
  ];

  const otherExpenses = [
    { name: "فوائد القروض", amount: 10000 },
  ];

  const totalRevenues = revenues.reduce((sum, item) => sum + item.amount, 0);
  const totalCostOfSales = costOfSales.reduce((sum, item) => sum + item.amount, 0);
  const grossProfit = totalRevenues - totalCostOfSales;
  const totalOperatingExpenses = operatingExpenses.reduce((sum, item) => sum + item.amount, 0);
  const operatingProfit = grossProfit - totalOperatingExpenses;
  const totalOtherExpenses = otherExpenses.reduce((sum, item) => sum + item.amount, 0);
  const netProfit = operatingProfit - totalOtherExpenses;

  const grossProfitMargin = ((grossProfit / totalRevenues) * 100).toFixed(1);
  const operatingProfitMargin = ((operatingProfit / totalRevenues) * 100).toFixed(1);
  const netProfitMargin = ((netProfit / totalRevenues) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <LineChart className="h-8 w-8 text-purple-600" />
            قائمة الدخل
          </h1>
          <p className="text-muted-foreground mt-1">قائمة الأرباح والخسائر</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 ml-2" />
            طباعة
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 ml-2" />
            تصدير PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>الفترة الزمنية</CardTitle>
          <CardDescription>اختر الفترة المراد عرض قائمة الدخل لها</CardDescription>
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

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">هامش الربح الإجمالي</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{grossProfitMargin}%</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">هامش الربح التشغيلي</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{operatingProfitMargin}%</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">هامش صافي الربح</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{netProfitMargin}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Income Statement */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الدخل</CardTitle>
          <CardDescription>تفاصيل الإيرادات والمصروفات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* الإيرادات */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-green-700 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              الإيرادات
            </h3>
            <div className="space-y-2 pr-6">
              {revenues.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-medium text-green-600">{item.amount.toLocaleString()} ر.س</span>
                </div>
              ))}
              <div className="flex justify-between items-center py-2 font-semibold text-green-700">
                <span>إجمالي الإيرادات</span>
                <span>{totalRevenues.toLocaleString()} ر.س</span>
              </div>
            </div>
          </div>

          {/* تكلفة المبيعات */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-red-700 flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              تكلفة المبيعات
            </h3>
            <div className="space-y-2 pr-6">
              {costOfSales.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-medium text-red-600">({item.amount.toLocaleString()}) ر.س</span>
                </div>
              ))}
            </div>
          </div>

          {/* مجمل الربح */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex justify-between items-center font-bold text-lg">
              <span className="text-green-800">مجمل الربح</span>
              <span className="text-green-600">{grossProfit.toLocaleString()} ر.س</span>
            </div>
          </div>

          {/* المصروفات التشغيلية */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-orange-700">المصروفات التشغيلية</h3>
            <div className="space-y-2 pr-6">
              {operatingExpenses.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-medium text-orange-600">({item.amount.toLocaleString()}) ر.س</span>
                </div>
              ))}
              <div className="flex justify-between items-center py-2 font-semibold text-orange-700">
                <span>إجمالي المصروفات التشغيلية</span>
                <span>({totalOperatingExpenses.toLocaleString()}) ر.س</span>
              </div>
            </div>
          </div>

          {/* الربح التشغيلي */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center font-bold text-lg">
              <span className="text-blue-800">الربح التشغيلي</span>
              <span className="text-blue-600">{operatingProfit.toLocaleString()} ر.س</span>
            </div>
          </div>

          {/* المصروفات الأخرى */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-red-700">المصروفات الأخرى</h3>
            <div className="space-y-2 pr-6">
              {otherExpenses.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-medium text-red-600">({item.amount.toLocaleString()}) ر.س</span>
                </div>
              ))}
            </div>
          </div>

          {/* صافي الربح */}
          <div className={`p-6 rounded-lg ${netProfit >= 0 ? 'bg-purple-50' : 'bg-red-50'}`}>
            <div className="flex justify-between items-center font-bold text-xl">
              <span className={netProfit >= 0 ? 'text-purple-800' : 'text-red-800'}>
                {netProfit >= 0 ? 'صافي الربح' : 'صافي الخسارة'}
              </span>
              <span className={netProfit >= 0 ? 'text-purple-600' : 'text-red-600'}>
                {netProfit >= 0 ? '' : '('}{Math.abs(netProfit).toLocaleString()}{netProfit >= 0 ? '' : ')'} ر.س
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
