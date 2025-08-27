param([int]$Port=5173)
Add-Type -AssemblyName System.Net.HttpListener
$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Servidor em http://localhost:$Port (CTRL+C para parar)"
$root = (Get-Location).Path
$mime = @{
  ".html"="text/html"; ".htm"="text/html"; ".css"="text/css"; ".js"="application/javascript";
  ".json"="application/json"; ".svg"="image/svg+xml"; ".ico"="image/x-icon"; ".webmanifest"="application/manifest+json"
}
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  try {
    $p = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/'))
    if ([string]::IsNullOrWhiteSpace($p)) { $p = "index.html" }
    $path = Join-Path $root $p
    if (-not (Test-Path $path)) { $ctx.Response.StatusCode = 404; $ctx.Response.Close(); continue }
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $ext = ([IO.Path]::GetExtension($path)).ToLower()
    $ctx.Response.ContentType = $mime[$ext]; if (-not $ctx.Response.ContentType) { $ctx.Response.ContentType = "application/octet-stream" }
    $ctx.Response.ContentLength64 = $bytes.Length
    $ctx.Response.OutputStream.Write($bytes,0,$bytes.Length)
    $ctx.Response.OutputStream.Close()
  } catch { $ctx.Response.StatusCode = 500; $ctx.Response.Close() }
}
