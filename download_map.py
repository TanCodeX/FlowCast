import os
import requests
from PIL import Image
from io import BytesIO
import math

def deg2num(lat_deg, lon_deg, zoom):
  lat_rad = math.radians(lat_deg)
  n = 2.0 ** zoom
  xtile = int((lon_deg + 180.0) / 360.0 * n)
  ytile = int((1.0 - math.asinh(math.tan(lat_rad)) / math.pi) / 2.0 * n)
  return (xtile, ytile)

# India Gate, Delhi
lat = 28.6129
lon = 77.2295
z = 14

center_x, center_y = deg2num(lat, lon, z)

# We want a grid of tiles (e.g. 5x3 for a wide map)
cols = 6
rows = 4
start_x = center_x - cols // 2
start_y = center_y - rows // 2

result = Image.new("RGB", (256 * cols, 256 * rows))
url_template = "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"

for i in range(cols):
    for j in range(rows):
        x = start_x + i
        y = start_y + j
        url = url_template.format(z=z, x=x, y=y)
        print(f"Downloading {url}...")
        res = requests.get(url, headers={"User-Agent": "FlowCast/1.0"})
        if res.status_code == 200:
            img = Image.open(BytesIO(res.content))
            result.paste(img, (i * 256, j * 256))
        else:
            print(f"Failed to download {url}")

result.save("/Users/nodesagar/Documents/Experiments/Taanav Alert/FlowCast/public/map-bg.png")
print("Saved map to public/map-bg.png")
