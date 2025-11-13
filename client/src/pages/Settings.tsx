import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Save, Settings as SettingsIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BackupManagement from "@/components/BackupManagement";

export default function Settings() {
  const { user } = useAuth();
  const utils = trpc.useUtils();

  // جلب جميع الإعدادات
  const { data: allSettings, isLoading } = trpc.settings.getAll.useQuery();

  // حالات النماذج
  const [generalSettings, setGeneralSettings] = useState({
    organizationName: "",
    defaultCurrency: "SAR",
    fiscalYearStart: "01-01",
  });

  const [systemSettings, setSystemSettings] = useState({
    port: "3000",
    language: "ar",
    theme: "light",
  });

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: "false",
    backupFrequency: "daily",
    backupTime: "02:00",
  });

  // Mutation لحفظ الإعدادات
  const upsertMutation = trpc.settings.upsert.useMutation({
    onSuccess: () => {
      utils.settings.getAll.invalidate();
      toast.success("تم حفظ الإعدادات بنجاح");
    },
    onError: (error) => {
      toast.error(`فشل حفظ الإعدادات: ${error.message}`);
    },
  });

  // تحميل الإعدادات من الخادم
  useState(() => {
    if (allSettings) {
      allSettings.forEach((setting) => {
        if (setting.category === "general") {
          setGeneralSettings((prev) => ({ ...prev, [setting.key]: setting.value || "" }));
        } else if (setting.category === "system") {
          setSystemSettings((prev) => ({ ...prev, [setting.key]: setting.value || "" }));
        } else if (setting.category === "backup") {
          setBackupSettings((prev) => ({ ...prev, [setting.key]: setting.value || "" }));
        }
      });
    }
  });

  const handleSaveGeneral = async () => {
    try {
      await upsertMutation.mutateAsync({
        key: "organizationName",
        value: generalSettings.organizationName,
        category: "general",
        description: "اسم المؤسسة",
      });
      await upsertMutation.mutateAsync({
        key: "defaultCurrency",
        value: generalSettings.defaultCurrency,
        category: "general",
        description: "العملة الافتراضية",
      });
      await upsertMutation.mutateAsync({
        key: "fiscalYearStart",
        value: generalSettings.fiscalYearStart,
        category: "general",
        description: "بداية السنة المالية",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveSystem = async () => {
    try {
      await upsertMutation.mutateAsync({
        key: "port",
        value: systemSettings.port,
        category: "system",
        description: "منفذ الخادم",
      });
      await upsertMutation.mutateAsync({
        key: "language",
        value: systemSettings.language,
        category: "system",
        description: "اللغة الافتراضية",
      });
      await upsertMutation.mutateAsync({
        key: "theme",
        value: systemSettings.theme,
        category: "system",
        description: "المظهر",
      });
      toast.info("ملاحظة: يتطلب إعادة تشغيل الخادم لتطبيق بعض التغييرات");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveBackup = async () => {
    try {
      await upsertMutation.mutateAsync({
        key: "autoBackup",
        value: backupSettings.autoBackup,
        category: "backup",
        description: "النسخ الاحتياطي التلقائي",
      });
      await upsertMutation.mutateAsync({
        key: "backupFrequency",
        value: backupSettings.backupFrequency,
        category: "backup",
        description: "تكرار النسخ الاحتياطي",
      });
      await upsertMutation.mutateAsync({
        key: "backupTime",
        value: backupSettings.backupTime,
        category: "backup",
        description: "وقت النسخ الاحتياطي",
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">إعدادات النظام</h1>
          <p className="text-muted-foreground">إدارة التكوينات الأساسية للنظام المحاسبي</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">الإعدادات العامة</TabsTrigger>
          <TabsTrigger value="system">إعدادات النظام</TabsTrigger>
          <TabsTrigger value="backup">النسخ الاحتياطي</TabsTrigger>
          <TabsTrigger value="backups">إدارة النسخ</TabsTrigger>
        </TabsList>

        {/* الإعدادات العامة */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>الإعدادات العامة</CardTitle>
              <CardDescription>إعدادات المؤسسة والعملة والسنة المالية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="organizationName">اسم المؤسسة</Label>
                <Input
                  id="organizationName"
                  value={generalSettings.organizationName}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, organizationName: e.target.value })
                  }
                  placeholder="مثال: شركة العباسي للمحاسبة"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultCurrency">العملة الافتراضية</Label>
                <Select
                  value={generalSettings.defaultCurrency}
                  onValueChange={(value) =>
                    setGeneralSettings({ ...generalSettings, defaultCurrency: value })
                  }
                >
                  <SelectTrigger id="defaultCurrency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                    <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                    <SelectItem value="EUR">يورو (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fiscalYearStart">بداية السنة المالية</Label>
                <Input
                  id="fiscalYearStart"
                  type="text"
                  value={generalSettings.fiscalYearStart}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, fiscalYearStart: e.target.value })
                  }
                  placeholder="MM-DD (مثال: 01-01)"
                />
                <p className="text-sm text-muted-foreground">
                  أدخل التاريخ بصيغة شهر-يوم (مثال: 01-01 لبداية يناير)
                </p>
              </div>

              <Button
                onClick={handleSaveGeneral}
                disabled={upsertMutation.isPending}
                className="w-full"
              >
                {upsertMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 ml-2" />
                    حفظ الإعدادات العامة
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* إعدادات النظام */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات النظام</CardTitle>
              <CardDescription>إعدادات المنفذ واللغة والمظهر</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="port">منفذ الخادم (Port)</Label>
                <Input
                  id="port"
                  type="number"
                  value={systemSettings.port}
                  onChange={(e) => setSystemSettings({ ...systemSettings, port: e.target.value })}
                  placeholder="3000"
                />
                <p className="text-sm text-muted-foreground">
                  ⚠️ يتطلب إعادة تشغيل الخادم لتطبيق التغيير
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">اللغة الافتراضية</Label>
                <Select
                  value={systemSettings.language}
                  onValueChange={(value) => setSystemSettings({ ...systemSettings, language: value })}
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">المظهر</Label>
                <Select
                  value={systemSettings.theme}
                  onValueChange={(value) => setSystemSettings({ ...systemSettings, theme: value })}
                >
                  <SelectTrigger id="theme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">فاتح</SelectItem>
                    <SelectItem value="dark">داكن</SelectItem>
                    <SelectItem value="system">حسب النظام</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleSaveSystem}
                disabled={upsertMutation.isPending}
                className="w-full"
              >
                {upsertMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 ml-2" />
                    حفظ إعدادات النظام
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* النسخ الاحتياطي */}
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات النسخ الاحتياطي</CardTitle>
              <CardDescription>جدولة النسخ الاحتياطي التلقائي لقاعدة البيانات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="autoBackup">تفعيل النسخ الاحتياطي التلقائي</Label>
                <Select
                  value={backupSettings.autoBackup}
                  onValueChange={(value) =>
                    setBackupSettings({ ...backupSettings, autoBackup: value })
                  }
                >
                  <SelectTrigger id="autoBackup">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">مفعّل</SelectItem>
                    <SelectItem value="false">معطّل</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backupFrequency">تكرار النسخ الاحتياطي</Label>
                <Select
                  value={backupSettings.backupFrequency}
                  onValueChange={(value) =>
                    setBackupSettings({ ...backupSettings, backupFrequency: value })
                  }
                  disabled={backupSettings.autoBackup === "false"}
                >
                  <SelectTrigger id="backupFrequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">كل ساعة</SelectItem>
                    <SelectItem value="daily">يومياً</SelectItem>
                    <SelectItem value="weekly">أسبوعياً</SelectItem>
                    <SelectItem value="monthly">شهرياً</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backupTime">وقت النسخ الاحتياطي</Label>
                <Input
                  id="backupTime"
                  type="time"
                  value={backupSettings.backupTime}
                  onChange={(e) =>
                    setBackupSettings({ ...backupSettings, backupTime: e.target.value })
                  }
                  disabled={backupSettings.autoBackup === "false"}
                />
                <p className="text-sm text-muted-foreground">
                  الوقت المفضل لتشغيل النسخ الاحتياطي التلقائي
                </p>
              </div>

              <Button
                onClick={handleSaveBackup}
                disabled={upsertMutation.isPending}
                className="w-full"
              >
                {upsertMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 ml-2" />
                    حفظ إعدادات النسخ الاحتياطي
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* إدارة النسخ الاحتياطية */}
        <TabsContent value="backups">
          <BackupManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
