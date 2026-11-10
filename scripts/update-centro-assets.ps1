Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
public class CentroAssets {
 public static void SaveLogo(Bitmap original, string path, int markWidth) {
 int scaledWidth=(int)Math.Round(markWidth*0.7);
 int height=(int)Math.Round(original.Height*0.7);
 using(var result=new Bitmap(original.Width-markWidth+scaledWidth,height))
 using(var graphics=Graphics.FromImage(result)) {
 graphics.InterpolationMode=System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
 graphics.DrawImage(original,new Rectangle(0,0,scaledWidth,height),new Rectangle(0,0,markWidth,original.Height),GraphicsUnit.Pixel);
 graphics.DrawImage(original,new Rectangle(scaledWidth,0,original.Width-markWidth,height),new Rectangle(markWidth,(original.Height-height)/2,original.Width-markWidth,height),GraphicsUnit.Pixel);
 result.Save(path,ImageFormat.Png);
 }
 }
 public static void Make(string source,string folder) {
 using(var src=new Bitmap(source)) {
 int l=src.Width,t=src.Height,r=0,b=0,br=0;
 for(int y=0;y<src.Height;y++)for(int x=0;x<src.Width;x++) {var c=src.GetPixel(x,y); if(Math.Min(c.R,Math.Min(c.G,c.B))<220){l=Math.Min(l,x);t=Math.Min(t,y);r=Math.Max(r,x);b=Math.Max(b,y);if(c.B>c.R+2)br=Math.Max(br,x);}}
 using(var full=new Bitmap(r-l+1,b-t+1))using(var dark=new Bitmap(r-l+1,b-t+1))using(var icon=new Bitmap(br-l+1,b-t+1)) {
 for(int y=t;y<=b;y++)for(int x=l;x<=r;x++) {
 var c=src.GetPixel(x,y); int alpha=255-Math.Min(c.R,Math.Min(c.G,c.B));
 if(alpha<5)continue;
 int red=Math.Max(0,255-(255-c.R)*255/alpha),green=Math.Max(0,255-(255-c.G)*255/alpha),blue=Math.Max(0,255-(255-c.B)*255/alpha);
 var pixel=Color.FromArgb(alpha,red,green,blue);
 full.SetPixel(x-l,y-t,pixel);
 dark.SetPixel(x-l,y-t,x>br?Color.FromArgb(alpha,255,255,255):pixel);
 if(x<=br)icon.SetPixel(x-l,y-t,pixel);
 }
 SaveLogo(full,folder+"/logo-light.png",br-l+3); SaveLogo(dark,folder+"/logo-dark.png",br-l+3);
 foreach(var name in new[]{"logo-icon.png","logo-icon-light.png","logo-icon-dark.png","favicon.png"})icon.Save(folder+"/"+name,ImageFormat.Png);
 }
 Console.WriteLine("Artwork bounds: "+l+","+t+" to "+r+","+b+"; mark right: "+br);
 }
 }
}
"@
[CentroAssets]::Make((Join-Path $PSScriptRoot 'branding/centro-source.png'), (Join-Path (Get-Location) 'src/assets/images/logos'))
Copy-Item src/assets/images/logos/favicon.png public/favicon.png
$bitmap = New-Object System.Drawing.Bitmap('public/favicon.png')
$small = New-Object System.Drawing.Bitmap(64,64)
$graphics=[System.Drawing.Graphics]::FromImage($small)
$graphics.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.DrawImage($bitmap,4,0,56,64)
$stream=New-Object System.IO.MemoryStream
$small.Save($stream,[System.Drawing.Imaging.ImageFormat]::Png)
$data=$stream.ToArray()
$file=[System.IO.File]::Create((Join-Path (Get-Location) 'public/favicon.ico'))
$writer=New-Object System.IO.BinaryWriter($file)
$writer.Write([uint16]0); $writer.Write([uint16]1); $writer.Write([uint16]1)
$writer.Write([byte]64); $writer.Write([byte]64); $writer.Write([byte]0); $writer.Write([byte]0)
$writer.Write([uint16]1); $writer.Write([uint16]32); $writer.Write([uint32]$data.Length); $writer.Write([uint32]22); $writer.Write($data)
$writer.Dispose(); $stream.Dispose(); $graphics.Dispose(); $small.Dispose(); $bitmap.Dispose()


