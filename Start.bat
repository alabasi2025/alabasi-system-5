@echo off
title Alabasi Accounting System 5
color 0A

echo.
echo ========================================
echo   Alabasi Accounting System 5
echo ========================================
echo.
echo Starting server...
echo.

cd /d "%~dp0"
pnpm dev:win

pause
