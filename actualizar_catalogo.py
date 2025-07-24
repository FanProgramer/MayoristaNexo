import requests
from bs4 import BeautifulSoup
import json
import re

# URL y clave
url = 'https://gamingcell.com.ar/catalogo2022x3.php'
clave = {'clave': 'gaming'}

# Iniciar sesión con la clave
s = requests.Session()
r = s.post(url, data=clave)
soup = BeautifulSoup(r.text, 'html.parser')

productos = []

# Buscar tarjetas de producto
for prod in soup.select('.card'):
    nombre_elem = prod.select_one('.card-title')
    precio_elem = prod.select_one('.precio')
    img_elem = prod.select_one('img')

    if nombre_elem and precio_elem and img_elem:
        nombre = nombre_elem.text.strip()
        
        # Extraer número del precio (ej: "$ 10.000" => 10000)
        precio_texto = precio_elem.text.strip()
        precio_num = float(re.sub(r'[^\d.]', '', precio_texto).replace('.', '').replace(',', '.'))
        precio_final = round(precio_num * 1.30)  # +30%

        imagen = img_elem['src']
        productos.append({
            'nombre': nombre,
            'precio': precio_final,
            'imagen': imagen
        })

# Guardar como productos.json
with open('productos.json', 'w', encoding='utf-8') as f:
    json.dump(productos, f, indent=2, ensure_ascii=False)

print("Catálogo actualizado.")
