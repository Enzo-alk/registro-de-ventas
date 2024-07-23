//IDEA el proyecto es un sistema de registro  de ventas.

const vendedores = ["Enzo" , "Marina" , "Daniela" , "Cano"]
const zonas = [ "zona-1" , "zona-2" , "zona 3"]
const productos = ["producto-1", "producto-2", "producto-3"]

// Función  para registrar una venta
function registrarVenta() {
    do {
        const envio = prompt("¿Es una venta con envío? (sí/no)").toLowerCase();

        if (envio === "sí" || envio === "si" || envio === "s" ) {
            const nombre = prompt("Ingresa el nombre del cliente:");
            const peso = parseFloat(prompt("Ingresa el peso del producto (en kg):"));
            const zona = parseInt(prompt("Elige la zona de envío (1, 2, 3):"));
        
            let costoPorKg;
            switch (zona) {
                case 1:
                    costoPorKg = 100;
                    break;
                case 2:
                    costoPorKg = 150;
                    break;
                case 3:
                    costoPorKg = 175;
                    break;
                default:
                    alert("Zona de envío inválida");
                    return; 
            }

            const precioEnvio = peso * costoPorKg;
            alert(`El precio de tu envío es de $${precioEnvio}`);
        } else if (envio === "no") {
            alert("Tu pedido está listo para retirar por el local");
        } else {
            alert("Respuesta no válida. Por favor, ingresa 'sí' o 'no'.");
        }
    } while (confirm("¿Deseas realizar otro cálculo?"));
}

registrarVenta();


//en esta seccion busque que el cliente tuviera la lista de vendedores y que pueda seleccionar con quien ser atendido, pero no pude avanzar
  alert("Con que vendedor deseas ser atendido?")
  for (let i = 0; i < vendedores.length; i++) {
    console.log(`Vendedor ${i + 1}: ${vendedores[i]}`);
}