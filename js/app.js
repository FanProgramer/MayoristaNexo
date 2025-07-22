let carrito = [];

function normalizarTexto(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function filtrarProductos() {
  const filtro = normalizarTexto(document.getElementById("buscador").value);
  const productos = document.querySelectorAll(".producto");
  productos.forEach((prod) => {
    const texto = normalizarTexto(prod.innerText);
    prod.style.display = texto.includes(filtro) ? "" : "none";
  });
}

// ✅ AGREGADO: ahora acepta ID de color opcional
function agregarAlCarrito(nombre, precio, cantidadId, stock, colorId = null) {
  const cantidadInput = document.getElementById(cantidadId);
  let cantidad = parseInt(cantidadInput.value);
  let color = "";

  // Si hay selección de color
  if (colorId) {
    const colorSelect = document.getElementById(colorId);
    if (colorSelect) {
      color = colorSelect.value;
    }
  }

  if (isNaN(cantidad) || cantidad < 1) {
    alert("Por favor, ingresa una cantidad válida.");
    return;
  }

  if (cantidad > stock) {
    alert(`No hay suficiente stock. Solo quedan ${stock} unidades disponibles.`);
    cantidadInput.value = stock;
    cantidad = stock;
    return;
  }

  // Busca el producto exacto, con color incluido si existe
  const productoExistente = carrito.find(
    (item) => item.nombre === nombre && item.color === color
  );

  if (productoExistente) {
    const nuevaCantidad = productoExistente.cantidad + cantidad;
    if (nuevaCantidad > stock) {
      alert(`No hay suficiente stock para sumar esa cantidad. Stock máximo: ${stock}`);
      return;
    }
    productoExistente.cantidad = nuevaCantidad;
  } else {
    carrito.push({ nombre, precio, cantidad, color });
  }

  alert(`${cantidad} x ${nombre}${color ? " - Color: " + color : ""} agregado al carrito.`);
}

function mostrarPedido() {
  const modal = document.getElementById("modalPedido");
  const lista = document.getElementById("listaDetallePedido");
  const totalSpan = document.getElementById("totalPedido");
  lista.innerHTML = "";
  let total = 0;

  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    const li = document.createElement("li");
    li.innerHTML = `<b>${item.nombre}</b>${item.color ? " - Color: <strong>" + item.color + "</strong>" : ""} — Cantidad: 
    <input type="number" min="1" value="${item.cantidad}" onchange="modificarCantidad(${index}, this.value)"> — Precio unitario: $${item.precio} — Subtotal: $${subtotal}
    <button onclick="eliminarProducto(${index})">Eliminar</button>`;
    lista.appendChild(li);
  });

  totalSpan.textContent = total;
  modal.style.display = "flex";
}

function cerrarPedido() {
  document.getElementById("modalPedido").style.display = "none";
}

function modificarCantidad(index, nuevaCantidad) {
  nuevaCantidad = parseInt(nuevaCantidad);
  if (isNaN(nuevaCantidad) || nuevaCantidad < 1) return alert("Cantidad inválida");
  carrito[index].cantidad = nuevaCantidad;
  mostrarPedido();
}

function eliminarProducto(index) {
  carrito.splice(index, 1);
  mostrarPedido();
}

function enviarPorWhatsapp() {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  let mensaje = "¡Hola! Quiero hacer el siguiente pedido mayorista:%0A";
  let total = 0;

  carrito.forEach((item) => {
    mensaje += `${item.cantidad} x ${item.nombre}${item.color ? " - Color: " + item.color : ""} - $${item.precio * item.cantidad}%0A`;
    total += item.precio * item.cantidad;
  });

  mensaje += `%0ATotal: $${total}`;

  const numero = "5491128980818"; // Tu número
  const url = `https://wa.me/${numero}?text=${mensaje}`;
  window.open(url, "_blank");
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.ver-pedido-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      mostrarPedido();
    });
  });
});

