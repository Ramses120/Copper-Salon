import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface BookingEmailData {
  clienteNombre: string;
  clienteEmail: string;
  fecha: string;
  hora: string;
  servicios: string[];
  estilista: string;
  total: number;
}

export async function sendBookingConfirmation(data: BookingEmailData) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: 'Copper Beauty Salon <noreply@copperbeauty.com>',
      to: data.clienteEmail,
      subject: '✨ Solicitud de Reserva Recibida - Copper Beauty Salon',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #E46768 0%, #d55657 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-family: 'Times New Roman', serif;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .info-box {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #E46768;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #eee;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .label {
              font-weight: bold;
              color: #666;
            }
            .value {
              color: #333;
            }
            .services-list {
              list-style: none;
              padding: 0;
              margin: 10px 0;
            }
            .services-list li {
              padding: 5px 0;
              padding-left: 20px;
              position: relative;
            }
            .services-list li:before {
              content: "✓";
              position: absolute;
              left: 0;
              color: #E46768;
              font-weight: bold;
            }
            .total {
              font-size: 24px;
              font-weight: bold;
              color: #E46768;
              text-align: right;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 14px;
            }
            .button {
              display: inline-block;
              background: #E46768;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Copper Beauty Salon & Spa</h1>
            <p style="margin: 10px 0 0 0;">Hemos recibido tu solicitud de reserva</p>
          </div>
          
          <div class="content">
            <h2 style="color: #E46768;">¡Hola ${data.clienteNombre}!</h2>
            <p>Gracias por elegirnos. Hemos recibido tu solicitud de reserva:</p>
            
            <div class="info-box" style="background: #dbeafe; border-left-color: #3b82f6;">
              <p style="margin: 0; color: #1e40af; font-weight: bold;">📞 Te llamaremos pronto</p>
              <p style="margin: 10px 0 0 0; color: #1e3a8a; font-size: 14px;">
                Nuestro equipo se comunicará contigo en las próximas horas para <strong>confirmar tu cita</strong>. 
                El pago se realiza directamente en el salón.
              </p>
            </div>

            <div class="info-box">
              <div class="info-row">
                <span class="label">📅 Fecha:</span>
                <span class="value">${new Date(data.fecha).toLocaleDateString('es-MX', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div class="info-row">
                <span class="label">🕐 Hora:</span>
                <span class="value">${data.hora}</span>
              </div>
              <div class="info-row">
                <span class="label">💇 Estilista:</span>
                <span class="value">${data.estilista}</span>
              </div>
            </div>

            <h3 style="color: #333;">Servicios Reservados:</h3>
            <ul class="services-list">
              ${data.servicios.map(s => `<li>${s}</li>`).join('')}
            </ul>

            <div class="total">
              Estimado: $${data.total.toFixed(2)}
            </div>
            <p style="font-size: 12px; color: #666; text-align: right; margin-top: -10px;">
              *El pago se realiza en el salón
            </p>

            <p style="background: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107;">
              <strong>📞 Importante:</strong> Esta es una solicitud de reserva. Te llamaremos para confirmar tu cita.
            </p>

            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}" class="button">
                Visitar Nuestro Sitio
              </a>
            </div>

            <div class="footer">
              <p><strong>Copper Beauty Salon & Spa</strong></p>
              <p>Miami, FL | (786) 555-0100</p>
              <p>info@copperbeauty.com</p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              <p style="font-size: 12px; color: #999;">
                Si necesitas cancelar o modificar tu cita, por favor contáctanos con al menos 24 horas de anticipación.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error enviando email:', error);
      throw error;
    }

    return result;
  } catch (error) {
    console.error('Error en sendBookingConfirmation:', error);
    throw error;
  }
}

export async function sendBookingReminder(data: BookingEmailData) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: 'Copper Beauty Salon <noreply@copperbeauty.com>',
      to: data.clienteEmail,
      subject: '⏰ Recordatorio de Cita - Mañana en Copper Beauty',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #E46768 0%, #d55657 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px;
            }
            .content {
              padding: 30px 0;
            }
            .reminder-box {
              background: #fff3cd;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #ffc107;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>¡Te esperamos mañana!</h1>
          </div>
          
          <div class="content">
            <p>Hola ${data.clienteNombre},</p>
            <p>Este es un recordatorio amigable de tu cita:</p>
            
            <div class="reminder-box">
              <h3 style="margin-top: 0;">📅 Mañana ${data.fecha} a las ${data.hora}</h3>
              <p><strong>Estilista:</strong> ${data.estilista}</p>
              <p><strong>Servicios:</strong> ${data.servicios.join(', ')}</p>
            </div>

            <p>Recuerda llegar 10 minutos antes. ¡Nos vemos pronto!</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      throw error;
    }

    return result;
  } catch (error) {
    console.error('Error en sendBookingReminder:', error);
    throw error;
  }
}
