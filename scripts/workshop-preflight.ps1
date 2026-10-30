param(
  [string]$RepoUrl = "https://github.com/tinocoh/ghcp-agentic-demo-public.git",
  [switch]$Force
)

$ErrorActionPreference = "Stop"

Write-Host "=== PRE-FLIGHT WORKSHOP GHCP APP ===" -ForegroundColor Cyan

if (-not (Test-Path ".git")) {
  throw "Ejecuta este script desde la raiz del repositorio clonado."
}

$dirty = git status --porcelain
if ($dirty -and -not $Force) {
  throw "Hay cambios locales sin commit. Guarda/commitea o usa -Force."
}

Write-Host "`n1) Sincronizando copia local..." -ForegroundColor Yellow
git fetch $RepoUrl main
git checkout -B main FETCH_HEAD
git clean -fd

Write-Host "`n2) Validando toolchain..." -ForegroundColor Yellow
npm run typecheck
npm run lint
npm test

Write-Host "`n3) Confirmando ejercicios disponibles..." -ForegroundColor Yellow
$required = @(
  "ejercicios\\a-promociones.md",
  "ejercicios\\b-recoleccion.md",
  "ejercicios\\c-zona-fronteriza.md",
  "ejercicios\\d-openapi.md"
)

$missing = @()
foreach ($f in $required) {
  if (-not (Test-Path $f)) { $missing += $f }
}

if ($missing.Count -gt 0) {
  throw "Faltan archivos de ejercicios: $($missing -join ', ')"
}

Write-Host "`nOK: entorno listo para la sesion." -ForegroundColor Green
