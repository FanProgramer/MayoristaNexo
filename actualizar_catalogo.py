from bs4 import BeautifulSoup
import json
import re

# Leer el HTML guardado manualmente
with open('catalogo_gamingcell.html', 'r', encoding='utf-8') as file:
    soup = BeautifulSoup(file, 'html.parser')

productos = []

for prod in soup.select('.card'):
    nombre_elem = prod.select_one('.card-title')
    precio_elem = prod.select_one('.precio')
    img_elem = prod.select_one('img')

    if nombre_elem and precio_elem and img_elem:
        nombre = nombre_elem.text.strip()
        precio_texto = precio_elem.text.strip()
        precio_num = float(re.sub(r'[^\d.]', '', precio_texto).replace('.', '').replace(',', '.'))
        precio_final = round(precio_num * 1.30)
        imagen = img_elem['src']

        productos.append({
            'nombre': nombre,
            'precio': precio_final,
            'imagen': imagen
        })

with open('productos.json', 'w', encoding='utf-8') as f:
    json.dump(productos, f, indent=2, ensure_ascii=False)

print("✅ Catálogo actualizado desde HTML local con 30% extra.")
