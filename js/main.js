//IDEA el proyecto es un sistema de registro  de ventas.
// Cargar productos desde archivo JSON usando fetch
fetch('../db/data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar los productos');
        }
        return response.json();
    })
    .then(productos => {
        // Agregar productos al seleccionador
        const productoSelect = document.getElementById('producto');
        productos.forEach(producto => {
            let option = document.createElement('option');
            option.value = producto.id;
            option.text = `${producto.nombre} - $${producto.precio}`;
            productoSelect.appendChild(option);
        });

        // Escuchar cambios en el combo o metodo de pago para calcular y mostrar el precio final
        document.getElementById('producto').addEventListener('change', () => actualizarPrecioFinal(productos));
        document.getElementById('pago').addEventListener('change', () => actualizarPrecioFinal(productos));
    })
    .catch(error => {
        console.error('Hubo un problema con la carga de los productos:', error);
        Swal.fire('Error', 'Error al cargar los productos. Intente nuevamente.', 'error');
    });

// Habilitar el boton de registrar venta inicialmente
const registrarVentaBtn = document.getElementById('ventaForm').querySelector('button[type="submit"]');
registrarVentaBtn.disabled = false;

// Función para actualizar el precio final
function actualizarPrecioFinal(productos) {
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

// Escuchar el envoo del formulario
document.getElementById('ventaForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const vendedor = document.getElementById('vendedor').value;
    const productoId = parseInt(document.getElementById('producto').value);
    const modalidadPago = parseInt(document.getElementById('pago').value);
    const modalidadEnvio = document.getElementById('envio').value;

    if (!vendedor || !productoId || !modalidadPago || !modalidadEnvio) {
        Swal.fire('Error', 'Por favor, complete todos los campos antes de registrar la venta.', 'error');
        return;
    }

    // Validaciones de los campos adicionales
    if (!validarDatosAdicionales()) {
        return;
    }

    fetch('../db/data.json')
        .then(response => response.json())
        .then(productos => {
            const productoSeleccionado = productos.find(producto => producto.id === productoId);
            const precioFinal = productoSeleccionado.precio * (modalidadPago / 100);
            const datosAdicionales = obtenerDatosAdicionales(modalidadEnvio);

            const venta = {
                vendedor: vendedor,
                producto: productoSeleccionado.nombre,
                precioFinal: precioFinal,
                envio: modalidadEnvio,
                datosAdicionales: datosAdicionales
            };

            guardarVentaLocalStorage(venta);
            
            // Reemplazar alert con SweetAlert2
            Swal.fire({
                title: 'Venta Registrada',
                text: 'La venta ha sido registrada con éxito.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });

            // Reiniciar el formulario
            document.getElementById('ventaForm').reset();
            document.getElementById('precioFinal').value = '';
        })
        .catch(error => {
            console.error('Error al registrar la venta:', error);
            Swal.fire('Error', 'Error al registrar la venta. Intente nuevamente.', 'error');
        });
});

// Validar campos adicionales solo permitir string y numeros segun donde corresponda
function validarDatosAdicionales() {
    const nombre = document.getElementById('nombre').value;
    const provincia = document.getElementById('provincia') ? document.getElementById('provincia').value : '';
    const ciudad = document.getElementById('ciudad').value;
    const codigoPostal = document.getElementById('codigoPostal').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const correo = document.getElementById('correo') ? document.getElementById('correo').value : '';

    if (!/^[a-zA-Z\s]+$/.test(nombre)) {
        Swal.fire('Error', 'El nombre solo puede contener letras y espacios.', 'error');
        return false;
    }
    if (provincia && !/^[a-zA-Z\s]+$/.test(provincia)) {
        Swal.fire('Error', 'La provincia solo puede contener letras y espacios.', 'error');
        return false;
    }
    if (!/^[a-zA-Z\s]+$/.test(ciudad)) {
        Swal.fire('Error', 'La ciudad solo puede contener letras y espacios.', 'error');
        return false;
    }
    if (!/^\d{4}$/.test(codigoPostal)) {
        Swal.fire('Error', 'El código postal debe tener 4 dígitos.', 'error');
        return false;
    }
    if (!/^\d{10}$/.test(whatsapp)) {
        Swal.fire('Error', 'El número de WhatsApp debe tener 10 dígitos.', 'error');
        return false;
    }
    if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        Swal.fire('Error', 'El correo debe tener un formato válido (e.g., correo@dominio.com).', 'error');
        return false;
    }
    return true;
}

// Mostrar campos adicionales dependiendo de la modalidad de envio
document.getElementById('envio').addEventListener('change', function () {
    const modalidadEnvio = this.value;
    mostrarFormularioAdicional(modalidadEnvio);
});

function mostrarFormularioAdicional(modalidadEnvio) {
    const datosAdicionalesDiv = document.getElementById('datosAdicionales');
    datosAdicionalesDiv.innerHTML = ''; // Limpiar cualquier formulario viejito

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
                <input type="text" class="form-control" id="codigoPostal" maxlength="4" pattern="\\d*" required>
            </div>
            <div class="mb-3">
                <label for="whatsapp" class="form-label">WhatsApp:</label>
                <input type="text" class="form-control" id="whatsapp" maxlength="10" pattern="\\d*" required>
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
                    <input type="text" class="form-control" id="altura" pattern="\\d*" required>
                </div>
                <div class="mb-3">
                    <label for="piso" class="form-label">Piso:</label>
                    <input type="text" class="form-control" id="piso" pattern="\\d*">
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
                <input type="text" class="form-control" id="whatsapp" maxlength="10" pattern="\\d*" required>
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
