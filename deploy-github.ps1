# Script untuk deploy ke GitHub Pages
# Jalankan: .\deploy-github.ps1

Write-Host "🚀 Starting GitHub Pages Deployment..." -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "❌ Git repository not initialized!" -ForegroundColor Red
    Write-Host "Please run the following commands first:" -ForegroundColor Yellow
    Write-Host "  git init" -ForegroundColor White
    Write-Host "  git remote add origin https://github.com/USERNAME/REPO-NAME.git" -ForegroundColor White
    exit 1
}

# Check if remote exists
$remote = git remote -v 2>&1
if ($LASTEXITCODE -ne 0 -or $remote -eq "") {
    Write-Host "❌ No remote repository configured!" -ForegroundColor Red
    Write-Host "Please run:" -ForegroundColor Yellow
    Write-Host "  git remote add origin https://github.com/USERNAME/REPO-NAME.git" -ForegroundColor White
    exit 1
}

Write-Host "📦 Step 1: Installing dependencies..." -ForegroundColor Green
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🏗️  Step 2: Building project..." -ForegroundColor Green
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📝 Step 3: Committing changes..." -ForegroundColor Green
git add .
git commit -m "Deploy to GitHub Pages - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

Write-Host ""
Write-Host "☁️  Step 4: Pushing to GitHub..." -ForegroundColor Green
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Push failed! Trying 'master' branch..." -ForegroundColor Yellow
    git push origin master
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to push to GitHub!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "✅ Deployment initiated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Go to your GitHub repository" -ForegroundColor White
Write-Host "  2. Click on 'Actions' tab to monitor deployment" -ForegroundColor White
Write-Host "  3. Wait 2-5 minutes for deployment to complete" -ForegroundColor White
Write-Host "  4. Visit your site at: https://USERNAME.github.io/REPO-NAME/" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Done!" -ForegroundColor Green
