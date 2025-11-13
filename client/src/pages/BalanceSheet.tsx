import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PieChart, Download, Printer, Calendar } from "lucide-react";

export default function BalanceSheet() {
  // بيانات وهمية للعرض
  const assets = {
    current: [
      { name: "النقدية", amount: 50000 },
      { name: "البنك", amount: 120000 },
      { name: "المدينون", amount: 80000 },
      { name: "المخزون", amount: 150000 },
    ],
    fixed: [
      { name: "الأراضي", amount: 500000 },
      { name: "المباني", amount: 800000 },
      { name: "السيارات", amount: 200000 },
      { name: "الأثاث", amount: 50000 },
    ],
  };

  const liabilities = {
    current: [
      { name: "الدائنون", amount: 60000 },
      { name: "قروض قصيرة الأجل", amount: 100000 },
    ],
    longTerm: [
      { name: "قروض طويلة الأجل", amount: 300000 },
    ],
  };

  const equity = [
    { name: "رأس المال", amount: 1000000 },
    { name: "الأرباح المحتجزة", amount: 490000 },
  ];

  const totalCurrentAssets = assets.current.reduce((sum, item) => sum + item.amount, 0);
  const totalFixedAssets = assets.fixed.reduce((sum, item) => sum + item.amount, 0);
  const totalAssets = totalCurrentAssets + totalFixedAssets;

  const totalCurrentLiabilities = liabilities.current.reduce((sum, item) => sum + item.amount, 0);
  const totalLongTermLiabilities = liabilities.longTerm.reduce((sum, item) => sum + item.amount, 0);
  const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;

  const totalEquity = equity.reduce((sum, item) => sum + item.amount, 0);
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <PieChart className="h-8 w-8 text-green-600" />
            قائمة المركز المالي
          </h1>
          <p className="text-muted-foreground mt-1">الميزانية العمومية</p>
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
          <CardTitle>التاريخ</CardTitle>
          <CardDescription>اختر تاريخ القائمة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">تاريخ القائمة</Label>
              <Input
                id="date"
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

      <div className="grid gap-6 md:grid-cols-2">
        {/* الأصول */}
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800">الأصول</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* الأصول المتداولة */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-blue-700">الأصول المتداولة</h3>
              <div className="space-y-2">
                {assets.current.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium">{item.amount.toLocaleString()} ر.س</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2 font-semibold text-blue-600">
                  <span>إجمالي الأصول المتداولة</span>
                  <span>{totalCurrentAssets.toLocaleString()} ر.س</span>
                </div>
              </div>
            </div>

            {/* الأصول الثابتة */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-blue-700">الأصول الثابتة</h3>
              <div className="space-y-2">
                {assets.fixed.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium">{item.amount.toLocaleString()} ر.س</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2 font-semibold text-blue-600">
                  <span>إجمالي الأصول الثابتة</span>
                  <span>{totalFixedAssets.toLocaleString()} ر.س</span>
                </div>
              </div>
            </div>

            {/* إجمالي الأصول */}
            <div className="pt-4 border-t-2 border-blue-600">
              <div className="flex justify-between items-center font-bold text-lg text-blue-800">
                <span>إجمالي الأصول</span>
                <span>{totalAssets.toLocaleString()} ر.س</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* الخصوم وحقوق الملكية */}
        <Card>
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-800">الخصوم وحقوق الملكية</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* الخصوم المتداولة */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-green-700">الخصوم المتداولة</h3>
              <div className="space-y-2">
                {liabilities.current.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium">{item.amount.toLocaleString()} ر.س</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2 font-semibold text-green-600">
                  <span>إجمالي الخصوم المتداولة</span>
                  <span>{totalCurrentLiabilities.toLocaleString()} ر.س</span>
                </div>
              </div>
            </div>

            {/* الخصوم طويلة الأجل */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-green-700">الخصوم طويلة الأجل</h3>
              <div className="space-y-2">
                {liabilities.longTerm.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium">{item.amount.toLocaleString()} ر.س</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2 font-semibold text-green-600">
                  <span>إجمالي الخصوم طويلة الأجل</span>
                  <span>{totalLongTermLiabilities.toLocaleString()} ر.س</span>
                </div>
              </div>
            </div>

            {/* حقوق الملكية */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-green-700">حقوق الملكية</h3>
              <div className="space-y-2">
                {equity.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium">{item.amount.toLocaleString()} ر.س</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2 font-semibold text-green-600">
                  <span>إجمالي حقوق الملكية</span>
                  <span>{totalEquity.toLocaleString()} ر.س</span>
                </div>
              </div>
            </div>

            {/* إجمالي الخصوم وحقوق الملكية */}
            <div className="pt-4 border-t-2 border-green-600">
              <div className="flex justify-between items-center font-bold text-lg text-green-800">
                <span>إجمالي الخصوم وحقوق الملكية</span>
                <span>{totalLiabilitiesAndEquity.toLocaleString()} ر.س</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Balance Check */}
      {totalAssets === totalLiabilitiesAndEquity ? (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <p className="text-green-800 font-semibold text-center">
              ✓ القائمة متوازنة - إجمالي الأصول يساوي إجمالي الخصوم وحقوق الملكية
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-800 font-semibold text-center">
              ✗ القائمة غير متوازنة - الفرق: {Math.abs(totalAssets - totalLiabilitiesAndEquity).toLocaleString()} ر.س
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
