import { exec } from 'child_process';
import { promisify } from 'util';
import { mkdir, readdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// مجلد النسخ الاحتياطية
const BACKUP_DIR = path.join(__dirname, 'backups');

// الحد الأقصى لعدد النسخ الاحتياطية المحفوظة
const MAX_BACKUPS = 30;

/**
 * إنشاء مجلد النسخ الاحتياطية إذا لم يكن موجوداً
 */
async function ensureBackupDir() {
  if (!existsSync(BACKUP_DIR)) {
    await mkdir(BACKUP_DIR, { recursive: true });
    console.log(`✓ تم إنشاء مجلد النسخ الاحتياطية: ${BACKUP_DIR}`);
  }
}

/**
 * استخراج معلومات الاتصال من DATABASE_URL
 */
function parseDatabaseUrl(url) {
  // Format: mysql://user:password@host:port/database
  const regex = /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
  const match = url.match(regex);
  
  if (!match) {
    throw new Error('تنسيق DATABASE_URL غير صحيح');
  }
  
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: match[4],
    database: match[5],
  };
}

/**
 * تنفيذ النسخ الاحتياطي
 */
async function performBackup() {
  try {
    console.log('🔄 بدء عملية النسخ الاحتياطي...');
    
    // التأكد من وجود DATABASE_URL
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL غير محدد في متغيرات البيئة');
    }
    
    // التأكد من وجود مجلد النسخ
    await ensureBackupDir();
    
    // استخراج معلومات الاتصال
    const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL);
    
    // إنشاء اسم الملف مع timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `backup-${timestamp}.sql`;
    const filepath = path.join(BACKUP_DIR, filename);
    
    // تنفيذ mysqldump
    console.log(`📦 جاري إنشاء النسخة الاحتياطية: ${filename}`);
    
    const command = `mysqldump -h ${dbConfig.host} -P ${dbConfig.port} -u ${dbConfig.user} -p${dbConfig.password} ${dbConfig.database} > "${filepath}"`;
    
    await execAsync(command);
    
    console.log(`✅ تم إنشاء النسخة الاحتياطية بنجاح: ${filename}`);
    
    // تنظيف النسخ القديمة
    await cleanOldBackups();
    
    return {
      success: true,
      filename,
      filepath,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('❌ فشل النسخ الاحتياطي:', error.message);
    return {
      success: false,
      error: error.message,
      timestamp: new Date(),
    };
  }
}

/**
 * حذف النسخ الاحتياطية القديمة (الاحتفاظ بآخر MAX_BACKUPS فقط)
 */
async function cleanOldBackups() {
  try {
    const files = await readdir(BACKUP_DIR);
    const backupFiles = files
      .filter(f => f.startsWith('backup-') && f.endsWith('.sql'))
      .map(f => ({
        name: f,
        path: path.join(BACKUP_DIR, f),
      }))
      .sort((a, b) => b.name.localeCompare(a.name)); // الترتيب من الأحدث للأقدم
    
    if (backupFiles.length > MAX_BACKUPS) {
      const filesToDelete = backupFiles.slice(MAX_BACKUPS);
      console.log(`🗑️  حذف ${filesToDelete.length} نسخة احتياطية قديمة...`);
      
      for (const file of filesToDelete) {
        await unlink(file.path);
        console.log(`   - حذف: ${file.name}`);
      }
    }
  } catch (error) {
    console.error('⚠️  فشل تنظيف النسخ القديمة:', error.message);
  }
}

/**
 * استعادة نسخة احتياطية
 */
async function restoreBackup(filename) {
  try {
    console.log(`🔄 بدء استعادة النسخة الاحتياطية: ${filename}`);
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL غير محدد في متغيرات البيئة');
    }
    
    const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL);
    const filepath = path.join(BACKUP_DIR, filename);
    
    if (!existsSync(filepath)) {
      throw new Error(`الملف غير موجود: ${filename}`);
    }
    
    // تنفيذ mysql restore
    const command = `mysql -h ${dbConfig.host} -P ${dbConfig.port} -u ${dbConfig.user} -p${dbConfig.password} ${dbConfig.database} < "${filepath}"`;
    
    await execAsync(command);
    
    console.log(`✅ تمت استعادة النسخة الاحتياطية بنجاح: ${filename}`);
    
    return {
      success: true,
      filename,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('❌ فشلت الاستعادة:', error.message);
    return {
      success: false,
      error: error.message,
      timestamp: new Date(),
    };
  }
}

/**
 * الحصول على قائمة النسخ الاحتياطية
 */
async function listBackups() {
  try {
    await ensureBackupDir();
    
    const files = await readdir(BACKUP_DIR);
    const backupFiles = files
      .filter(f => f.startsWith('backup-') && f.endsWith('.sql'))
      .map(f => {
        const filepath = path.join(BACKUP_DIR, f);
        // استخراج التاريخ من اسم الملف
        const timestampStr = f.replace('backup-', '').replace('.sql', '');
        const timestamp = timestampStr.replace(/-/g, ':').replace('T', ' ');
        
        return {
          filename: f,
          filepath,
          timestamp,
        };
      })
      .sort((a, b) => b.filename.localeCompare(a.filename));
    
    return backupFiles;
  } catch (error) {
    console.error('❌ فشل جلب قائمة النسخ:', error.message);
    return [];
  }
}

// تنفيذ النسخ الاحتياطي عند تشغيل السكريبت مباشرة
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const command = process.argv[2];
  
  if (command === 'restore' && process.argv[3]) {
    restoreBackup(process.argv[3]).then(result => {
      process.exit(result.success ? 0 : 1);
    });
  } else if (command === 'list') {
    listBackups().then(backups => {
      console.log('\n📋 النسخ الاحتياطية المتاحة:\n');
      if (backups.length === 0) {
        console.log('   لا توجد نسخ احتياطية');
      } else {
        backups.forEach((backup, index) => {
          console.log(`   ${index + 1}. ${backup.filename} (${backup.timestamp})`);
        });
      }
      console.log('');
    });
  } else {
    performBackup().then(result => {
      process.exit(result.success ? 0 : 1);
    });
  }
}

export { performBackup, restoreBackup, listBackups, cleanOldBackups };
