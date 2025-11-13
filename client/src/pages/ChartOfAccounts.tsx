import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { Plus, Loader2, FolderTree, Settings } from "lucide-react";
import { toast } from "sonner";

export default function ChartOfAccounts() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    nameAr: "",
    nameEn: "",
    categoryId: "",
    description: "",
    currencyIds: [] as number[],
  });

  const { data: accounts, isLoading, refetch } = trpc.chartOfAccounts.list.useQuery();
  const { data: categories } = trpc.accountCategories.list.useQuery();
  const { data: currencies } = trpc.currencies.list.useQuery();
  const createMutation = trpc.chartOfAccounts.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.currencyIds.length === 0) {
      toast.error("يجب اختيار عملة واحدة على الأقل");
      return;
    }

    try {
      await createMutation.mutateAsync({
        code: formData.code,
        nameAr: formData.nameAr,
        nameEn: formData.nameEn || undefined,
        categoryId: parseInt(formData.categoryId),
        description: formData.description || undefined,
        currencyIds: formData.currencyIds,
      });

      toast.success("تم إضافة الحساب بنجاح");
      setOpen(false);
      setFormData({
        code: "",
        nameAr: "",
        nameEn: "",
        categoryId: "",
        description: "",
        currencyIds: [],
      });
      refetch();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء إضافة الحساب");
    }
  };

  const toggleCurrency = (currencyId: number) => {
    setFormData((prev) => ({
      ...prev,
      currencyIds: prev.currencyIds.includes(currencyId)
        ? prev.currencyIds.filter((id) => id !== currencyId)
        : [...prev.currencyIds, currencyId],
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">دليل الحسابات</h1>
          <p className="text-muted-foreground mt-1">إدارة الحسابات الرئيسية والفرعية</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="ml-2 h-4 w-4" />
            إدارة الأنواع
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="ml-2 h-4 w-4" />
                إضافة حساب
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>إضافة حساب جديد</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">رمز الحساب *</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      required
                      placeholder="مثال: 1010"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoryId">نوع الحساب *</Label>
                    <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع الحساب" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.nameAr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nameAr">اسم الحساب (عربي) *</Label>
                  <Input
                    id="nameAr"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    required
                    placeholder="مثال: النقدية"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nameEn">اسم الحساب (إنجليزي)</Label>
                  <Input
                    id="nameEn"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="Example: Cash"
                  />
                </div>

                <div className="space-y-2">
                  <Label>العملات المفضلة * (يجب اختيار عملة واحدة على الأقل)</Label>
                  <div className="border rounded-lg p-4 space-y-2 bg-muted/30">
                    {currencies?.map((currency) => (
                      <div key={currency.id} className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox
                          id={`currency-${currency.id}`}
                          checked={formData.currencyIds.includes(currency.id)}
                          onCheckedChange={() => toggleCurrency(currency.id)}
                        />
                        <label htmlFor={`currency-${currency.id}`} className="text-sm font-medium cursor-pointer">
                          {currency.nameAr} ({currency.symbol})
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">الوصف</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="وصف اختياري للحساب"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    إلغاء
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                    حفظ
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {accounts && accounts.length > 0 ? (
          accounts.map((account) => (
            <Card key={account.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderTree className="h-5 w-5 text-primary" />
                  <span>{account.nameAr}</span>
                  <span className="text-sm font-normal text-muted-foreground">({account.code})</span>
                  {!account.isActive && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">معطل</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {account.description || "لا يوجد وصف"}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FolderTree className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">لا توجد حسابات حتى الآن</p>
              <p className="text-sm text-muted-foreground mt-1">ابدأ بإضافة حساب جديد من الزر أعلاه</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
