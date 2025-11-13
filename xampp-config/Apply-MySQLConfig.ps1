# ============================================
# سكريبت تطبيق إعدادات MySQL المحسّنة
# ============================================
# الإصدار: 1.0
# التاريخ: 2025-01-13
# ============================================

# الألوان
$Green = "Green"
$Yellow = "Yellow"
$Red = "Red"
$Cyan = "Cyan"

# المسارات
$XamppPath = "C:\xampp"
$MySQLConfigPath = "$XamppPath\mysql\bin\my.ini"
$BackupPath = "$XamppPath\mysql\bin\my.ini.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
$NewConfigPath = "$PSScriptRoot\my.ini"

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
# البرنامج الرئيسي
# ============================================

Clear-Host

Write-Host @"

╔════════════════════════════════════════════════════════════╗
║                                                            ║
║        🔧 تطبيق إعدادات MySQL المحسّنة 🔧                ║
║                                                            ║
║              لنظام العباسي المحاسبي رقم 5                 ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

"@ -ForegroundColor $Cyan

# ============================================
# الخطوة 1: التحقق من وجود XAMPP
# ============================================
Write-Header "فحص XAMPP..."

if (-not (Test-Path $XamppPath)) {
    Write-ColorMessage "❌ XAMPP غير موجود في: $XamppPath" $Red
    Write-ColorMessage "الرجاء تثبيت XAMPP أولاً" $Yellow
    Write-ColorMessage "التحميل من: https://www.apachefriends.org" $Cyan
    pause
    exit 1
}

Write-ColorMessage "✅ XAMPP موجود" $Green

# ============================================
# الخطوة 2: التحقق من وجود ملف my.ini الجديد
# ============================================
Write-Header "فحص ملف الإعدادات الجديد..."

if (-not (Test-Path $NewConfigPath)) {
    Write-ColorMessage "❌ ملف my.ini الجديد غير موجود في: $NewConfigPath" $Red
    Write-ColorMessage "الرجاء التأكد من وجود الملف في نفس مجلد السكريبت" $Yellow
    pause
    exit 1
}

Write-ColorMessage "✅ ملف الإعدادات الجديد موجود" $Green

# ============================================
# الخطوة 3: إيقاف MySQL
# ============================================
Write-Header "إيقاف MySQL..."

$mysqlService = Get-Process -Name "mysqld" -ErrorAction SilentlyContinue

if ($mysqlService) {
    Write-ColorMessage "⏸️ إيقاف MySQL..." $Yellow
    
    try {
        # محاولة إيقاف MySQL بشكل نظيف
        & "$XamppPath\mysql\bin\mysqladmin.exe" -u root shutdown 2>$null
        Start-Sleep -Seconds 3
        
        # التحقق من الإيقاف
        $mysqlService = Get-Process -Name "mysqld" -ErrorAction SilentlyContinue
        if ($mysqlService) {
            Write-ColorMessage "⚠️ MySQL لا يزال يعمل، محاولة الإيقاف القسري..." $Yellow
            Stop-Process -Name "mysqld" -Force -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 2
        }
        
        Write-ColorMessage "✅ تم إيقاف MySQL" $Green
    } catch {
        Write-ColorMessage "⚠️ تحذير: قد تكون هناك مشكلة في إيقاف MySQL" $Yellow
    }
} else {
    Write-ColorMessage "✅ MySQL متوقف بالفعل" $Green
}

# ============================================
# الخطوة 4: نسخ احتياطي للملف القديم
# ============================================
Write-Header "إنشاء نسخة احتياطية..."

if (Test-Path $MySQLConfigPath) {
    try {
        Copy-Item -Path $MySQLConfigPath -Destination $BackupPath -Force
        Write-ColorMessage "✅ تم إنشاء نسخة احتياطية:" $Green
        Write-ColorMessage "   $BackupPath" "White"
    } catch {
        Write-ColorMessage "❌ فشل إنشاء النسخة الاحتياطية: $_" $Red
        pause
        exit 1
    }
} else {
    Write-ColorMessage "⚠️ ملف my.ini الأصلي غير موجود" $Yellow
}

# ============================================
# الخطوة 5: نسخ الملف الجديد
# ============================================
Write-Header "تطبيق الإعدادات الجديدة..."

