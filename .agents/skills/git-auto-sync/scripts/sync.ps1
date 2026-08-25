param (
    [string]$Message = ""
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "🚀 Calamus Portal Git Auto Push Starting..." -ForegroundColor Cyan
Write-Host "🎯 Target: https://github.com/changwoojung7-sys/calamus-portal.git (main)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Check Status
Write-Host "[1/4] Checking Git Status..." -ForegroundColor Yellow
git status

# 2. Stage Changes
Write-Host "[2/4] Staging All Changes (git add .)..." -ForegroundColor Yellow
git add .

# 3. Commit
if ([string]::IsNullOrWhiteSpace($Message)) {
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    $Message = "Feat: Update Calamus Portal source code ($Timestamp)"
}

Write-Host "[3/4] Committing Changes with message: '$Message'..." -ForegroundColor Yellow
git commit -m "$Message"

# 4. Push
Write-Host "[4/4] Pushing to Remote origin main..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "✅ Git Push Successfully Completed!" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
} else {
    Write-Host "==========================================" -ForegroundColor Red
    Write-Host "❌ Git Push Failed. Please check git credentials or conflict." -ForegroundColor Red
    Write-Host "==========================================" -ForegroundColor Red
    exit 1
}
