# Convert Butterfly Image to Favicon

To use the butterfly image as your favicon:

1. Save the butterfly image as `butterfly.png` in the `/static` folder
2. Run this command (requires ImageMagick or use an online converter):

```bash
# Using ImageMagick (install with: brew install imagemagick on Mac)
cd static

# Create favicon.ico (16x16, 32x32, 48x48 sizes)
convert butterfly.png -resize 16x16 favicon-16x16.png
convert butterfly.png -resize 32x32 favicon-32x32.png
convert butterfly.png -define icon:auto-resize=16,32,48 favicon.ico

# Create apple touch icons
convert butterfly.png -resize 180x180 apple-touch-icon.png
convert butterfly.png -resize 180x180 apple-touch-icon-precomposed.png

# Create Android Chrome icons
convert butterfly.png -resize 192x192 android-chrome-192x192.png
convert butterfly.png -resize 512x512 android-chrome-512x512.png
```

Or use an online tool like:
- https://realfavicongenerator.net/
- Upload your butterfly image and download all favicon formats

Then replace the files in `/static` folder.

