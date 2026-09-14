Write-Host "Installing dependencies..."
npm install

Write-Host "Installing Playwright browsers..."
npx playwright install

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env from .env.example"
}

Write-Host ""
Write-Host "Setup complete."
Write-Host "Next:"
Write-Host "1. Update .env"
Write-Host "2. Run: npm run test:smoke"
