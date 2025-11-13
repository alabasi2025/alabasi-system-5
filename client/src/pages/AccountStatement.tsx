import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileSpreadsheet, Download, Printer } from "lucide-react";

export default function AccountStatement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileSpreadsheet className="h-8 w-8 text-orange-600" />
            كشف الحساب
          </h1>
          <p className="text-muted-foreground mt-1">عرض حركة حساب معين</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 ml-2" />
            طباعة
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 ml-2" />
            تصدير
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>اختيار الحساب والفترة</CardTitle>
          <CardDescription>حدد الحساب والفترة الزمنية</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>الحساب</Label>
              <Input placeholder="اختر الحساب..." />
            </div>
            <div className="space-y-2">
              <Label>من تاريخ</Label>
              <Input type="date" defaultValue="2025-01-01" />
            </div>
            <div className="space-y-2">
              <Label>إلى تاريخ</Label>
              <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
          </div>
          <Button className="w-full mt-4">عرض كشف الحساب</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>كشف الحساب</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            اختر حساباً لعرض كشف الحساب
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
