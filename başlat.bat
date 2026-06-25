@echo off
chcp 65001 >nul
title Kenan Baskan - Proje Baslatici
cd /d "%~dp0"

echo ========================================
echo   Kenan Baskan Projesi Baslatiliyor...
echo ========================================
echo.

REM node_modules yoksa bagimliliklari yukle
if not exist "node_modules" (
    echo [1/2] Bagimliliklar yukleniyor, lutfen bekleyin...
    call npm install
    if errorlevel 1 (
        echo.
        echo HATA: npm install basarisiz oldu.
        pause
        exit /b 1
    )
    echo.
)

echo [2/2] Gelistirme sunucusu baslatiliyor...
echo.
echo Tarayicida acmak icin: http://localhost:3000
echo Durdurmak icin bu pencereyi kapatin veya CTRL+C yapin.
echo.

call npm run dev

pause
