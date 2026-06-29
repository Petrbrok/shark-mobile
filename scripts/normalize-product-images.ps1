param(
  [string]$InputDir = "public/assets/catalog",
  [string]$OutputDir = "public/assets/catalog-normalized",
  [string]$Pattern = "*",
  [int]$Limit = 0,
  [int]$CanvasSize = 1000,
  [int]$Padding = 90,
  [int]$WhiteThreshold = 248,
  [int]$ScanStep = 3,
  [string]$ManifestPath = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies "System.Drawing" -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class ProductImageBounds
{
    public static int[] Find(Bitmap source, int threshold, int step)
    {
        step = Math.Max(1, step);
        using (var bitmap = new Bitmap(source.Width, source.Height, PixelFormat.Format32bppArgb))
        using (var g = Graphics.FromImage(bitmap))
        {
            g.DrawImage(source, 0, 0, source.Width, source.Height);
            var rect = new Rectangle(0, 0, bitmap.Width, bitmap.Height);
            var data = bitmap.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
            try
            {
                int stride = data.Stride;
                int bytesCount = Math.Abs(stride) * bitmap.Height;
                byte[] bytes = new byte[bytesCount];
                Marshal.Copy(data.Scan0, bytes, 0, bytesCount);

                int minX = bitmap.Width;
                int minY = bitmap.Height;
                int maxX = -1;
                int maxY = -1;

                for (int y = 0; y < bitmap.Height; y += step)
                {
                    int row = y * stride;
                    for (int x = 0; x < bitmap.Width; x += step)
                    {
                        int offset = row + (x * 4);
                        byte b = bytes[offset + 0];
                        byte gch = bytes[offset + 1];
                        byte r = bytes[offset + 2];
                        byte a = bytes[offset + 3];
                        bool content = a >= 12 && !(r >= threshold && gch >= threshold && b >= threshold);
                        if (!content) continue;
                        if (x < minX) minX = x;
                        if (y < minY) minY = y;
                        if (x > maxX) maxX = x;
                        if (y > maxY) maxY = y;
                    }
                }

                if (maxX < 0 || maxY < 0) return new int[] { 0, 0, bitmap.Width, bitmap.Height };

                int expand = step + 2;
                minX = Math.Max(0, minX - expand);
                minY = Math.Max(0, minY - expand);
                maxX = Math.Min(bitmap.Width - 1, maxX + expand);
                maxY = Math.Min(bitmap.Height - 1, maxY + expand);
                return new int[] { minX, minY, Math.Max(1, maxX - minX + 1), Math.Max(1, maxY - minY + 1) };
            }
            finally
            {
                bitmap.UnlockBits(data);
            }
        }
    }
}
"@

function Get-SourceFiles {
  if ($ManifestPath) {
    $manifest = Get-Content -Raw -LiteralPath $ManifestPath | ConvertFrom-Json
    return @($manifest | ForEach-Object {
      $relative = [string]($_.imageUrl -replace "^/", "")
      $candidate = Join-Path (Get-Location) $relative
      if (-not (Test-Path -LiteralPath $candidate)) {
        $candidate = Join-Path (Get-Location) (Join-Path "public" $relative)
      }
      [pscustomobject]@{
        Name = $_.name
        Sku = $_.sku
        SourcePath = $candidate
      }
    })
  }

  $files = Get-ChildItem -LiteralPath $InputDir -File |
    Where-Object { $_.Name -like $Pattern -and $_.Extension -match "^\.(jpg|jpeg|png|webp)$" } |
    Sort-Object Name

  if ($Limit -gt 0) {
    $files = $files | Select-Object -First $Limit
  }

  return @($files | ForEach-Object {
    [pscustomobject]@{
      Name = $_.BaseName
      Sku = $_.BaseName
      SourcePath = $_.FullName
    }
  })
}

function Test-ContentPixel {
  param([System.Drawing.Color]$Color, [int]$Threshold)
  if ($Color.A -lt 12) { return $false }
  return -not ($Color.R -ge $Threshold -and $Color.G -ge $Threshold -and $Color.B -ge $Threshold)
}

function Get-ContentBounds {
  param([System.Drawing.Bitmap]$Bitmap, [int]$Threshold, [int]$Step)
  $bounds = [ProductImageBounds]::Find($Bitmap, $Threshold, $Step)
  return [System.Drawing.Rectangle]::new($bounds[0], $bounds[1], $bounds[2], $bounds[3])
}

function Save-Jpeg {
  param([System.Drawing.Bitmap]$Bitmap, [string]$Path)
  $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
  $params = [System.Drawing.Imaging.EncoderParameters]::new(1)
  $params.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [int64]92)
  $Bitmap.Save($Path, $codec, $params)
}

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

$safeSize = [Math]::Max(1, $CanvasSize - ($Padding * 2))
$results = @()
$sources = Get-SourceFiles
if ($Limit -gt 0 -and -not $ManifestPath) {
  $sources = $sources | Select-Object -First $Limit
}

foreach ($source in $sources) {
  if (-not (Test-Path -LiteralPath $source.SourcePath)) {
    Write-Warning "Missing source: $($source.SourcePath)"
    continue
  }

  $original = [System.Drawing.Bitmap]::new($source.SourcePath)
  try {
    $bounds = Get-ContentBounds $original $WhiteThreshold $ScanStep
    $scale = [Math]::Min($safeSize / $bounds.Width, $safeSize / $bounds.Height)
    $targetW = [Math]::Max(1, [int][Math]::Round($bounds.Width * $scale))
    $targetH = [Math]::Max(1, [int][Math]::Round($bounds.Height * $scale))
    $targetX = [int][Math]::Round(($CanvasSize - $targetW) / 2)
    $targetY = [int][Math]::Round(($CanvasSize - $targetH) / 2)

    $canvas = [System.Drawing.Bitmap]::new($CanvasSize, $CanvasSize, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    try {
      $graphics = [System.Drawing.Graphics]::FromImage($canvas)
      try {
        $graphics.Clear([System.Drawing.Color]::White)
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.DrawImage($original, [System.Drawing.Rectangle]::new($targetX, $targetY, $targetW, $targetH), $bounds, [System.Drawing.GraphicsUnit]::Pixel)
      } finally {
        $graphics.Dispose()
      }

      $baseName = [IO.Path]::GetFileNameWithoutExtension($source.SourcePath)
      $outputName = "$baseName.normalized.jpg"
      $outputPath = Join-Path $OutputDir $outputName
      Save-Jpeg $canvas $outputPath

      $results += [pscustomobject]@{
        name = $source.Name
        sku = $source.Sku
        source = $source.SourcePath
        output = $outputPath
        crop = @{ x = $bounds.X; y = $bounds.Y; width = $bounds.Width; height = $bounds.Height }
        canvas = $CanvasSize
        padding = $Padding
      }
    } finally {
      $canvas.Dispose()
    }
  } finally {
    $original.Dispose()
  }
}

$results | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $OutputDir "manifest.json") -Encoding UTF8
Write-Host "Normalized $($results.Count) images -> $OutputDir"
