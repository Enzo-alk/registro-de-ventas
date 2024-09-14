document.addEventListener('DOMContentLoaded', function () {
    const ventasList = document.getElementById('ventasList');

    // Cargar las vetas desde localeStorage y mostrar en una tabla
    try {
        let ventas = localStorage.getItem('ventas');
        if (ventas) {
            ventas = JSON.parse(ventas);  // Intentar parsear solo si hay datos
        } else {
            ventas = [];
            localStorage.setItem('ventas', JSON.stringify([]));  // Inicializar un array vacio si no hay datos
        }

        if (ventas.length === 0) {
            ventasList.innerHTML = `<p class="text-center">No hay ventas registradas.</p>`;
        } else {
            mostrarVentas(ventas);
        }
    } catch (error) {
        console.error('Error al cargar las ventas del localStorage:', error);
        ventasList.innerHTML = `<p class="text-danger text-center">Hubo un error al cargar las ventas. Inténtelo más tarde.</p>`;
    }

    // Boton para regresar al menú principal
    document.getElementById('backBtn').addEventListener('click', function () {
        window.location.href = '../index.html';
    });

    // correccion qu e pidio profesor para borrar todas las ventas
    document.getElementById('borrarTodoBtn').addEventListener('click', function () {
        Swal.fire({
            title: '¿Ests seguro?',
            text: "Esto eliminará todas las ventas y no podrás deshacerlo.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, borrar todo',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('ventas');  // Eliminar todas las ventas del localStorage
                mostrarVentas([]);  // Mostrar una tabla vacia
                Swal.fire('Eliminado', 'Todas las ventas han sido eliminadas.', 'success');
            }
        });
    });
});

function mostrarVentas(ventas) {
    const ventasList = document.getElementById('ventasList');

    ventasList.innerHTML = `
        <table class="table table-striped table-hover w-80 mx-auto">
            <thead class="table-dark">
                <tr>
                    <th>Vendedor</th>
                    <th>Producto</th>
                    <th>Precio Final</th>
                    <th>Modalidad de Envío</th>
                    <th>Datos Adicionales</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${ventas.map((venta, index) => `
                    <tr>
                        <td>${venta.vendedor || 'N/A'}</td>
                        <td>${venta.producto || 'N/A'}</td>
                        <td>$${(venta.precioFinal !== undefined ? venta.precioFinal.toFixed(2) : '0.00')}</td>
                        <td>${venta.envio || 'N/A'}</td>
                        <td>${formatearDatosAdicionales(venta.datosAdicionales)}</td>
                        <td>
                            <button class="btn btn-sm btn-warning" onclick="editarVenta(${index})">Editar</button>
                            <button class="btn btn-sm btn-danger" onclick="eliminarVenta(${index})">Eliminar</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function formatearDatosAdicionales(datos) {
    return `
        Nombre: ${datos.nombre || 'N/A'}<br>
        Ciudad: ${datos.ciudad || 'N/A'}<br>
        WhatsApp: ${datos.whatsapp || 'N/A'}<br>
        ${datos.provincia ? `Provincia: ${datos.provincia}<br>` : ''}
        ${datos.direccion ? `Dirección: ${datos.direccion}<br>` : ''}
        ${datos.altura ? `Altura: ${datos.altura}<br>` : ''}
        ${datos.piso ? `Piso: ${datos.piso}<br>` : ''}
        ${datos.departamento ? `Departamento: ${datos.departamento}<br>` : ''}
        ${datos.codigoPostal ? `Código Postal: ${datos.codigoPostal}<br>` : ''}
        ${datos.correo ? `Correo: ${datos.correo}` : ''}
    `;
}

// Funcion para eliminar una venta
function eliminarVenta(index) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás deshacer esta acción.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            let ventas = JSON.parse(localStorage.getItem('ventas'));
            ventas.splice(index, 1);  // Eliminar la venta del array
            localStorage.setItem('ventas', JSON.stringify(ventas));  // Guardar el array actualizado
            mostrarVentas(ventas);  // Actualizar la lista de ventas
            Swal.fire('Eliminado', 'La venta ha sido eliminada.', 'success');
        }
    });
}

