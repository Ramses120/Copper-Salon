import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

interface BookingSMSData {
  clienteNombre: string;
  clienteTelefono: string;
  fecha: string;
  hora: string;
  estilista: string;
}

export async function sendBookingSMS(data: BookingSMSData) {
  try {
    if (!accountSid || !authToken || !phoneNumber) {
      console.warn('Twilio no configurado. SMS no enviado.');
      return null;
    }

    const message = await client.messages.create({
      body: `✨ Copper Beauty Salon ✨\n\nHola ${data.clienteNombre}!\n\n📋 Recibimos tu solicitud:\n📅 ${data.fecha}\n🕐 ${data.hora}\n💇 Con ${data.estilista}\n\n📞 Te llamaremos pronto para confirmar!\n\nPago en el salón 💳`,
      from: phoneNumber,
      to: data.clienteTelefono,
    });

    return message;
  } catch (error) {
    console.error('Error enviando SMS:', error);
    throw error;
  }
}

export async function sendBookingReminderSMS(data: BookingSMSData) {
  try {
    if (!accountSid || !authToken || !phoneNumber) {
      console.warn('Twilio no configurado. SMS no enviado.');
      return null;
    }

    const message = await client.messages.create({
      body: `⏰ Recordatorio Copper Beauty\n\nHola ${data.clienteNombre}!\n\nTe esperamos mañana:\n📅 ${data.fecha}\n🕐 ${data.hora}\n💇 Con ${data.estilista}\n\nRecuerda llegar 10 min antes!`,
      from: phoneNumber,
      to: data.clienteTelefono,
    });

    return message;
  } catch (error) {
    console.error('Error enviando SMS recordatorio:', error);
    throw error;
  }
}

export async function sendCancellationSMS(data: BookingSMSData) {
  try {
    if (!accountSid || !authToken || !phoneNumber) {
      console.warn('Twilio no configurado. SMS no enviado.');
      return null;
    }

    const message = await client.messages.create({
      body: `Copper Beauty Salon\n\nHola ${data.clienteNombre},\n\nTu cita del ${data.fecha} a las ${data.hora} ha sido cancelada.\n\nPara reagendar, visita nuestro sitio web o llámanos.\n\nGracias!`,
      from: phoneNumber,
      to: data.clienteTelefono,
    });

    return message;
  } catch (error) {
    console.error('Error enviando SMS de cancelación:', error);
    throw error;
  }
}
