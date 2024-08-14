//IDEA el proyecto es un sistema de registro  de ventas.
// Definición de productos
const productos = [
    { id: 1, nombre: 'Combo Emprendedor 1', precio: 15000 },
    { id: 2, nombre: 'Combo Emprendedor 2', precio: 16000 },
    { id: 3, nombre: 'Combo Emprendedor 3', precio: 17000 },
    { id: 4, nombre: 'Combo Emprendedor 4', precio: 18000 },
    { id: 5, nombre: 'Combo Emprendedor 5', precio: 19000 },
    { id: 6, nombre: 'Combo Emprendedor 6', precio: 20000 },
    { id: 7, nombre: 'Combo Emprendedor 7', precio: 21000 },
    { id: 8, nombre: 'Combo Emprendedor 8', precio: 22000 },
    { id: 9, nombre: 'Combo Emprendedor 9', precio: 23000 },
    { id: 10, nombre: 'Combo Emprendedor 10', precio: 24000 },
];

// Agregar productos al select
const productoSelect = document.getElementById('producto');
productos.forEach(producto => {
    let option = document.createElement('option');
    option.value = producto.id;
    option.text = `${producto.nombre} - $${producto.precio}`;
    productoSelect.appendChild(option);
});

// Habilitar el botón de registrar venta inicialmente
const registrarVentaBtn = document.getElementById('ventaForm').querySelector('button[type="submit"]');
registrarVentaBtn.disabled = false;

// Escuchar cambios en el combo o método de pago para calcular y mostrar el precio final
document.getElementById('producto').addEventListener('change', actualizarPrecioFinal);
document.getElementById('pago').addEventListener('change', actualizarPrecioFinal);

// Escuchar cambios en la modalidad de envío para mostrar datos adicionales
document.getElementById('envio').addEventListener('change', function() {
    const modalidadEnvio = this.value;
    mostrarFormularioAdicional(modalidadEnvio);
});

function actualizarPrecioFinal() {
    const productoId = parseInt(document.getElementById('producto').value);
    const modalidadPago = parseInt(document.getElementById('pago').value);

    if (!isNaN(productoId) && !isNaN(modalidadPago)) {
        const productoSeleccionado = productos.find(producto => producto.id === productoId);
        const precioFinal = productoSeleccionado.precio * (modalidadPago / 100);
        document.getElementById('precioFinal').value = `$${precioFinal.toFixed(2)}`;
    } else {
        document.getElementById('precioFinal').value = '';
    }
}

// Escuchar el envío del formulario
document.getElementById('ventaForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener valores del formulario
    const vendedor = document.getElementById('vendedor').value;
    const productoId = parseInt(document.getElementById('producto').value);
    const modalidadPago = parseInt(document.getElementById('pago').value);
    const modalidadEnvio = document.getElementById('envio').value;

    if (!vendedor || !productoId || !modalidadPago || !modalidadEnvio) {
        alert('Por favor, complete todos los campos antes de registrar la venta.');
        return;
    }

    // Obtener el producto seleccionado
    const productoSeleccionado = productos.find(producto => producto.id === productoId);
    const precioFinal = productoSeleccionado.precio * (modalidadPago / 100);

    // Obtener los datos adicionales según la modalidad de entrega
    const datosAdicionales = obtenerDatosAdicionales(modalidadEnvio);

    // Crear un objeto de venta
    const venta = {
        vendedor: vendedor,
        producto: productoSeleccionado.nombre,
        precioFinal: precioFinal,
        envio: modalidadEnvio,
        datosAdicionales: datosAdicionales
    };

    // Guardar la venta en localStorage
    guardarVentaLocalStorage(venta);

    // Mostrar un mensaje de confirmación
    alert('Venta registrada con éxito');

    // Reiniciar el formulario
    document.getElementById('ventaForm').reset();
    document.getElementById('precioFinal').value = '';
});

