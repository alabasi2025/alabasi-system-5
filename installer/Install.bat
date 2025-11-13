@echo off
chcp 65001 >nul
title نظام العباسي رقم 5 - التثبيت / Al-Abasi System 5 - Installation

:: التحقق من صلاحيات المسؤول
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo.
    echo ╔══════════════════════════════════════════════════════════════╗
    echo ║                                                              ║
    echo ║          يرجى تشغيل البرنامج كمسؤول!                        ║
    echo ║       Please run as Administrator!                          ║
    echo ║                                                              ║
    echo ╚══════════════════════════════════════════════════════════════╝
    echo.
    pause
    exit /b 1
)

:: تشغيل المثبت PowerShell
powershell.exe -ExecutionPolicy Bypass -File "%~dp0Install-AccountingSystem.ps1"

pause