try {
    Copy-Item -Path $NewConfigPath -Destination $MySQLConfigPath -Force
    Write-ColorMessage "✅ تم تطبيق الإعدادات الجديدة" $Green
} catch {
    Write-ColorMessage "❌ فشل تطبيق الإعدادات: $_" $Red
    
    # استعادة النسخة الاحتياطية
    if (Test-Path $BackupPath) {
        Write-ColorMessage "⏮️ استعادة النسخة الاحتياطية..." $Yellow
        Copy-Item -Path $BackupPath -Destination $MySQLConfigPath -Force
        Write-ColorMessage "✅ تم استعادة النسخة الاحتياطية" $Green
    }
    
    pause
    exit 1
}

# ============================================
# الخطوة 6: تشغيل MySQL
# ============================================
Write-Header "تشغيل MySQL..."

Write-ColorMessage "🚀 تشغيل MySQL..." $Yellow

try {
    # محاولة تشغيل MySQL
    Start-Process -FilePath "$XamppPath\mysql\bin\mysqld.exe" -WindowStyle Hidden
    Start-Sleep -Seconds 5
    
    # التحقق من التشغيل
    $mysqlService = Get-Process -Name "mysqld" -ErrorAction SilentlyContinue
    
    if ($mysqlService) {
        Write-ColorMessage "✅ MySQL يعمل الآن" $Green
    } else {
        Write-ColorMessage "⚠️ MySQL قد لا يكون يعمل بشكل صحيح" $Yellow
        Write-ColorMessage "الرجاء تشغيله يدوياً من XAMPP Control Panel" $Yellow
    }
} catch {
    Write-ColorMessage "⚠️ تحذير: قد تكون هناك مشكلة في تشغيل MySQL" $Yellow
    Write-ColorMessage "الرجاء تشغيله يدوياً من XAMPP Control Panel" $Yellow
}

# ============================================
# الخطوة 7: التحقق من الاتصال
# ============================================
Write-Header "التحقق من الاتصال..."

Start-Sleep -Seconds 3

try {
    $result = & "$XamppPath\mysql\bin\mysql.exe" -u root -e "SELECT VERSION();" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorMessage "✅ الاتصال بقاعدة البيانات ناجح" $Green
        Write-ColorMessage "   إصدار MySQL: $result" "White"
    } else {
        Write-ColorMessage "⚠️ قد تكون هناك مشكلة في الاتصال" $Yellow
    }
} catch {
    Write-ColorMessage "⚠️ لم يتم التحقق من الاتصال" $Yellow
}

# ============================================
# النتيجة النهائية
# ============================================

Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor $Green
Write-Host "║                                                            ║" -ForegroundColor $Green
Write-Host "║              ✅ اكتمل التطبيق بنجاح! 🎉                  ║" -ForegroundColor $Green
Write-Host "║                                                            ║" -ForegroundColor $Green
Write-Host "╠════════════════════════════════════════════════════════════╣" -ForegroundColor $Green
Write-Host "║                                                            ║" -ForegroundColor "White"
Write-Host "║  📁 الملف الجديد: $MySQLConfigPath" -ForegroundColor "White"
Write-Host "║  💾 النسخة الاحتياطية: $BackupPath" -ForegroundColor "White"
Write-Host "║                                                            ║" -ForegroundColor "White"
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor $Green

Write-ColorMessage "📊 الإعدادات المطبقة:" $Cyan
Write-ColorMessage "   • UTF-8 (utf8mb4) كترميز افتراضي" "White"
Write-ColorMessage "   • innodb_buffer_pool_size = 256M" "White"
Write-ColorMessage "   • query_cache_size = 32M" "White"
Write-ColorMessage "   • max_connections = 100" "White"
Write-ColorMessage "   • sql_mode = '' (معطل للتطوير)" "White"
Write-ColorMessage "   • slow_query_log = مفعّل" "White"
Write-ColorMessage ""

Write-ColorMessage "💡 نصائح:" $Cyan
Write-ColorMessage "   1. راقب استخدام الذاكرة بعد التطبيق" "White"
Write-ColorMessage "   2. يمكنك زيادة innodb_buffer_pool_size حسب ذاكرة جهازك" "White"
Write-ColorMessage "   3. للإنتاج، فعّل sql_mode الصارم" "White"
Write-ColorMessage "   4. راجع سجل الأخطاء: $XamppPath\mysql\data\mysql_error.log" "White"
Write-ColorMessage ""

Write-ColorMessage "🔄 لاستعادة الإعدادات القديمة:" $Yellow
Write-ColorMessage "   Copy-Item '$BackupPath' '$MySQLConfigPath' -Force" "White"
Write-ColorMessage "   ثم أعد تشغيل MySQL" "White"
Write-ColorMessage ""

pause
