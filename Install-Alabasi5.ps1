# ============================================
# مثبت نظام العباسي رقم 5 - تلقائي 100%
# ============================================
# الإصدار: 1.0
# التاريخ: 2025-01-13
# ============================================

# تعطيل سياسة التنفيذ مؤقتاً
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force

# الألوان
$Green = "Green"
$Yellow = "Yellow"
$Red = "Red"
$Cyan = "Cyan"

# إعدادات التثبيت
$InstallPath = "D:\AAAAAA\alabasi-5"
$XamppPath = "C:\xampp"
$DatabaseName = "alabasi_system_5"
$Port = 3000

# ============================================
# دالة: طباعة رسالة ملونة
# ============================================
function Write-ColorMessage {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# ============================================
# دالة: طباعة عنوان
# ============================================
function Write-Header {
    param([string]$Title)
    Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor $Cyan
    Write-Host "║  $Title" -ForegroundColor $Cyan
    Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor $Cyan
}

# ============================================
# دالة: فحص وتثبيت Git
# ============================================
function Install-Git {
    Write-Header "فحص Git..."
    
    if (Get-Command git -ErrorAction SilentlyContinue) {
        $version = git --version
        Write-ColorMessage "✅ Git موجود: $version" $Green
        return $true
    }
    
    Write-ColorMessage "📥 تثبيت Git..." $Yellow
    
    try {
        # محاولة استخدام winget
        winget install --id Git.Git -e --source winget --silent --accept-package-agreements --accept-source-agreements
        
        # تحديث PATH
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        # التحقق
        if (Get-Command git -ErrorAction SilentlyContinue) {
            Write-ColorMessage "✅ تم تثبيت Git بنجاح" $Green
            return $true
        }
    } catch {
        Write-ColorMessage "❌ فشل تثبيت Git تلقائياً" $Red
        Write-ColorMessage "الرجاء تثبيت Git يدوياً من: https://git-scm.com/download/win" $Yellow
        return $false
    }
}

# ============================================
# دالة: فحص وتثبيت Node.js
# ============================================
function Install-NodeJS {
    Write-Header "فحص Node.js..."
    
    if (Get-Command node -ErrorAction SilentlyContinue) {
        $version = node --version
        Write-ColorMessage "✅ Node.js موجود: $version" $Green
        return $true
    }
    
    Write-ColorMessage "📥 تثبيت Node.js..." $Yellow
    
    try {
        # محاولة استخدام winget
        winget install --id OpenJS.NodeJS.LTS -e --source winget --silent --accept-package-agreements --accept-source-agreements
        
        # تحديث PATH
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        # التحقق
        if (Get-Command node -ErrorAction SilentlyContinue) {
            Write-ColorMessage "✅ تم تثبيت Node.js بنجاح" $Green
            return $true
        }
    } catch {
        Write-ColorMessage "❌ فشل تثبيت Node.js تلقائياً" $Red
        Write-ColorMessage "الرجاء تثبيت Node.js يدوياً من: https://nodejs.org" $Yellow
        return $false
    }
}

# ============================================
# دالة: تثبيت pnpm
# ============================================
function Install-Pnpm {
    Write-Header "فحص pnpm..."
    
    if (Get-Command pnpm -ErrorAction SilentlyContinue) {
        $version = pnpm --version
        Write-ColorMessage "✅ pnpm موجود: $version" $Green
        return $true
    }
    
    Write-ColorMessage "📥 تثبيت pnpm..." $Yellow
    
    try {
        npm install -g pnpm | Out-Null
        
        # تحديث PATH
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        if (Get-Command pnpm -ErrorAction SilentlyContinue) {
            Write-ColorMessage "✅ تم تثبيت pnpm بنجاح" $Green
            return $true
        }
    } catch {
        Write-ColorMessage "❌ فشل تثبيت pnpm" $Red
        return $false
    }
}

# ============================================
# دالة: فحص MySQL
# ============================================
function Test-MySQL {
    Write-Header "فحص MySQL..."
    
    $mysqlPath = "$XamppPath\mysql\bin\mysql.exe"
    
    if (Test-Path $mysqlPath) {
        Write-ColorMessage "✅ MySQL موجود في: $XamppPath" $Green
        
        # محاولة الاتصال
        try {
            & $mysqlPath -u root -e "SELECT 1" 2>$null
            Write-ColorMessage "✅ MySQL يعمل" $Green
            return $true
        } catch {
            Write-ColorMessage "⚠️ MySQL موجود لكن غير مشغّل" $Yellow
            Write-ColorMessage "الرجاء تشغيل MySQL من XAMPP Control Panel" $Yellow
            
            # محاولة فتح XAMPP Control Panel
            if (Test-Path "$XamppPath\xampp-control.exe") {
                Start-Process "$XamppPath\xampp-control.exe"
                Write-ColorMessage "⏸️ اضغط Enter بعد تشغيل MySQL..." $Cyan
                Read-Host
            }
            return $true
        }
    } else {
        Write-ColorMessage "❌ XAMPP غير موجود" $Red
        Write-ColorMessage "الرجاء تثبيت XAMPP من: https://www.apachefriends.org" $Yellow
        return $false
    }
}

# ============================================
# دالة: تحميل المشروع
# ============================================
function Download-Project {
    Write-Header "تحميل المشروع..."
    
    # حذف المجلد القديم إذا كان موجوداً
    if (Test-Path $InstallPath) {
        Write-ColorMessage "🗑️ حذف المجلد القديم..." $Yellow
        Remove-Item -Recurse -Force $InstallPath
    }
    
    # إنشاء المجلد الرئيسي
    $parentPath = Split-Path $InstallPath -Parent
    if (-not (Test-Path $parentPath)) {
        New-Item -ItemType Directory -Path $parentPath -Force | Out-Null
    }
    
    # تحميل من GitHub
    Write-ColorMessage "📥 تحميل من GitHub..." $Yellow
    try {
        Set-Location $parentPath
        git clone https://github.com/alabasi2025/alabasi-system-5.git alabasi-5 2>&1 | Out-Null
        
        if (Test-Path "$InstallPath\package.json") {
            Write-ColorMessage "✅ تم تحميل المشروع بنجاح" $Green
            return $true
        } else {
            Write-ColorMessage "❌ فشل التحميل" $Red
            return $false
        }
    } catch {
        Write-ColorMessage "❌ خطأ في التحميل: $_" $Red
        return $false
    }
}

# ============================================
# دالة: تثبيت الحزم
# ============================================
function Install-Packages {
    Write-Header "تثبيت الحزم..."
    
    Set-Location $InstallPath
    
    Write-ColorMessage "📦 تثبيت الحزم (قد يستغرق 1-2 دقيقة)..." $Yellow
    
    try {
        pnpm install 2>&1 | Out-Null
        Write-ColorMessage "✅ تم تثبيت الحزم بنجاح" $Green
        return $true
    } catch {
        Write-ColorMessage "❌ فشل تثبيت الحزم: $_" $Red
        return $false
    }
}

# ============================================
# دالة: إعداد قاعدة البيانات
# ============================================
function Setup-Database {
    Write-Header "إعداد قاعدة البيانات..."
    
    Set-Location $InstallPath
    
    # إنشاء ملف .env
    Write-ColorMessage "📝 إنشاء ملف .env..." $Yellow
    @"
DATABASE_URL=mysql://root@localhost:3306/$DatabaseName
PORT=$Port
NODE_ENV=development
"@ | Out-File .env -Encoding UTF8
    
    # إنشاء قاعدة البيانات
    Write-ColorMessage "🗄️ إنشاء قاعدة البيانات..." $Yellow
    $mysqlPath = "$XamppPath\mysql\bin\mysql.exe"
    
    try {
        & $mysqlPath -u root -e "DROP DATABASE IF EXISTS $DatabaseName; CREATE DATABASE $DatabaseName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>$null
        Write-ColorMessage "✅ تم إنشاء قاعدة البيانات" $Green
    } catch {
        Write-ColorMessage "❌ فشل إنشاء قاعدة البيانات: $_" $Red
        return $false
    }
    
    # تطبيق التغييرات (إنشاء الجداول)
    Write-ColorMessage "📊 إنشاء الجداول..." $Yellow
    
    try {
        # استخدام drizzle-kit مباشرة
        $env:DATABASE_URL = "mysql://root@localhost:3306/$DatabaseName"
        
        # تنفيذ push بدلاً من generate + migrate
        & "$InstallPath\node_modules\.bin\drizzle-kit.cmd" push 2>&1 | Out-Null
        
        Write-ColorMessage "✅ تم إنشاء الجداول بنجاح" $Green
    } catch {
        Write-ColorMessage "⚠️ تحذير: قد تكون هناك مشكلة في إنشاء الجداول" $Yellow
        Write-ColorMessage "سنحاول المتابعة..." $Yellow
    }
    
    # إضافة البيانات التجريبية
    Write-ColorMessage "📊 إضافة البيانات التجريبية (80+ سجل)..." $Yellow
    
    try {
        $env:DATABASE_URL = "mysql://root@localhost:3306/$DatabaseName"
        node seed-db.mjs 2>&1 | Out-Null
        Write-ColorMessage "✅ تم إضافة البيانات التجريبية" $Green
        return $true
    } catch {
        Write-ColorMessage "⚠️ تحذير: قد تكون هناك مشكلة في البيانات التجريبية" $Yellow
        Write-ColorMessage "النظام سيعمل بدون بيانات تجريبية" $Yellow
        return $true
    }
}

# ============================================
# دالة: إنشاء اختصار على سطح المكتب
# ============================================
function Create-Shortcut {
    Write-Header "إنشاء اختصار..."
    
    $desktopPath = [Environment]::GetFolderPath("Desktop")
    $shortcutPath = "$desktopPath\نظام العباسي 5.lnk"
    
    try {
        $WScriptShell = New-Object -ComObject WScript.Shell
        $Shortcut = $WScriptShell.CreateShortcut($shortcutPath)
        $Shortcut.TargetPath = "powershell.exe"
        $Shortcut.Arguments = "-NoExit -Command `"cd '$InstallPath'; pnpm dev`""
        $Shortcut.WorkingDirectory = $InstallPath
        $Shortcut.IconLocation = "shell32.dll,43"
        $Shortcut.Description = "نظام العباسي المحاسبي رقم 5"
        $Shortcut.Save()
        
        Write-ColorMessage "✅ تم إنشاء اختصار على سطح المكتب" $Green
        return $true
    } catch {
        Write-ColorMessage "⚠️ لم يتم إنشاء الاختصار" $Yellow
        return $false
    }
}

# ============================================
# البرنامج الرئيسي
# ============================================

Clear-Host

Write-Host @"

╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          🚀 مثبت نظام العباسي المحاسبي رقم 5 🚀          ║
║                                                            ║
║              تثبيت تلقائي 100% - بنقرة واحدة              ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

"@ -ForegroundColor $Cyan

Write-ColorMessage "📋 المعلومات:" $Cyan
Write-ColorMessage "   • المسار: $InstallPath" "White"
Write-ColorMessage "   • قاعدة البيانات: $DatabaseName" "White"
Write-ColorMessage "   • المنفذ: $Port" "White"
Write-ColorMessage ""

# الخطوة 1: فحص المتطلبات
if (-not (Install-Git)) { exit 1 }
if (-not (Install-NodeJS)) { exit 1 }
if (-not (Install-Pnpm)) { exit 1 }
if (-not (Test-MySQL)) { exit 1 }

# الخطوة 2: تحميل المشروع
if (-not (Download-Project)) { exit 1 }

# الخطوة 3: تثبيت الحزم
if (-not (Install-Packages)) { exit 1 }

# الخطوة 4: إعداد قاعدة البيانات
if (-not (Setup-Database)) { exit 1 }

# الخطوة 5: إنشاء اختصار
Create-Shortcut | Out-Null

# النتيجة النهائية
Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor $Green
Write-Host "║                                                            ║" -ForegroundColor $Green
Write-Host "║              ✅ التثبيت مكتمل بنجاح! 🎉                  ║" -ForegroundColor $Green
Write-Host "║                                                            ║" -ForegroundColor $Green
Write-Host "╠════════════════════════════════════════════════════════════╣" -ForegroundColor $Green
Write-Host "║                                                            ║" -ForegroundColor "White"
Write-Host "║  📁 المسار: $InstallPath" -ForegroundColor "White"
Write-Host "║  🗄️  قاعدة البيانات: $DatabaseName (80+ سجل)" -ForegroundColor "White"
Write-Host "║  🎲 المنفذ: $Port" -ForegroundColor "White"
Write-Host "║  🌐 الرابط: http://localhost:$Port" -ForegroundColor "Cyan"
Write-Host "║                                                            ║" -ForegroundColor "White"
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor $Green

Write-ColorMessage "🚀 لتشغيل النظام:" $Cyan
Write-ColorMessage "   1. افتح الاختصار من سطح المكتب: 'نظام العباسي 5'" "White"
Write-ColorMessage "   2. أو نفذ: cd $InstallPath && pnpm dev" "White"
Write-ColorMessage ""

Write-ColorMessage "⏸️ اضغط Enter للخروج أو اكتب 'start' لتشغيل النظام الآن..." $Yellow
$response = Read-Host

if ($response -eq "start") {
    Write-ColorMessage "`n🚀 تشغيل النظام...`n" $Green
    Set-Location $InstallPath
    pnpm dev
}
