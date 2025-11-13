import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Plus, Loader2, Wallet, Building2, User, CreditCard, Package } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/const";

const typeIcons: Record<string, any> = {
  cash: Wallet,
  bank: Building2,
  exchanger: User,
  wallet: CreditCard,
  warehouse: Package,
};

export default function AnalyticalAccounts() {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [formData, setFormData] = useState({
    code: "",
    nameAr: "",
    nameEn: "",
    chartAccountId: "",
    typeId: "",
    branchId: "",
    openingBalance: "0",
    currencyId: "",
    description: "",
  });

  const { data: accounts, isLoading, refetch } = trpc.analyticalAccounts.list.useQuery();
  const { data: types } = trpc.analyticalAccountTypes.list.useQuery();
  const { data: chartAccounts } = trpc.chartOfAccounts.list.useQuery();
  const { data: branches } = trpc.branches.list.useQuery();
  const { data: currencies } = trpc.currencies.list.useQuery();
  const createMutation = trpc.analyticalAccounts.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createMutation.mutateAsync({
        code: formData.code,
        nameAr: formData.nameAr,
        nameEn: formData.nameEn || undefined,
        chartAccountId: parseInt(formData.chartAccountId),
        typeId: parseInt(formData.typeId),
        branchId: parseInt(formData.branchId),
        openingBalance: parseFloat(formData.openingBalance) * 100,
        currencyId: parseInt(formData.currencyId),
        description: formData.description || undefined,
      });

      toast.success("تم إضافة الحساب التحليلي بنجاح");
      setOpen(false);
      setFormData({
        code: "",
        nameAr: "",
        nameEn: "",
        chartAccountId: "",
        typeId: "",
        branchId: "",
        openingBalance: "0",
        currencyId: "",
        description: "",
      });
      refetch();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء إضافة الحساب");
    }
  };

  const filteredAccounts = selectedType === "all" 
    ? accounts 
    : accounts?.filter(acc => acc.typeId === parseInt(selectedType));

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
          <h1 className="text-3xl font-bold">الحسابات التحليلية</h1>
          <p className="text-muted-foreground mt-1">إدارة الصناديق، البنوك، الصرافين، والمحافظ</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              إضافة حساب تحليلي
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة حساب تحليلي جديد</DialogTitle>
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
                    placeholder="مثال: CASH-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="typeId">نوع الحساب *</Label>
                  <Select value={formData.typeId} onValueChange={(value) => setFormData({ ...formData, typeId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      {types?.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.nameAr}
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
                  placeholder="مثال: صندوق المكتب"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nameEn">اسم الحساب (إنجليزي)</Label>
                <Input
                  id="nameEn"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="Example: Office Cash"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="chartAccountId">الحساب الرئيسي *</Label>
                  <Select value={formData.chartAccountId} onValueChange={(value) => setFormData({ ...formData, chartAccountId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحساب" />
                    </SelectTrigger>
                    <SelectContent>
                      {chartAccounts?.map((acc) => (
                        <SelectItem key={acc.id} value={acc.id.toString()}>
                          {acc.nameAr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branchId">الفرع *</Label>
                  <Select value={formData.branchId} onValueChange={(value) => setFormData({ ...formData, branchId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفرع" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches?.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id.toString()}>
                          {branch.nameAr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currencyId">العملة *</Label>
                  <Select value={formData.currencyId} onValueChange={(value) => setFormData({ ...formData, currencyId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر العملة" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies?.map((currency) => (
                        <SelectItem key={currency.id} value={currency.id.toString()}>
                          {currency.nameAr} ({currency.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="openingBalance">الرصيد الافتتاحي</Label>
                  <Input
                    id="openingBalance"
                    type="number"
                    step="0.01"
                    value={formData.openingBalance}
                    onChange={(e) => setFormData({ ...formData, openingBalance: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="وصف اختياري"
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

      <Tabs value={selectedType} onValueChange={setSelectedType}>
        <TabsList>
          <TabsTrigger value="all">الكل</TabsTrigger>
          {types?.map((type) => (
            <TabsTrigger key={type.id} value={type.id.toString()}>
              {type.nameAr}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedType} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAccounts && filteredAccounts.length > 0 ? (
              filteredAccounts.map((account) => {
                const Icon = typeIcons[account.type?.code || "cash"] || Wallet;
                return (
                  <Card key={account.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <span className="text-base">{account.nameAr}</span>
                        </div>
                        <Badge variant="secondary">{account.type?.nameAr}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">الرصيد الحالي:</span>
                          <span className="font-bold">{formatCurrency(account.currentBalance || 0)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">الرمز:</span>
                          <span>{account.code}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="col-span-full">
                <CardContent className="text-center py-12">
                  <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">لا توجد حسابات تحليلية</p>
                  <p className="text-sm text-muted-foreground mt-1">ابدأ بإضافة حساب تحليلي جديد</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
