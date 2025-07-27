//funcion para poder escoger un numero aleatorio
import { obtenerElementoAleatorio } from "../Utils/WhatsApp";
const Telefonos = ["528333020670", "528714742958"];

//Hook de WhatsApp para sistema de mensajes :3
export const useWhatsApp = () => {
  const numero = obtenerElementoAleatorio(Telefonos);

  const contactarServicio = (nombrearea) => {
    const mensaje = `¡Hola! Me interesa el servicio de "${nombrearea}". Me gustaría recibir más información y una cotización personalizada.`;
    abrirWhatsApp(mensaje);
  };

  const solicitarPaquete = (paquete, nombrearea) => {
    const mensaje = `¡Hola! Me interesa el paquete de  ${nombrearea}   "${paquete.nombre}" (${paquete.precio}). Me gustaría recibir más información y una cotización personalizada.`;
    abrirWhatsApp(mensaje);
  };

  const contactarWhatsApp = (nombrearea) => {
    const mensaje = `¡Hola! Me interesa el servicio de "${nombrearea}". Me gustaría recibir más información y una cotización personalizada.`;
    abrirWhatsApp(mensaje);
  };

  const contactarWhast2 = () => {
    const mensaje = encodeURIComponent(
      "¡Hola! Me interesa conocer más sobre sus servicios digitales. ¿Podrían brindarme más información?"
    );
    abrirWhatsApp(mensaje);
  };

  const abrirWhatsApp = (mensaje) => {
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  return {
    contactarServicio,
    solicitarPaquete,
    contactarWhatsApp,
    contactarWhast2
  };
};


// hooks/useWhatsAppSolicitud.js
export function useWhatsAppSolicitud() {
  const numeroWhatsApp = obtenerElementoAleatorio(Telefonos);

  const crearMensaje = (data) => {
    const tipo = data.type === 'plan' ? 'Plan' : 'Servicio'

    let mensaje = `🌟 *Nueva Solicitud de ${tipo}* 🌟\n\n`
    mensaje += `📋 *${tipo}:* ${data.itemName}\n`
    mensaje += `💰 *Precio:* ${data.itemPrice}\n\n`
    mensaje += `👤 *Datos del Cliente:*\n`
    mensaje += `• Nombre: ${data.nombre} ${data.apellido}\n`
    mensaje += `• Email: ${data.email}\n`
    mensaje += `• Teléfono: ${data.telefono}\n`

    if (data.empresa) {
      mensaje += `• Empresa: ${data.empresa}\n`
    }

    if (data.mensaje) {
      mensaje += `\n💬 *Mensaje adicional:*\n${data.mensaje}\n`
    }

    mensaje += `\n📅 *Fecha:* ${new Date().toLocaleDateString('es-MX')}`

    return mensaje
  }

  const enviarMensaje = (mensaje) => {
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`
    window.open(url, '_blank')
  }

  return {
    crearMensaje,
    enviarMensaje,
  }
}
