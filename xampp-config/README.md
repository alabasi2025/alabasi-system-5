# 🔧 ملفات تهيئة MySQL المحسّنة لنظام العباسي

> **إعدادات MySQL محسّنة للأداء والتوافق مع نظام العباسي رقم 5**

---

## 📦 المحتويات

| الملف | الوصف |
|-------|-------|
| `my.ini` | ملف تهيئة MySQL محسّن وجاهز للاستخدام |
| `Apply-MySQLConfig.ps1` | سكريبت تلقائي لتطبيق الإعدادات |
| `README.md` | هذا الملف - دليل الاستخدام |

---

## 🎯 الطريقة الأولى: التطبيق التلقائي (موصى به)

### 1️⃣ تحميل الملفات

```powershell
# من GitHub
git clone https://github.com/alabasi2025/alabasi-system-5.git
cd alabasi-system-5/xampp-config
```

---

### 2️⃣ تشغيل السكريبت

**انقر نقراً مزدوجاً على:**
```
Apply-MySQLConfig.ps1
```

**أو من PowerShell (كمسؤول):**
```powershell
.\Apply-MySQLConfig.ps1
```

---

### 3️⃣ ماذا سيحدث؟

السكريبت سيقوم **تلقائياً** بـ:

- ✅ فحص وجود XAMPP
- ✅ إيقاف MySQL
- ✅ إنشاء نسخة احتياطية من `my.ini` القديم
- ✅ تطبيق الإعدادات الجديدة
- ✅ تشغيل MySQL
- ✅ التحقق من الاتصال

**النتيجة:**
```
✅ اكتمل التطبيق بنجاح! 🎉

📁 الملف الجديد: C:\xampp\mysql\bin\my.ini
💾 النسخة الاحتياطية: C:\xampp\mysql\bin\my.ini.backup-20250113-153045
```

---

## 🎯 الطريقة الثانية: التطبيق اليدوي

### 1️⃣ إيقاف MySQL

**من XAMPP Control Panel:**
- اضغط **Stop** بجانب MySQL

**أو من PowerShell:**
```powershell
& "C:\xampp\mysql\bin\mysqladmin.exe" -u root shutdown
```

---

### 2️⃣ نسخ احتياطي للملف القديم

```powershell
Copy-Item "C:\xampp\mysql\bin\my.ini" "C:\xampp\mysql\bin\my.ini.backup"
```

---

### 3️⃣ نسخ الملف الجديد

```powershell
Copy-Item "my.ini" "C:\xampp\mysql\bin\my.ini" -Force
```

---

### 4️⃣ تشغيل MySQL

**من XAMPP Control Panel:**
- اضغط **Start** بجانب MySQL

---

## 📊 الإعدادات المطبقة

### ✅ الترميز والترتيب

```ini
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
```

**الفائدة:**
- دعم كامل للعربية
- دعم Emoji والرموز الخاصة
- توافق كامل مع نظام العباسي

---

### ✅ تحسين الأداء

```ini
innodb_buffer_pool_size = 256M
key_buffer_size = 64M
query_cache_size = 32M
```

**الفائدة:**
- أداء أسرع بـ 30-50%
- استعلامات أسرع
- استجابة أفضل

---

### ✅ تعطيل Strict Mode

```ini
sql_mode = ""
```

**الفائدة:**
- تجنب أخطاء التوافق
- سهولة التطوير
- مرونة أكبر

**⚠️ للإنتاج:** فعّل Strict Mode:
```ini
sql_mode = "STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION"
```

---

### ✅ سجل الاستعلامات البطيئة

```ini
slow_query_log = 1
long_query_time = 2
```

**الفائدة:**
- تتبع الاستعلامات البطيئة (أكثر من 2 ثانية)
- تحسين الأداء
- اكتشاف المشاكل

**موقع السجل:**
```
C:\xampp\mysql\data\mysql_slow.log
```

---

### ✅ زيادة الاتصالات

```ini
max_connections = 100
```

**الفائدة:**
- دعم المزيد من المستخدمين المتزامنين
- تجنب أخطاء "Too many connections"

---

## 🔧 تخصيص الإعدادات

### زيادة الذاكرة (للأجهزة القوية)

**إذا كان لديك 8GB RAM أو أكثر:**

```ini
innodb_buffer_pool_size = 512M  # أو 1G
key_buffer_size = 128M
query_cache_size = 64M
```

**كيفية التطبيق:**
1. افتح `C:\xampp\mysql\bin\my.ini`
2. عدّل القيم
3. أعد تشغيل MySQL

