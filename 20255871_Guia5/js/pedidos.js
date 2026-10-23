let pedidos = [];

const formularioPedido = document.querySelector("#idFormularioPedido");
const inputProducto = document.querySelector("#idProducto");
const inputPrecio = document.querySelector("#idPrecio");
const inputCantidad = document.querySelector("#idCantidad");
const inputPrecioMaximo = document.querySelector("#idPrecioMaximo");

const btnAgregar = document.querySelector("#idBtnAgregar");
const btnFiltrar = document.querySelector("#idBtnFiltrar");
const btnMostrarTodos = document.querySelector("#idBtnMostrarTodos");
const btnLimpiar = document.querySelector("#idBtnLimpiar");

const cuerpoTabla = document.querySelector("#idTablaPedidos");
const spanTotalUnidades = document.querySelector("#idTotalUnidades");
const spanMontoTotal = document.querySelector("#idMontoTotal");
const contenedorAlerta = document.querySelector("#idAlerta");

function validarDatosPedido(producto, precioTexto, cantidadTexto) {
  const nombreLimpio = producto.trim();
  const precio = parseFloat(precioTexto);
  const cantidad = Number(cantidadTexto);

  if (nombreLimpio === "") {
    return "El nombre del producto no puede estar vacío.";
  }

  if (precioTexto.trim() === "" || isNaN(precio) || precio <= 0) {
    return "El precio unitario debe ser mayor a cero.";
  }

  if (cantidadTexto.trim() === "" || isNaN(cantidad) || !Number.isInteger(cantidad) || cantidad <= 0) {
    return "La cantidad debe ser un número entero positivo.";
  }

  return "";
}

function crearPedido(producto, precio, cantidad) {
  return {
    producto: producto.trim(),
    precio: parseFloat(precio),
    cantidad: parseInt(cantidad, 10)
  };
}

function obtenerPedidosConSubtotal(listaPedidos) {
  return listaPedidos.map(pedido => ({
    producto: pedido.producto,
    precio: pedido.precio,
    cantidad: pedido.cantidad,
    subtotal: pedido.precio * pedido.cantidad
  }));
}

function calcularTotalUnidades(listaPedidos) {
  return listaPedidos.reduce((acumulador, pedido) => acumulador + pedido.cantidad, 0);
}

function calcularMontoTotal(listaPedidos) {
  return listaPedidos.reduce((acumulador, pedido) => acumulador + (pedido.precio * pedido.cantidad), 0);
}

function filtrarPedidosPorPrecio(listaPedidos, precioMaximo) {
  return listaPedidos.filter(pedido => pedido.precio <= precioMaximo);
}

function mostrarAlerta(mensaje) {
  if (mensaje === "") {
    contenedorAlerta.innerHTML = "";
    return;
  }
  contenedorAlerta.innerHTML = `<div class="alert alert-danger" role="alert">${mensaje}</div>`;
}

function renderizarTabla(listaPedidos) {
  const pedidosTransformados = obtenerPedidosConSubtotal(listaPedidos);

  if (pedidosTransformados.length === 0) {
    cuerpoTabla.innerHTML = `<tr><td colspan="4" class="text-center">No hay pedidos para mostrar</td></tr>`;
    return;
  }

  const filasHTML = pedidosTransformados.map(pedido => `
    <tr>
      <td>${pedido.producto}</td>
      <td>$${pedido.precio.toFixed(2)}</td>
      <td>${pedido.cantidad}</td>
      <td>$${pedido.subtotal.toFixed(2)}</td>
    </tr>
  `).join("");

  cuerpoTabla.innerHTML = filasHTML;
}

function actualizarIndicadores(listaPedidos) {
  const totalUnidades = calcularTotalUnidades(listaPedidos);
  const montoTotal = calcularMontoTotal(listaPedidos);

  spanTotalUnidades.textContent = totalUnidades;
  spanMontoTotal.textContent = `$${montoTotal.toFixed(2)}`;
}

function actualizarVista(listaPedidos) {
  renderizarTabla(listaPedidos);
  actualizarIndicadores(listaPedidos);
}

function limpiarCamposFormulario() {
  inputProducto.value = "";
  inputPrecio.value = "";
  inputCantidad.value = "";
  inputProducto.focus();
}

function manejarAgregarPedido(evento) {
  evento.preventDefault();

  const error = validarDatosPedido(
    inputProducto.value,
    inputPrecio.value,
    inputCantidad.value
  );

  if (error !== "") {
    mostrarAlerta(error);
    return;
  }

  mostrarAlerta("");
  const nuevoPedido = crearPedido(
    inputProducto.value,
    inputPrecio.value,
    inputCantidad.value
  );

  pedidos.push(nuevoPedido);
  actualizarVista(pedidos);
  limpiarCamposFormulario();
}

function manejarFiltrarProductos() {
  const valorMaximoTexto = inputPrecioMaximo.value.trim();
  const precioMaximo = parseFloat(valorMaximoTexto);

  if (valorMaximoTexto === "" || isNaN(precioMaximo) || precioMaximo <= 0) {
    mostrarAlerta("Ingrese un precio máximo válido mayor a cero para filtrar.");
    return;
  }

  mostrarAlerta("");
  const pedidosFiltrados = filtrarPedidosPorPrecio(pedidos, precioMaximo);
  renderizarTabla(pedidosFiltrados);
}

function manejarMostrarTodos() {
  mostrarAlerta("");
  inputPrecioMaximo.value = "";
  actualizarVista(pedidos);
}

function manejarLimpiarPedidos() {
  mostrarAlerta("");
  pedidos = [];
  inputPrecioMaximo.value = "";
  actualizarVista(pedidos);
}

formularioPedido.addEventListener("submit", manejarAgregarPedido);
btnAgregar.addEventListener("click", manejarAgregarPedido);
btnFiltrar.addEventListener("click", manejarFiltrarProductos);
btnMostrarTodos.addEventListener("click", manejarMostrarTodos);
btnLimpiar.addEventListener("click", manejarLimpiarPedidos);

actualizarVista(pedidos);