function mostrarFormularioAdicional(modalidadEnvio) {
    const datosAdicionalesDiv = document.getElementById('datosAdicionales');
    datosAdicionalesDiv.innerHTML = ''; // Limpiar cualquier formulario anterior

    if (modalidadEnvio === 'A' || modalidadEnvio === 'B') {
        datosAdicionalesDiv.innerHTML = `
            <div class="mb-3">
                <label for="nombre" class="form-label">Nombre y Apellido:</label>
                <input type="text" class="form-control" id="nombre" required>
            </div>
            <div class="mb-3">
                <label for="provincia" class="form-label">Provincia:</label>
                <input type="text" class="form-control" id="provincia" required>
            </div>
            <div class="mb-3">
                <label for="ciudad" class="form-label">Ciudad:</label>
                <input type="text" class="form-control" id="ciudad" required>
            </div>
            <div class="mb-3">
                <label for="codigoPostal" class="form-label">Código Postal:</label>
                <input type="text" class="form-control" id="codigoPostal" required>
            </div>
            <div class="mb-3">
                <label for="whatsapp" class="form-label">WhatsApp:</label>
                <input type="text" class="form-control" id="whatsapp" required>
            </div>
        `;

        if (modalidadEnvio === 'A') {
            datosAdicionalesDiv.innerHTML += `
                <div class="mb-3">
                    <label for="direccion" class="form-label">Dirección:</label>
                    <input type="text" class="form-control" id="direccion" required>
                </div>
                <div class="mb-3">
                    <label for="altura" class="form-label">Altura:</label>
                    <input type="text" class="form-control" id="altura" required>
                </div>
                <div class="mb-3">
                    <label for="piso" class="form-label">Piso:</label>
                    <input type="text" class="form-control" id="piso">
                </div>
                <div class="mb-3">
                    <label for="departamento" class="form-label">Departamento:</label>
                    <input type="text" class="form-control" id="departamento">
                </div>
                <div class="mb-3">
                    <label for="correo" class="form-label">Correo Electrónico:</label>
                    <input type="email" class="form-control" id="correo" required>
                </div>
            `;
        }
    } else if (modalidadEnvio === 'C') {
        datosAdicionalesDiv.innerHTML = `
            <div class="mb-3">
                <label for="nombre" class="form-label">Nombre y Apellido:</label>
                <input type="text" class="form-control" id="nombre" required>
            </div>
            <div class="mb-3">
                <label for="ciudad" class="form-label">Ciudad:</label>
                <input type="text" class="form-control" id="ciudad" required>
            </div>
            <div class="mb-3">
                <label for="whatsapp" class="form-label">WhatsApp:</label>
                <input type="text" class="form-control" id="whatsapp" required>
            </div>
        `;
    }
}

function obtenerDatosAdicionales(modalidadEnvio) {
    const nombre = document.getElementById('nombre').value;
    const provincia = modalidadEnvio === 'C' ? '' : document.getElementById('provincia').value;
    const ciudad = document.getElementById('ciudad').value;
    const codigoPostal = modalidadEnvio === 'C' ? '' : document.getElementById('codigoPostal').value;
    const whatsapp = document.getElementById('whatsapp').value;

    let datos = {
        nombre: nombre,
        ciudad: ciudad,
        whatsapp: whatsapp
    };

    if (modalidadEnvio === 'A') {
        datos.provincia = provincia;
        datos.direccion = document.getElementById('direccion').value;
        datos.altura = document.getElementById('altura').value;
        datos.piso = document.getElementById('piso').value || '';
        datos.departamento = document.getElementById('departamento').value || '';
        datos.codigoPostal = codigoPostal;
        datos.correo = document.getElementById('correo').value;
    } else if (modalidadEnvio === 'B') {
        datos.provincia = provincia;
        datos.codigoPostal = codigoPostal;
    }

    return datos;
}

function guardarVentaLocalStorage(venta) {
    let ventas = JSON.parse(localStorage.getItem('ventas')) || [];
    ventas.push(venta);
    localStorage.setItem('ventas', JSON.stringify(ventas));
}
