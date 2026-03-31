import sys
from PIL import Image

def remove_bg(input_path, output_path):
    # Open the image and convert it to RGBA
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    new_data = []
    for item in datas:
        # Change all white (also shades of light gray)
        # to transparent pixels
        r, g, b, a = item
        # Calculate how white the pixel is
        lightness = min(r, g, b)
        threshold = 230
        
        if lightness > threshold:
            # Calculate alpha to feather the edge
            # 255 lightness -> 0 alpha
            # 230 lightness -> 255 alpha
            alpha = int(255 - ((lightness - threshold) / (255 - threshold) * 255))
            new_data.append((r, g, b, alpha))
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(output_path, "PNG")

remove_bg("image.png", "public/logo.png")
print("Done processing image")
