# 📘 دليل التثبيت اليدوي - نظام العباسي رقم 5

> **دليل خطوة بخطوة للتثبيت اليدوي على Windows 10**

---

## 📋 المتطلبات الأساسية

قبل البدء، تأكد من توفر:

1. ✅ **Windows 10** أو أحدث
2. ✅ **XAMPP** مثبت (MySQL)
3. ✅ **اتصال بالإنترنت**
4. ✅ **صلاحيات المسؤول** (Administrator)

---

## 🎯 الخطوات (12 خطوة)

### الخطوة 1️⃣: إنشاء مجلد المشروع

**افتح PowerShell كمسؤول** ونفذ:

```powershell
New-Item -ItemType Directory -Path "D:\AAAAAA\alabasi-5" -Force
```

**النتيجة المتوقعة:**
```
Directory: D:\AAAAAA

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        1/13/2025   10:00 AM                alabasi-5
```

---

### الخطوة 2️⃣: فحص Git

```powershell
git --version
```

**إذا ظهرت:** `git version 2.x.x` → **انتقل للخطوة 4**

**إذا ظهر خطأ:** → **نفذ الخطوة 3**

---

### الخطوة 3️⃣: تثبيت Git (إذا لم يكن موجوداً)

```powershell
# تحميل المثبت
$gitUrl = "https://github.com/git-for-windows/git/releases/download/v2.43.0.windows.1/Git-2.43.0-64-bit.exe"
$gitPath = "$env:TEMP\git-installer.exe"
Invoke-WebRequest -Uri $gitUrl -OutFile $gitPath

# تثبيت Git
Start-Process -FilePath $gitPath -ArgumentList "/VERYSILENT /NORESTART" -Wait

# تحديث PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

**انتظر 1-2 دقيقة**، ثم **أعد تشغيل PowerShell** وتحقق:

```powershell
git --version
```

---

### الخطوة 4️⃣: فحص Node.js

```powershell
node --version
```

**إذا ظهرت:** `v18.x.x` أو `v20.x.x` أو `v22.x.x` → **انتقل للخطوة 6**

**إذا ظهر خطأ:** → **نفذ الخطوة 5**

---

### الخطوة 5️⃣: تثبيت Node.js (إذا لم يكن موجوداً)

```powershell
# تحميل المثبت
$nodeUrl = "https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi"
$nodePath = "$env:TEMP\node-installer.msi"
Invoke-WebRequest -Uri $nodeUrl -OutFile $nodePath

# تثبيت Node.js
Start-Process msiexec.exe -ArgumentList "/i `"$nodePath`" /quiet /norestart" -Wait

# تحديث PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

**انتظر 1-2 دقيقة**، ثم **أعد تشغيل PowerShell** وتحقق:

```powershell
node --version
npm --version
```

---

### الخطوة 6️⃣: تثبيت pnpm

```powershell
npm install -g pnpm
```

**انتظر حتى تنتهي**، ثم تحقق:

```powershell
pnpm --version
```

**النتيجة المتوقعة:** `9.x.x` أو أحدث

---

### الخطوة 7️⃣: تحميل المشروع

1. افتح **لوحة التحكم** (Management UI) في المتصفح
2. اضغط على **[Code]** في القائمة اليمنى
3. اضغط على **[Download All Files]**
4. سيتم تحميل ملف `accounting-system.zip`
5. **فك الضغط** مباشرة في المجلد: `D:\AAAAAA\alabasi-5`

**⚠️ مهم جداً:** يجب أن يكون الملف `package.json` موجود في:
```
D:\AAAAAA\alabasi-5\package.json
```

**تحقق:**

```powershell
Test-Path "D:\AAAAAA\alabasi-5\package.json"
```

**يجب أن تظهر:** `True`

---

### الخطوة 8️⃣: تثبيت حزم المشروع

```powershell
cd D:\AAAAAA\alabasi-5
pnpm install
```

**⏱️ الوقت المتوقع:** 2-3 دقائق

**النتيجة المتوقعة:**
```
Packages: +XXX
++++++++++++++++++++++++++++++++++++++++++
Progress: resolved XXX, reused XXX, downloaded X, added XXX, done
```

---

### الخطوة 9️⃣: تشغيل MySQL

1. افتح **XAMPP Control Panel**
2. اضغط **Start** بجانب **MySQL**
3. انتظر حتى يصبح لون الخلفية **أخضر**

**أو من PowerShell:**

```powershell
# فتح XAMPP Control Panel
Start-Process "C:\xampp\xampp-control.exe"
```

**تحقق من تشغيل MySQL:**

```powershell
Get-Process mysqld -ErrorAction SilentlyContinue
```

**إذا ظهرت معلومات العملية** → **MySQL يعمل** ✅

---

### الخطوة 🔟: إنشاء ملف .env

```powershell
cd D:\AAAAAA\alabasi-5

