import cron from 'node-cron';
import * as db from './db';

// @ts-ignore - backup-db.mjs is a pure ESM module
import { performBackup } from '../backup-db.mjs';

let scheduledTask: ReturnType<typeof cron.schedule> | null = null;

/**
 * تحويل تكرار النسخ إلى cron expression
 */
function getCronExpression(frequency: string, time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  
  switch (frequency) {
    case 'hourly':
      return `${minutes} * * * *`; // كل ساعة عند الدقيقة المحددة
    case 'daily':
      return `${minutes} ${hours} * * *`; // يومياً في الوقت المحدد
    case 'weekly':
      return `${minutes} ${hours} * * 0`; // أسبوعياً يوم الأحد
    case 'monthly':
      return `${minutes} ${hours} 1 * *`; // شهرياً في اليوم الأول
    default:
      return `${minutes} ${hours} * * *`; // افتراضي: يومياً
  }
}

/**
 * بدء جدولة النسخ الاحتياطي
 */
export async function startBackupScheduler() {
  try {
    // جلب إعدادات النسخ الاحتياطي
    const autoBackupSetting = await db.getSettingByKey('autoBackup');
    const frequencySetting = await db.getSettingByKey('backupFrequency');
    const timeSetting = await db.getSettingByKey('backupTime');
    
    // التحقق من تفعيل النسخ الاحتياطي
    if (!autoBackupSetting || autoBackupSetting.value !== 'true') {
      console.log('ℹ️  النسخ الاحتياطي التلقائي معطّل');
      return;
    }
    
    const frequency = frequencySetting?.value || 'daily';
    const time = timeSetting?.value || '02:00';
    
    // إيقاف الجدولة السابقة إن وجدت
    if (scheduledTask) {
      scheduledTask.stop();
      scheduledTask = null;
    }
    
    // إنشاء cron expression
    const cronExpression = getCronExpression(frequency, time);
    
    // جدولة المهمة
    scheduledTask = cron.schedule(cronExpression, async () => {
      console.log('⏰ بدء النسخ الاحتياطي المجدول...');
      const result = await performBackup();
      
      if (result.success) {
        console.log(`✅ اكتمل النسخ الاحتياطي المجدول: ${result.filename}`);
      } else {
        console.error(`❌ فشل النسخ الاحتياطي المجدول: ${result.error}`);
      }
    });
    
    console.log(`✅ تم تفعيل جدولة النسخ الاحتياطي: ${frequency} في ${time}`);
    console.log(`   Cron expression: ${cronExpression}`);
    
  } catch (error) {
    console.error('❌ فشل بدء جدولة النسخ الاحتياطي:', error);
  }
}

/**
 * إيقاف جدولة النسخ الاحتياطي
 */
export function stopBackupScheduler() {
  if (scheduledTask) {
    scheduledTask.stop();
    scheduledTask = null;
    console.log('⏹️  تم إيقاف جدولة النسخ الاحتياطي');
  }
}

/**
 * إعادة تشغيل جدولة النسخ الاحتياطي
 */
export async function restartBackupScheduler() {
  stopBackupScheduler();
  await startBackupScheduler();
}
