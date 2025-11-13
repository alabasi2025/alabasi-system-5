@echo off
chcp 65001 >nul
title مثبت نظام العباسي رقم 5

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║          🚀 مثبت نظام العباسي المحاسبي رقم 5 🚀          ║
echo ║                                                            ║
echo ║              تثبيت تلقائي 100%% - بنقرة واحدة              ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📋 جاري بدء التثبيت...
echo.

REM تشغيل سكريبت PowerShell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Install-Alabasi5.ps1"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ التثبيت مكتمل!
) else (
    echo.
    echo ❌ حدث خطأ أثناء التثبيت
    echo الرجاء التحقق من الرسائل أعلاه
)

echo.
pause
