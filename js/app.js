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

function agregarAlCarrito(nombre, precio, cantidadId, stock) {
  const cantidadInput = document.getElementById(cantidadId);
  let cantidad = parseInt(cantidadInput.value);

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

  const productoExistente = carrito.find((item) => item.nombre === nombre);
  if (productoExistente) {
    const nuevaCantidad = productoExistente.cantidad + cantidad;
    if (nuevaCantidad > stock) {
      alert(`No hay suficiente stock para sumar esa cantidad. Stock máximo: ${stock}`);
      return;
    }
    productoExistente.cantidad = nuevaCantidad;
  } else {
    carrito.push({ nombre, precio, cantidad });
  }

  alert(`${cantidad} x ${nombre} agregado al carrito.`);
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
    li.innerHTML = `<b>${item.nombre}</b> — Cantidad: <input type="number" min="1" value="${item.cantidad}" onchange="modificarCantidad(${index}, this.value)"> — Precio unitario: $${item.precio} — Subtotal: $${subtotal}
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
    mensaje += `${item.cantidad} x ${item.nombre} - $${item.precio * item.cantidad}%0A`;
    total += item.precio * item.cantidad;
  });

  mensaje += `%0ATotal: $${total}`;

  const numero = "5491128980818"; // Poner tu número acá (con código país, sin + ni espacios)
  const url = `https://wa.me/${numero}?text=${mensaje}`;
  window.open(url, "_blank");
}