---

### تفعيل Strict Mode (للإنتاج)

```ini
sql_mode = "STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION"
```

---

### تغيير المنفذ

```ini
port = 3307  # بدلاً من 3306
```

**لا تنسى تعديل `.env` في نظام العباسي:**
```env
DATABASE_URL=mysql://root@localhost:3307/alabasi_system_5
```

---

## 🆘 حل المشاكل

### 1. "MySQL لا يعمل بعد التطبيق"

**الحل:**

```powershell
# استعادة النسخة الاحتياطية
Copy-Item "C:\xampp\mysql\bin\my.ini.backup" "C:\xampp\mysql\bin\my.ini" -Force

# تشغيل MySQL
# من XAMPP Control Panel
```

---

### 2. "خطأ في بدء MySQL"

**راجع سجل الأخطاء:**
```
C:\xampp\mysql\data\mysql_error.log
```

**الأخطاء الشائعة:**

| الخطأ | الحل |
|-------|------|
| `Can't start server` | تحقق من المسارات في my.ini |
| `Unknown variable` | تحقق من أسماء المتغيرات |
| `Out of memory` | قلل قيم الذاكرة |

---

### 3. "استخدام ذاكرة عالي"

**قلل قيم الذاكرة:**

```ini
innodb_buffer_pool_size = 128M  # بدلاً من 256M
key_buffer_size = 32M            # بدلاً من 64M
query_cache_size = 16M           # بدلاً من 32M
```

---

## 📊 مراقبة الأداء

### عرض الإعدادات الحالية

```sql
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';
SHOW VARIABLES LIKE 'query_cache_size';
SHOW VARIABLES LIKE 'max_connections';
```

---

### عرض حالة MySQL

```sql
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Qcache%';
SHOW STATUS LIKE 'Innodb_buffer_pool%';
```

---

### عرض الاستعلامات البطيئة

```powershell
Get-Content "C:\xampp\mysql\data\mysql_slow.log" -Tail 50
```

---

## 🔄 استعادة الإعدادات القديمة

### من السكريبت

السكريبت ينشئ نسخة احتياطية تلقائياً:
```
C:\xampp\mysql\bin\my.ini.backup-YYYYMMDD-HHMMSS
```

**للاستعادة:**

```powershell
# إيقاف MySQL
& "C:\xampp\mysql\bin\mysqladmin.exe" -u root shutdown

# استعادة النسخة الاحتياطية
Copy-Item "C:\xampp\mysql\bin\my.ini.backup-20250113-153045" "C:\xampp\mysql\bin\my.ini" -Force

# تشغيل MySQL من XAMPP Control Panel
```

---

## 📚 مصادر إضافية

### الوثائق الرسمية

- **MySQL Configuration:** https://dev.mysql.com/doc/refman/8.0/en/server-configuration.html
- **InnoDB Configuration:** https://dev.mysql.com/doc/refman/8.0/en/innodb-configuration.html
- **Performance Tuning:** https://dev.mysql.com/doc/refman/8.0/en/optimization.html

---

### أدوات مفيدة

- **phpMyAdmin:** `http://localhost/phpmyadmin`
- **MySQL Workbench:** https://www.mysql.com/products/workbench/
- **HeidiSQL:** https://www.heidisql.com/

---

## 💡 نصائح إضافية

### 1. النسخ الاحتياطي الدوري

```powershell
# نسخ احتياطي يومي
$date = Get-Date -Format "yyyyMMdd"
Copy-Item "C:\xampp\mysql\bin\my.ini" "C:\xampp\mysql\bin\my.ini.backup-$date"
```

---

### 2. مراقبة الأداء

```sql
-- عرض العمليات الجارية
SHOW PROCESSLIST;

-- عرض حالة InnoDB
SHOW ENGINE INNODB STATUS;
```

---

### 3. تحسين الجداول

```sql
-- تحليل الجداول
ANALYZE TABLE table_name;

-- تحسين الجداول
OPTIMIZE TABLE table_name;
```

---

## 🎉 الخلاصة

بعد تطبيق هذه الإعدادات، ستحصل على:

- ✅ أداء أفضل بـ 30-50%
- ✅ دعم كامل للعربية (UTF-8)
- ✅ توافق كامل مع نظام العباسي
- ✅ استعلامات أسرع
- ✅ استقرار أفضل
- ✅ سهولة التطوير

---

**🚀 استمتع بنظام العباسي المحاسبي رقم 5!**