@"
DATABASE_URL=mysql://root@localhost:3306/alabasi_system_5
PORT=3000
NODE_ENV=development
"@ | Out-File .env -Encoding UTF8
```

**تحقق:**

```powershell
Get-Content .env
```

**النتيجة المتوقعة:**
```
DATABASE_URL=mysql://root@localhost:3306/alabasi_system_5
PORT=3000
NODE_ENV=development
```

---

### الخطوة 1️⃣1️⃣: إنشاء قاعدة البيانات وتطبيق التغييرات

```powershell
# إنشاء قاعدة البيانات
& "C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS alabasi_system_5 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"

# تطبيق التغييرات (إنشاء الجداول)
pnpm db:push

# إضافة البيانات التجريبية (80+ سجل)
pnpm db:seed
```

**النتيجة المتوقعة:**
```
✅ قاعدة البيانات alabasi_system_5 جاهزة
✅ تم تطبيق التغييرات (18 جدول)
✅ تم إضافة البيانات التجريبية (80+ سجل)
```

---

### الخطوة 1️⃣2️⃣: تشغيل النظام

```powershell
pnpm dev
```

**النتيجة المتوقعة:**
```
Server running on http://localhost:3000/
```

**افتح المتصفح:**
```
http://localhost:3000
```

---

## ✅ قائمة التحقق النهائية

- [ ] Git مثبت (`git --version` يعمل)
- [ ] Node.js مثبت (`node --version` يعمل)
- [ ] pnpm مثبت (`pnpm --version` يعمل)
- [ ] المشروع في `D:\AAAAAA\alabasi-5\package.json`
- [ ] MySQL يعمل (XAMPP Control Panel → MySQL → أخضر)
- [ ] ملف `.env` موجود
- [ ] قاعدة البيانات `alabasi_system_5` موجودة
- [ ] البيانات التجريبية مضافة (80+ سجل)
- [ ] النظام يعمل على `http://localhost:3000`

---

## 🔧 حل المشاكل الشائعة

### 1. "المنفذ 3000 مستخدم"

**الحل:**

```powershell
# إيجاد العملية
netstat -ano | findstr :3000

# إنهاء العملية (استبدل <PID> برقم العملية)
taskkill /PID <PID> /F
```

**أو استخدم منفذ آخر:**

```powershell
# عدّل .env
@"
DATABASE_URL=mysql://root@localhost:3306/alabasi_system_5
PORT=3001
NODE_ENV=development
"@ | Out-File .env -Encoding UTF8 -Force
```

---

### 2. "خطأ في الاتصال بـ MySQL"

**الأسباب المحتملة:**

1. MySQL غير مشغّل
2. كلمة مرور MySQL غير صحيحة

**الحل:**

```powershell
# تشغيل MySQL
net start MySQL80

# أو من XAMPP Control Panel
Start-Process "C:\xampp\xampp-control.exe"
```

**إذا كان MySQL يحتاج كلمة مرور:**

```powershell
# عدّل DATABASE_URL في .env
DATABASE_URL=mysql://root:PASSWORD@localhost:3306/alabasi_system_5
```

---

### 3. "pnpm: command not found"

**الحل:**

```powershell
# أعد تثبيت pnpm
npm install -g pnpm

# أعد تشغيل PowerShell
```

---

### 4. "البيانات التجريبية لم تُضف"

**الحل:**

```powershell
cd D:\AAAAAA\alabasi-5
pnpm db:seed
```

---

## 📊 البيانات التجريبية المضافة

| النوع | العدد | التفاصيل |
|-------|-------|----------|
| عملات | 3 | ريال، دولار، يورو |
| فروع | 2 | رئيسي، الرياض |
| حسابات | 30+ | دليل حسابات كامل |
| حسابات تحليلية | 9 | صناديق، بنوك، عملاء، موردين |
| قيود يومية | 10 | افتتاحي، مبيعات، مشتريات، رواتب |
| سندات قبض | 5 | إجمالي 93,000 ر.س |
| سندات صرف | 5 | إجمالي 74,000 ر.س |
| موظفين | 3 | رواتب مختلفة |
| منتجات | 3 | مخزون |

**إجمالي:** 80+ سجل جاهز للاستخدام الفوري!

---

## 🚀 الخطوات التالية

1. ✅ استكشف الصفحة الرئيسية
2. ✅ راجع دليل الحسابات
3. ✅ جرّب إنشاء قيد يومي
4. ✅ جرّب إنشاء سند قبض/صرف
5. ✅ استكشف التقارير المالية
6. ✅ جرّب المساعد الذكي

---

## 📞 الدعم الفني

إذا واجهت أي مشكلة:

1. راجع قسم **حل المشاكل الشائعة** أعلاه
2. راجع ملف `INSTALLATION_GUIDE.md` للدليل المصور
3. راجع ملف `SEED_DATA.md` لتفاصيل البيانات التجريبية

---

**🎉 مبروك! نظام العباسي رقم 5 جاهز للاستخدام!**
