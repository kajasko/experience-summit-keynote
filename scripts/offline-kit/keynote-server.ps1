# Backup static server for the offline keynote (Windows PowerShell 5.1+ / pwsh 7). Explicit MIME types,
# URL-decoded paths (spaces, diacritics), no registry lookups. The single HTML file needs no server.
param([string]$Root = (Join-Path $PSScriptRoot 'Keynote_offline'), [int]$Port = 8765, [switch]$NoBrowser)
$ErrorActionPreference = 'Stop'
if (-not (Test-Path -LiteralPath $Root -PathType Container)) { Write-Host "Slozka Keynote_offline nenalezena. Rozbalte cely ZIP (Extrahovat vse)."; exit 1 }
$Root = (Resolve-Path -LiteralPath $Root).ProviderPath.TrimEnd('\', '/')
$mime = @{
  '.html'='text/html; charset=utf-8'; '.htm'='text/html; charset=utf-8'; '.js'='text/javascript; charset=utf-8'
  '.mjs'='text/javascript; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.json'='application/json; charset=utf-8'
  '.svg'='image/svg+xml'; '.png'='image/png'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.gif'='image/gif'
  '.webp'='image/webp'; '.avif'='image/avif'; '.ico'='image/x-icon'; '.woff2'='font/woff2'; '.woff'='font/woff'
  '.ttf'='font/ttf'; '.otf'='font/otf'; '.mp4'='video/mp4'; '.webm'='video/webm'; '.mp3'='audio/mpeg'
  '.txt'='text/plain; charset=utf-8'; '.md'='text/plain; charset=utf-8'
}
$listener = $null
for ($p = $Port; $p -lt $Port + 25; $p++) {
  $l = New-Object System.Net.HttpListener
  $l.Prefixes.Add("http://localhost:$p/")
  try { $l.Start(); $listener = $l; $Port = $p; break } catch { $l.Close() }
}
if (-not $listener) { Write-Host 'Nepodarilo se najit volny port.'; exit 1 }
$url = "http://localhost:$Port/index.html"
Write-Host "Prezentace bezi na $url"
Write-Host 'Toto okno nechte otevrene po celou dobu prezentace. Ukonceni: Ctrl+C.'
if (-not $NoBrowser) { Start-Process $url }
$sep = [System.IO.Path]::DirectorySeparatorChar
try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $res = $ctx.Response
    try {
      # AbsolutePath is percent-encoded UTF-8 (%20, %C4%8C ...); decode, then map to a local path.
      $rel = [System.Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
      if ($rel -eq '') { $rel = 'index.html' }
      $rel = $rel.Replace('/', $sep).Replace('\', $sep)
      $full = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($Root, $rel))
      if (Test-Path -LiteralPath $full -PathType Container) { $full = [System.IO.Path]::Combine($full, 'index.html') }
      $inside = $full.StartsWith($Root + $sep, [System.StringComparison]::OrdinalIgnoreCase)
      if (-not $inside -or -not (Test-Path -LiteralPath $full -PathType Leaf)) {
        $res.StatusCode = 404; $res.ContentType = 'text/plain; charset=utf-8'
        $b = [System.Text.Encoding]::UTF8.GetBytes('Not found')
      } else {
        $ext = [System.IO.Path]::GetExtension($full).ToLowerInvariant()
        $ct = $mime[$ext]; if (-not $ct) { $ct = 'application/octet-stream' }
        $res.ContentType = $ct
        $res.AddHeader('Cache-Control', 'no-cache')
        $b = [System.IO.File]::ReadAllBytes($full)
      }
      $res.ContentLength64 = $b.Length
      $res.OutputStream.Write($b, 0, $b.Length)
    } catch { try { $res.StatusCode = 500 } catch {} }
    finally { try { $res.OutputStream.Close() } catch {} }
  }
} finally { $listener.Stop(); $listener.Close() }