// Función para editar una venta
function editarVenta(index) {
    const ventas = JSON.parse(localStorage.getItem('ventas'));
    const venta = ventas[index];

    // Cargar productos desde archivo JSON
    cargarProductos().then((productos) => {
        const productosOptions = productos.map(p => `<option value="${p.id}" ${p.nombre === venta.producto ? 'selected' : ''}>${p.nombre}</option>`).join('');

        // Mostrar el formulario de edicion
        Swal.fire({
            title: 'Editar Venta',
            width: '70%',  
            html: `
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-6">
                            <label>Vendedor</label>
                            <input id="vendedor" class="swal2-input" value="${venta.vendedor}" readonly>
                        </div>
                        <div class="col-md-6">
                            <label>Producto</label>
                            <select id="producto" class="swal2-input">${productosOptions}</select>
                        </div>
                        <div class="col-md-6">
                            <label>Método de Pago</label>
                            <select id="pago" class="swal2-input">
                                <option value="100" ${venta.pago === 100 ? 'selected' : ''}>Precio de lista</option>
                                <option value="90" ${venta.pago === 90 ? 'selected' : ''}>Transferencia (-10%)</option>
                                <option value="80" ${venta.pago === 80 ? 'selected' : ''}>Efectivo (-20%)</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label>Modalidad de Envío</label>
                            <select id="envio" class="swal2-input">
                                <option value="A" ${venta.envio === 'A' ? 'selected' : ''}>Envío a domicilio</option>
                                <option value="B" ${venta.envio === 'B' ? 'selected' : ''}>Envío a sucursal</option>
                                <option value="C" ${venta.envio === 'C' ? 'selected' : ''}>Retiro por local comercial</option>
                            </select>
                        </div>
                        <div class="col-md-6 mt-3">
                            <label>Precio Total</label>
                            <input id="precioFinal" class="swal2-input" value="$${venta.precioFinal.toFixed(2)}" readonly>
                        </div>
                    </div>
                    <div id="datosAdicionales" class="mt-3">
                        ${mostrarFormularioAdicionalEditar(venta.envio, venta.datosAdicionales)}
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Guardar Cambios',
            preConfirm: () => {
                const productoId = parseInt(document.getElementById('producto').value);
                const modalidadPago = parseInt(document.getElementById('pago').value);
                const envio = document.getElementById('envio').value;
                const productoSeleccionado = productos.find(p => p.id === productoId);
                const precioFinal = productoSeleccionado.precio * (modalidadPago / 100);

                // Validaciones ants de guardar
                const nombre = document.getElementById('nombre').value;
                const ciudad = document.getElementById('ciudad').value;
                const whatsapp = document.getElementById('whatsapp').value;
                const codigoPostal = document.getElementById('codigoPostal').value;
                const correo = document.getElementById('correo').value;

                if (!/^[a-zA-Z\s]+$/.test(nombre)) {
                    Swal.showValidationMessage('El nombre solo puede contener letras(ej: Juan Perez).');
                    return false;
                }
                if (!/^[a-zA-Z\s]+$/.test(ciudad)) {
                    Swal.showValidationMessage('La ciudad solo puede contener letras(ej: La Plata).');
                    return false;
                }
                if (!/^\d{4}$/.test(codigoPostal)) {
                    Swal.showValidationMessage('El código postal debe tener 4 numeros(ej:3500).');
                    return false;
                }
                if (!/^\d{10}$/.test(whatsapp)) {
                    Swal.showValidationMessage('El número de WhatsApp debe  10 numeros(ej:1156457825).');
                    return false;
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
                    Swal.showValidationMessage('El correo debe tener un formato válido (ej: correo@dominio.com).');
                    return false;
                }

                // Actualizar los datos de la venta
                ventas[index] = {
                    ...venta,
                    producto: productoSeleccionado.nombre,
                    precioFinal: precioFinal,
                    pago: modalidadPago,
                    envio: envio,
                    datosAdicionales: obtenerDatosAdicionalesEditar(envio)
                };

                localStorage.setItem('ventas', JSON.stringify(ventas));
                return true;
            }
        });

        // Escuchar cambios en producto, pago o envio para actualizar el precio final
        document.getElementById('producto').addEventListener('change', () => actualizarPrecioFinal(productos));
        document.getElementById('pago').addEventListener('change', () => actualizarPrecioFinal(productos));
        document.getElementById('envio').addEventListener('change', function () {
            const modalidadEnvio = this.value;

            // Obtener los datos actuales de los campos adicionales
            const datosActuales = getDatosAdicionalesInputs();

            // Re-renderizar el formulario adicional con los datos actuales
            document.getElementById('datosAdicionales').innerHTML = mostrarFormularioAdicionalEditar(modalidadEnvio, datosActuales);
        });
    });
}

// Función para actualizar el precio final al cambiar el producto o metodo de pago
function actualizarPrecioFinal(productos) {
    const productoId = parseInt(document.getElementById('producto').value);
    const modalidadPago = parseInt(document.getElementById('pago').value);

    if (!isNaN(productoId) && !isNaN(modalidadPago)) {
        const productoSeleccionado = productos.find(producto => producto.id === productoId);
        const precioFinal = productoSeleccionado.precio * (modalidadPago / 100);
        document.getElementById('precioFinal').value = `$${precioFinal.toFixed(2)}`;
    }
}

// Función para obtener los valores actuales de los campos adicionales
function getDatosAdicionalesInputs() {
    const nombre = document.getElementById('nombre') ? document.getElementById('nombre').value : '';
    const ciudad = document.getElementById('ciudad') ? document.getElementById('ciudad').value : '';
    const whatsapp = document.getElementById('whatsapp') ? document.getElementById('whatsapp').value : '';
    const provincia = document.getElementById('provincia') ? document.getElementById('provincia').value : '';
    const codigoPostal = document.getElementById('codigoPostal') ? document.getElementById('codigoPostal').value : '';
    const direccion = document.getElementById('direccion') ? document.getElementById('direccion').value : '';
    const altura = document.getElementById('altura') ? document.getElementById('altura').value : '';
    const piso = document.getElementById('piso') ? document.getElementById('piso').value : '';
    const departamento = document.getElementById('departamento') ? document.getElementById('departamento').value : '';
    const correo = document.getElementById('correo') ? document.getElementById('correo').value : '';

    return {
        nombre,
        ciudad,
        whatsapp,
        provincia,
        codigoPostal,
        direccion,
        altura,
        piso,
        departamento,
        correo
    };
}

// Mostrar formulario adicional en la edición dependiendo de la modalidad de envío
function mostrarFormularioAdicionalEditar(modalidadEnvio, datos = {}) {
    let formHTML = '';

    if (modalidadEnvio === 'A' || modalidadEnvio === 'B') {
        formHTML = `
            <div class="row">
                <div class="col-md-6">
                    <label>Nombre y Apellido</label>
                    <input id="nombre" class="swal2-input" value="${datos.nombre || ''}" pattern="[a-zA-Z\\s]+">
                </div>
                <div class="col-md-6">
                    <label>Ciudad</label>
                    <input id="ciudad" class="swal2-input" value="${datos.ciudad || ''}" pattern="[a-zA-Z\\s]+">
                </div>
                <div class="col-md-6">
                    <label>WhatsApp</label>
                    <input id="whatsapp" class="swal2-input" value="${datos.whatsapp || ''}" maxlength="10" pattern="\\d*">
                </div>
                <div class="col-md-6">
                    <label>Provincia</label>
                    <input id="provincia" class="swal2-input" value="${datos.provincia || ''}" pattern="[a-zA-Z\\s]+">
                </div>
                <div class="col-md-6">
                    <label>Código Postal</label>
                    <input id="codigoPostal" class="swal2-input" value="${datos.codigoPostal || ''}" maxlength="4" pattern="\\d*">
                </div>
        `;
        if (modalidadEnvio === 'A') {
            formHTML += `
                <div class="col-md-6">
                    <label>Dirección</label>
                    <input id="direccion" class="swal2-input" value="${datos.direccion || ''}">
                </div>
                <div class="col-md-6">
                    <label>Altura</label>
                    <input id="altura" class="swal2-input" value="${datos.altura || ''}" pattern="\\d*">
                </div>
                <div class="col-md-6">
                    <label>Piso</label>
                    <input id="piso" class="swal2-input" value="${datos.piso || ''}" pattern="\\d*">
                </div>
                <div class="col-md-6">
                    <label>Departamento</label>
                    <input id="departamento" class="swal2-input" value="${datos.departamento || ''}">
                </div>
                <div class="col-md-6">
                    <label>Correo Electrónico</label>
                    <input id="correo" class="swal2-input" value="${datos.correo || ''}" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$">
                </div>
            `;
        }
        formHTML += '</div>';
    } else if (modalidadEnvio === 'C') {
        formHTML = `
            <div class="row">
                <div class="col-md-6">
                    <label>Nombre y Apellido</label>
                    <input id="nombre" class="swal2-input" value="${datos.nombre || ''}" pattern="[a-zA-Z\\s]+">
                </div>
                <div class="col-md-6">
                    <label>Ciudad</label>
                    <input id="ciudad" class="swal2-input" value="${datos.ciudad || ''}" pattern="[a-zA-Z\\s]+">
                </div>
                <div class="col-md-6">
                    <label>WhatsApp</label>
                    <input id="whatsapp" class="swal2-input" value="${datos.whatsapp || ''}" maxlength="10" pattern="\\d*">
                </div>
            </div>
        `;
    }

    return formHTML;
}

// Obtener los datos adicionales de la edición
function obtenerDatosAdicionalesEditar(modalidadEnvio) {
    const nombre = document.getElementById('nombre').value;
    const ciudad = document.getElementById('ciudad').value;
    const whatsapp = document.getElementById('whatsapp').value;
    let datos = { nombre, ciudad, whatsapp };

    if (modalidadEnvio === 'A' || modalidadEnvio === 'B') {
        datos.provincia = document.getElementById('provincia').value;
        datos.codigoPostal = document.getElementById('codigoPostal').value;

        if (modalidadEnvio === 'A') {
            datos.direccion = document.getElementById('direccion').value;
            datos.altura = document.getElementById('altura').value;
            datos.piso = document.getElementById('piso').value || '';
            datos.departamento = document.getElementById('departamento').value || '';
            datos.correo = document.getElementById('correo').value;
        }
    }

    return datos;
}

// Función para cargar productos desde el archivo JSON
async function cargarProductos() {
    try {
        const response = await fetch('../db/data.json'); 
        const productos = await response.json();
        return productos;
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        Swal.fire('Error', 'No se pudieron cargar los productos.', 'error');
        return [];
    }
}
