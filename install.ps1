Get-ChildItem -Directory | ForEach-Object { 
    if (Test-Path (Join-Path $_.FullName "package.json")) {
        Set-Location $_.FullName
        npm install
    }
}