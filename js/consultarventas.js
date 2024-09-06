document.addEventListener('DOMContentLoaded', function () {
    const ventasList = document.getElementById('ventasList');

    // Cargar las ventas desde localStorage y mostrar en una tabla
    try {
        let ventas = JSON.parse(localStorage.getItem('ventas')) || [];

        if (ventas.length === 0) {
            ventasList.innerHTML = `<p class="text-center">No hay ventas registradas.</p>`;
        } else {
            mostrarVentas(ventas);
        }
    } catch (error) {
        console.error('Error al cargar las ventas del localStorage:', error);
        ventasList.innerHTML = `<p class="text-danger text-center">Hubo un error al cargar las ventas. Inténtelo más tarde.</p>`;
    }

    // Boton para regresar al menu principal
    document.getElementById('backBtn').addEventListener('click', function () {
        window.location.href = '../index.html';
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
                        <td>${venta.vendedor}</td>
                        <td>${venta.producto}</td>
                        <td>$${venta.precioFinal.toFixed(2)}</td>
                        <td>${venta.envio}</td>
                        <td>${formatearDatosAdicionales(venta.datosAdicionales)}</td>
                        <td>
                            <button class="btn btn-sm btn-warning" onclick="editarVenta(${index})">Editar</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function formatearDatosAdicionales(datos) {
    return `
        Nombre: ${datos.nombre}<br>
        Ciudad: ${datos.ciudad}<br>
        WhatsApp: ${datos.whatsapp}<br>
        ${datos.provincia ? `Provincia: ${datos.provincia}<br>` : ''}
        ${datos.direccion ? `Dirección: ${datos.direccion}<br>` : ''}
        ${datos.altura ? `Altura: ${datos.altura}<br>` : ''}
        ${datos.piso ? `Piso: ${datos.piso}<br>` : ''}
        ${datos.departamento ? `Departamento: ${datos.departamento}<br>` : ''}
        ${datos.codigoPostal ? `Código Postal: ${datos.codigoPostal}<br>` : ''}
        ${datos.correo ? `Correo: ${datos.correo}` : ''}
    `;
}

function editarVenta(index) {
    const ventas = JSON.parse(localStorage.getItem('ventas'));
    const venta = ventas[index];

    // Mostrar el formulario de edicion con SweetAlert2
    Swal.fire({
        title: 'Editar Venta',
        html: `
            <label>Vendedor</label>
            <input id="vendedor" class="swal2-input" value="${venta.vendedor}">
            <label>Producto</label>
            <input id="producto" class="swal2-input" value="${venta.producto}">
            <label>Precio Final</label>
            <input id="precioFinal" class="swal2-input" type="number" value="${venta.precioFinal}">
            <label>Envío</label>
            <input id="envio" class="swal2-input" value="${venta.envio}">
            <label>Nombre</label>
            <input id="nombre" class="swal2-input" value="${venta.datosAdicionales.nombre}">
            <label>Ciudad</label>
            <input id="ciudad" class="swal2-input" value="${venta.datosAdicionales.ciudad}">
            <label>WhatsApp</label>
            <input id="whatsapp" class="swal2-input" value="${venta.datosAdicionales.whatsapp}">
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar Cambios',
        preConfirm: () => {
            const vendedor = document.getElementById('vendedor').value;
            const producto = document.getElementById('producto').value;
            const precioFinal = parseFloat(document.getElementById('precioFinal').value);
            const envio = document.getElementById('envio').value;
            const nombre = document.getElementById('nombre').value;
            const ciudad = document.getElementById('ciudad').value;
            const whatsapp = document.getElementById('whatsapp').value;

            if (!vendedor || !producto || isNaN(precioFinal) || !envio || !nombre || !ciudad || !whatsapp) {
                Swal.showValidationMessage('Todos los campos son obligatorios');
                return false;
            }

            // Actualiza la info de  la venta
            ventas[index] = {
                vendedor: vendedor,
                producto: producto,
                precioFinal: precioFinal,
                envio: envio,
                datosAdicionales: { nombre, ciudad, whatsapp }
            };

            // Guarda los cambios en el localStorage
            localStorage.setItem('ventas', JSON.stringify(ventas));

            return true;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Guardado', 'Los cambios han sido guardados con éxito.', 'success');
            mostrarVentas(ventas); // Actualiza la tabla después de guardar
        }
    });
}

