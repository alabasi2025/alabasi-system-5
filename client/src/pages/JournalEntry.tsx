import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Save, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

interface JournalLine {
  id: string;
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string;
}

export default function JournalEntry() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState("");
  const [lines, setLines] = useState<JournalLine[]>([
    { id: "1", accountId: "", accountName: "", debit: 0, credit: 0, description: "" },
    { id: "2", accountId: "", accountName: "", debit: 0, credit: 0, description: "" },
  ]);

  const addLine = () => {
    const newLine: JournalLine = {
      id: Date.now().toString(),
      accountId: "",
      accountName: "",
      debit: 0,
      credit: 0,
      description: "",
    };
    setLines([...lines, newLine]);
  };

  const removeLine = (id: string) => {
    if (lines.length > 2) {
      setLines(lines.filter(line => line.id !== id));
    } else {
      toast.error("يجب أن يحتوي القيد على طرفين على الأقل");
    }
  };

  const updateLine = (id: string, field: keyof JournalLine, value: any) => {
    setLines(lines.map(line => 
      line.id === id ? { ...line, [field]: value } : line
    ));
  };

  const calculateTotals = () => {
    const totalDebit = lines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0);
    const totalCredit = lines.reduce((sum, line) => sum + (Number(line.credit) || 0), 0);
    return { totalDebit, totalCredit, difference: totalDebit - totalCredit };
  };

  const handleSave = () => {
    const { totalDebit, totalCredit, difference } = calculateTotals();
    
    if (Math.abs(difference) > 0.01) {
      toast.error(`القيد غير متوازن. الفرق: ${difference.toFixed(2)} ر.س`);
      return;
    }

    // TODO: حفظ القيد في قاعدة البيانات
    toast.success("تم حفظ القيد اليومي بنجاح");
  };

  const { totalDebit, totalCredit, difference } = calculateTotals();
  const isBalanced = Math.abs(difference) < 0.01;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileSpreadsheet className="h-8 w-8 text-blue-600" />
            قيد يومي جديد
          </h1>
          <p className="text-muted-foreground mt-1">إنشاء قيد محاسبي يدوي</p>
        </div>
        <Button onClick={handleSave} disabled={!isBalanced} size="lg">
          <Save className="h-4 w-4 ml-2" />
          حفظ القيد
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>معلومات القيد</CardTitle>
          <CardDescription>أدخل تفاصيل القيد اليومي</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">التاريخ</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">الوصف العام</Label>
              <Input
                id="description"
                placeholder="وصف القيد..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>أطراف القيد</CardTitle>
              <CardDescription>أضف الحسابات المدينة والدائنة</CardDescription>
            </div>
            <Button onClick={addLine} variant="outline" size="sm">
              <Plus className="h-4 w-4 ml-2" />
              إضافة طرف
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Header */}
            <div className="grid grid-cols-12 gap-2 font-semibold text-sm pb-2 border-b">
              <div className="col-span-4">الحساب</div>
              <div className="col-span-2 text-center">مدين</div>
              <div className="col-span-2 text-center">دائن</div>
              <div className="col-span-3">البيان</div>
              <div className="col-span-1"></div>
            </div>

            {/* Lines */}
            {lines.map((line) => (
              <div key={line.id} className="grid grid-cols-12 gap-2 items-start">
                <div className="col-span-4">
                  <Select
                    value={line.accountId}
                    onValueChange={(value) => updateLine(line.id, "accountId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحساب..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">النقدية</SelectItem>
                      <SelectItem value="2">البنك</SelectItem>
                      <SelectItem value="3">المبيعات</SelectItem>
                      <SelectItem value="4">المشتريات</SelectItem>
                      <SelectItem value="5">الرواتب</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={line.debit || ""}
                    onChange={(e) => updateLine(line.id, "debit", parseFloat(e.target.value) || 0)}
                    className="text-center"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={line.credit || ""}
                    onChange={(e) => updateLine(line.id, "credit", parseFloat(e.target.value) || 0)}
                    className="text-center"
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    placeholder="البيان..."
                    value={line.description}
                    onChange={(e) => updateLine(line.id, "description", e.target.value)}
                  />
                </div>
                <div className="col-span-1 flex justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLine(line.id)}
                    disabled={lines.length <= 2}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Totals */}
            <div className="grid grid-cols-12 gap-2 pt-4 border-t font-bold">
              <div className="col-span-4 text-left">الإجمالي</div>
              <div className="col-span-2 text-center bg-blue-50 p-2 rounded">
                {totalDebit.toFixed(2)} ر.س
              </div>
              <div className="col-span-2 text-center bg-green-50 p-2 rounded">
                {totalCredit.toFixed(2)} ر.س
              </div>
              <div className="col-span-4"></div>
            </div>

            {/* Balance Check */}
            <div className={`p-4 rounded-lg ${isBalanced ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold">
                  {isBalanced ? "✓ القيد متوازن" : "✗ القيد غير متوازن"}
                </span>
                {!isBalanced && (
                  <span>الفرق: {Math.abs(difference).toFixed(2)} ر.س</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
