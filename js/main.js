//IDEA el proyecto es un sistema de registro  de ventas.

const vendedores = ["Enzo", "Marina", "Daniela", "Cano"];
const productos = [
    { nombre: "producto-1", precio: 200 },
    { nombre: "producto-2", precio: 300 },
    { nombre: "producto-3", precio: 400 }
];


function seleccionarVendedor() {
    const seleccion = parseInt(prompt("Elige el número del vendedor:\n1. Enzo\n2. Marina\n3. Daniela\n4. Cano"));
    if (seleccion >= 1 && seleccion <= vendedores.length) {
        return vendedores[seleccion - 1];
    } else {
        alert("Selección inválida");
        return seleccionarVendedor();
    }
}

function seleccionarProducto() {
    const seleccion = parseInt(prompt("Elige el número del producto:\n1. producto-1 ($200)\n2. producto-2 ($300)\n3. producto-3 ($400)"));
    if (seleccion >= 1 && seleccion <= productos.length) {
        return productos[seleccion - 1];
    } else {
        alert("Selección inválida");
        return seleccionarProducto();
    }
}

function metodoEnvio() {
    const envio = prompt("¿Es una venta con envío? (sí/no)").toLowerCase();
    if (envio === "sí" || envio === "si" || envio === "s") {
        const peso = parseFloat(prompt("Ingresa el peso del producto (en kg):"));
        if (!validarPeso(peso)) {
            alert("Peso inválido. Ingresa un número positivo.");
            return metodoEnvio();
        }
        const zona = parseInt(prompt("Elige la zona de envío (1, 2, 3):"));
        const costoPorKg = obtenerCostoPorKg(zona);
        if (costoPorKg === null) return metodoEnvio();
        const precioEnvio = peso * costoPorKg;
        return `con un costo de envío de $${precioEnvio}`;
    } else if (envio === "no") {
        return "para retirar gratis por local comercial";
    } else {
        alert("Respuesta no válida. Por favor, ingresa 'sí' o 'no'.");
        return metodoEnvio();
    }
}

function validarPeso(peso) {
    return !isNaN(peso) && peso > 0;
}

function obtenerCostoPorKg(zona) {
    switch (zona) {
        case 1:
            return 100;
        case 2:
            return 150;
        case 3:
            return 175;
        default:
            alert("Zona de envío inválida");
            return null;
    }
}

function iniciarSistema() {
    let continuar = true;
    while (continuar) {
        const vendedorSeleccionado = seleccionarVendedor();
        const productoSeleccionado = seleccionarProducto();
        const mensajeEnvio = metodoEnvio();
        alert(`${vendedorSeleccionado} has registrado la venta de ${productoSeleccionado.nombre} ${mensajeEnvio}.`);
        continuar = confirm("¿Deseas registrar otra venta?");
    }
    alert("Gracias por usar el sistema de registro de ventas.");
}

iniciarSistema();
