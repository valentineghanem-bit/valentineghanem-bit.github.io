$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
npx --yes tailwindcss@3.4.17 `
  -c (Join-Path $root 'tailwind.config.cjs') `
  -i (Join-Path $root 'assets/css/tailwind-input.css') `
  -o (Join-Path $root 'assets/css/tailwind.generated.css') `
  --minify
