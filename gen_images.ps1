Add-Type -AssemblyName System.Drawing

$dir = 'c:\Users\taday\WebServices\BaconPixelEditor\image'
$src = New-Object System.Drawing.Bitmap("$dir\BaconPixelEditor_icon.png")

# ─── FAVICON 512x512 ───────────────────────────────────────────────────────
$fav = New-Object System.Drawing.Bitmap 512, 512
$gf  = [System.Drawing.Graphics]::FromImage($fav)
$gf.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$gf.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
$gf.Clear([System.Drawing.Color]::FromArgb(26, 26, 26))
$pad = 20
$gf.DrawImage($src, $pad, $pad, 512-2*$pad, 512-2*$pad)
$gf.Dispose()
$fav.Save("$dir\favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$fav.Dispose()
Write-Host "favicon.png saved"

# ─── OGP 1200x600 ──────────────────────────────────────────────────────────
$ogp = New-Object System.Drawing.Bitmap 1200, 600
$g   = [System.Drawing.Graphics]::FromImage($ogp)
$g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# Background
$g.Clear([System.Drawing.Color]::FromArgb(30, 30, 30))

# Orange top/bottom stripes
$orange = [System.Drawing.Color]::FromArgb(242, 160, 32)
$brushO = New-Object System.Drawing.SolidBrush($orange)
$g.FillRectangle($brushO, 0, 0, 1200, 8)
$g.FillRectangle($brushO, 0, 592, 1200, 8)

# Right: bacon icon — crop black padding (80% width, 70% height, centered)
$srcW   = $src.Width;  $srcH = $src.Height
$cropX  = [int]($srcW * 0.04);  $cropY = [int]($srcH * 0.12)
$cropW  = [int]($srcW * 0.92);  $cropH = [int]($srcH * 0.76)
$srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)

$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
$dstW = 430
$dstH = [int](430.0 * $cropH / $cropW)
$dstX = 1200 - $dstW - 80
$dstY = (600 - $dstH) / 2
$dstRect = New-Object System.Drawing.Rectangle($dstX, $dstY, $dstW, $dstH)
$g.DrawImage($src, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

# Vertical separator line (subtle)
$g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$penSep = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(60, 242, 160, 32), 2)
$g.DrawLine($penSep, 640, 30, 640, 570)

# Title
$titleFace = 'Impact'
$fontTitle  = New-Object System.Drawing.Font($titleFace, 56, [System.Drawing.FontStyle]::Regular)
$brushTitle = New-Object System.Drawing.SolidBrush($orange)
$g.DrawString("BaconPixelEditor", $fontTitle, $brushTitle, [float]52, [float]178)

# Tagline
$fontSub  = New-Object System.Drawing.Font("Segoe UI", 26, [System.Drawing.FontStyle]::Regular)
$brushSub = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(188, 188, 188))
$g.DrawString("Free browser-based pixel art editor", $fontSub, $brushSub, 55, 310)

# Pixel art indicator tags
$fontTag  = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Regular)
$brushTag = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(100, 242, 160, 32))
$tagBg    = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(50, 242, 160, 32))
$tags     = @("Pixel Art", "Animation", "PNG / GIF")
$tx = 56; $ty = 390
foreach ($tag in $tags) {
    $sz = $g.MeasureString($tag, $fontTag)
    $rx = [float]$tx; $ry = [float]$ty
    $rw = [float]($sz.Width + 12); $rh = [float]($sz.Height + 6)
    $bx = [float]($tx - 6); $by = [float]($ty - 3)
    $rct = New-Object System.Drawing.RectangleF($bx, $by, $rw, $rh)
    $g.FillRectangle($tagBg, $rct)
    $g.DrawString($tag, $fontTag, $brushSub, $rx, $ry)
    $tx = [int]($tx + $sz.Width + 24)
}

# URL
$fontUrl  = New-Object System.Drawing.Font("Segoe UI", 20, [System.Drawing.FontStyle]::Regular)
$brushUrl = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(110, 175, 215))
$g.DrawString("baconpixeleditor.com", $fontUrl, $brushUrl, 56, 508)

$g.Dispose()
$ogp.Save("$dir\ogp.png", [System.Drawing.Imaging.ImageFormat]::Png)
$ogp.Dispose()
$src.Dispose()
Write-Host "ogp.png saved"
