import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Download, Upload, RefreshCw, Database, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function BackupManagement() {
  const utils = trpc.useUtils();
  const [restoreFilename, setRestoreFilename] = useState<string | null>(null);

  // جلب قائمة النسخ الاحتياطية
  const { data: backups, isLoading } = trpc.backup.list.useQuery();

  // Mutation لإنشاء نسخة احتياطية
  const createBackupMutation = trpc.backup.create.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        toast.success(`تم إنشاء النسخة الاحتياطية: ${result.filename}`);
        utils.backup.list.invalidate();
      } else {
        toast.error(`فشل النسخ الاحتياطي: ${result.error}`);
      }
    },
    onError: (error) => {
      toast.error(`خطأ: ${error.message}`);
    },
  });

  // Mutation لاستعادة نسخة احتياطية
  const restoreBackupMutation = trpc.backup.restore.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        toast.success(`تمت استعادة النسخة الاحتياطية: ${result.filename}`);
        setRestoreFilename(null);
        // إعادة تحميل الصفحة بعد الاستعادة
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(`فشلت الاستعادة: ${result.error}`);
      }
    },
    onError: (error) => {
      toast.error(`خطأ: ${error.message}`);
      setRestoreFilename(null);
    },
  });

  // Mutation لإعادة تشغيل الجدولة
  const restartSchedulerMutation = trpc.backup.restartScheduler.useMutation({
    onSuccess: () => {
      toast.success("تم إعادة تشغيل جدولة النسخ الاحتياطي");
    },
    onError: (error) => {
      toast.error(`فشل إعادة التشغيل: ${error.message}`);
    },
  });

  const handleCreateBackup = () => {
    createBackupMutation.mutate();
  };

  const handleRestoreBackup = () => {
    if (restoreFilename) {
      restoreBackupMutation.mutate(restoreFilename);
    }
  };

  const handleRestartScheduler = () => {
    restartSchedulerMutation.mutate();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* بطاقة الإجراءات */}
        <Card>
          <CardHeader>
            <CardTitle>إدارة النسخ الاحتياطية</CardTitle>
            <CardDescription>
              إنشاء واستعادة نسخ احتياطية لقاعدة البيانات
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleCreateBackup}
                disabled={createBackupMutation.isPending}
                variant="default"
              >
                {createBackupMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 ml-2" />
                    إنشاء نسخة احتياطية الآن
                  </>
                )}
              </Button>

              <Button
                onClick={handleRestartScheduler}
                disabled={restartSchedulerMutation.isPending}
                variant="outline"
              >
                {restartSchedulerMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري إعادة التشغيل...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 ml-2" />
                    إعادة تشغيل الجدولة
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-start gap-2 p-4 bg-muted rounded-lg">
              <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">ملاحظات مهمة:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>يتم الاحتفاظ بآخر 30 نسخة احتياطية فقط</li>
                  <li>استعادة النسخة ستستبدل البيانات الحالية بالكامل</li>
                  <li>يُنصح بإنشاء نسخة احتياطية قبل أي تحديث كبير</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* جدول النسخ الاحتياطية */}
        <Card>
          <CardHeader>
            <CardTitle>النسخ الاحتياطية المتاحة ({backups?.length || 0})</CardTitle>
            <CardDescription>
              قائمة بجميع النسخ الاحتياطية المحفوظة
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!backups || backups.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد نسخ احتياطية متاحة</p>
                <p className="text-sm mt-2">قم بإنشاء نسخة احتياطية الآن</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">#</TableHead>
                      <TableHead className="text-right">اسم الملف</TableHead>
                      <TableHead className="text-right">التاريخ والوقت</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backups.map((backup: any, index: number) => (
                      <TableRow key={backup.filename}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {backup.filename}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {backup.timestamp}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => setRestoreFilename(backup.filename)}
                            variant="outline"
                            size="sm"
                            disabled={restoreBackupMutation.isPending}
                          >
                            <Upload className="w-4 h-4 ml-2" />
                            استعادة
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog تأكيد الاستعادة */}
      <AlertDialog open={!!restoreFilename} onOpenChange={(open) => !open && setRestoreFilename(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد استعادة النسخة الاحتياطية</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                هل أنت متأكد من استعادة النسخة الاحتياطية:{" "}
                <span className="font-mono font-bold">{restoreFilename}</span>؟
              </p>
              <p className="text-destructive font-medium">
                ⚠️ تحذير: سيتم استبدال جميع البيانات الحالية بالبيانات من هذه النسخة!
              </p>
              <p>هذا الإجراء لا يمكن التراجع عنه.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestoreBackup}
              className="bg-destructive hover:bg-destructive/90"
            >
              {restoreBackupMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جاري الاستعادة...
                </>
              ) : (
                "تأكيد الاستعادة"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
