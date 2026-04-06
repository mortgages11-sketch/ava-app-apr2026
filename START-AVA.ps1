# ============================================================
# AVA — One-Click Setup & Launch Script
# Run this from inside C:\facelessapp with:
#   Right-click → Run with PowerShell
# ============================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   AVA — Agent Video Assistant Setup    " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Kill any zombie Node processes
Write-Host "[1/4] Stopping any running Node processes..." -ForegroundColor Yellow
try {
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host "      Done." -ForegroundColor Green
} catch {
    Write-Host "      No Node processes found." -ForegroundColor Gray
}

# Step 2: Delete .next cache
Write-Host "[2/4] Clearing build cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "      .next folder deleted." -ForegroundColor Green
} else {
    Write-Host "      No cache found." -ForegroundColor Gray
}

# Step 3: Install dependencies
Write-Host "[3/4] Installing dependencies (this may take a minute)..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: npm install failed. Make sure Node.js is installed." -ForegroundColor Red
    Write-Host "Download Node.js from: https://nodejs.org" -ForegroundColor Red
    pause
    exit 1
}
Write-Host "      Dependencies installed." -ForegroundColor Green

# Step 4: Start dev server
Write-Host "[4/4] Starting AVA dev server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "  >> Open your browser to: http://localhost:3000 <<" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Press Ctrl+C to stop the server." -ForegroundColor Gray
Write-Host ""
npm run dev
