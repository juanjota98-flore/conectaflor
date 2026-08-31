import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

interface SupabaseWebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: Record<string, unknown>;
  old_record?: Record<string, unknown>;
}

async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string
): Promise<Response> {
  const breveApiKey = Deno.env.get("BREVO_API_KEY");

  if (!breveApiKey) {
    console.error("BREVO_API_KEY not configured");
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const payload = {
    to: [{ email: to }],
    sender: { name: "ConectaFlor", email: "noreply@conectaflor.com" },
    subject,
    htmlContent,
  };

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "api-key": breveApiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Brevo API error:", error);
  }

  return response;
}

interface EmailResult {
  subject: string;
  html: string;
  to: string;
}

function getEmailContent(event: SupabaseWebhookPayload): EmailResult | null {
  const { type, table, record, old_record } = event;

  // ========== LISTINGS (Empresas) ==========
  if (table === "listings") {
    const status = record.status as string;
    const old_status = old_record?.status as string | undefined;
    const nombre_empresa = record.nombre_empresa as string;
    const email = record.email as string;

    // Bienvenida: INSERT
    if (type === "INSERT") {
      return {
        to: email,
        subject: "Bienvenido a ConectaFlor",
        html: `
          <h2>¡Hola ${nombre_empresa}!</h2>
          <p>Gracias por registrarte en ConectaFlor.</p>
          <p>Tu solicitud está siendo revisada por nuestro equipo. Te notificaremos cuando sea aprobada.</p>
          <p>Mientras tanto, puedes explorar nuestro directorio en <a href="https://conectaflor.netlify.app">conectaflor.netlify.app</a></p>
          <p>Saludos,<br/>Equipo ConectaFlor</p>
        `,
      };
    }

    // Aprobación: UPDATE pending → approved
    if (type === "UPDATE" && old_status === "pending" && status === "approved") {
      return {
        to: email,
        subject: "¡Tu empresa ha sido aprobada en ConectaFlor!",
        html: `
          <h2>¡Felicidades ${nombre_empresa}!</h2>
          <p>Tu empresa ha sido aprobada y ahora es visible en el directorio de ConectaFlor.</p>
          <p>Puedes acceder a tu panel aquí: <a href="https://conectaflor.netlify.app/panel.html">Panel de Control</a></p>
          <p>Saludos,<br/>Equipo ConectaFlor</p>
        `,
      };
    }

    // Rechazo: UPDATE pending → rejected
    if (type === "UPDATE" && old_status === "pending" && status === "rejected") {
      return {
        to: email,
        subject: "Tu solicitud en ConectaFlor",
        html: `
          <h2>Hola ${nombre_empresa},</h2>
          <p>Lamentablemente, tu solicitud de registro no fue aprobada en esta ocasión.</p>
          <p>Si tienes preguntas, contáctanos en support@conectaflor.com</p>
          <p>Saludos,<br/>Equipo ConectaFlor</p>
        `,
      };
    }
  }

  // ========== REQUESTS (Solicitudes) ==========
  if (table === "requests") {
    const status = record.status as string;
    const old_status = old_record?.status as string | undefined;
    const titulo = record.titulo as string;
    const requester_empresa = record.requester_empresa as string;
    const recipient_empresa = record.recipient_empresa as string;
    const requester_email = record.requester_email as string;
    const recipient_email = record.recipient_email as string;

    // Nueva solicitud recibida: INSERT
    if (type === "INSERT") {
      return {
        to: recipient_email,
        subject: `Nueva solicitud de ${requester_empresa}`,
        html: `
          <h2>Hola ${recipient_empresa},</h2>
          <p>Has recibido una nueva solicitud de <strong>${requester_empresa}</strong>.</p>
          <p><strong>Solicitud:</strong> ${titulo}</p>
          <p>Puedes ver los detalles y enviar tu cotización en el panel: <a href="https://conectaflor.netlify.app/panel.html">Panel de Control</a></p>
          <p>Saludos,<br/>Equipo ConectaFlor</p>
        `,
      };
    }

    // Solicitud aceptada: UPDATE → accepted
    if (type === "UPDATE" && old_status === "quoted" && status === "accepted") {
      return {
        to: requester_email,
        subject: "Tu solicitud ha sido aceptada",
        html: `
          <h2>Hola ${requester_empresa},</h2>
          <p><strong>${recipient_empresa}</strong> ha aceptado tu solicitud: <strong>${titulo}</strong></p>
          <p>Puedes ver los detalles en tu panel: <a href="https://conectaflor.netlify.app/panel.html">Panel de Control</a></p>
          <p>Saludos,<br/>Equipo ConectaFlor</p>
        `,
      };
    }

    // Solicitud rechazada: UPDATE → rejected
    if (type === "UPDATE" && old_status === "quoted" && status === "rejected") {
      return {
        to: requester_email,
        subject: "Tu solicitud ha sido rechazada",
        html: `
          <h2>Hola ${requester_empresa},</h2>
          <p><strong>${recipient_empresa}</strong> ha rechazado tu solicitud: <strong>${titulo}</strong></p>
          <p>Puedes intentar con otro proveedor en el directorio: <a href="https://conectaflor.netlify.app">ConectaFlor</a></p>
          <p>Saludos,<br/>Equipo ConectaFlor</p>
        `,
      };
    }
  }

  // ========== QUOTES (Cotizaciones) ==========
  if (table === "quotes") {
    const status = record.status as string;
    const old_status = old_record?.status as string | undefined;
    const sender_empresa = record.sender_empresa as string;
    const requester_empresa = record.requester_empresa as string;
    const requester_email = record.requester_email as string;
    const precio = record.precio as number;
    const moneda = record.moneda as string;

    // Nueva cotización recibida: INSERT
    if (type === "INSERT") {
      return {
        to: requester_email,
        subject: `Cotización de ${sender_empresa}`,
        html: `
          <h2>Hola ${requester_empresa},</h2>
          <p>Has recibido una cotización de <strong>${sender_empresa}</strong>.</p>
          <p><strong>Monto:</strong> ${precio} ${moneda}</p>
          <p>Puedes revisar y aceptar o rechazar en tu panel: <a href="https://conectaflor.netlify.app/panel.html">Panel de Control</a></p>
          <p>Saludos,<br/>Equipo ConectaFlor</p>
        `,
      };
    }

    // Cotización aceptada: UPDATE → accepted
    if (type === "UPDATE" && old_status === "sent" && status === "accepted") {
      return {
        to: requester_email,
        subject: "Tu cotización ha sido aceptada",
        html: `
          <h2>Hola ${requester_empresa},</h2>
          <p>¡La cotización de <strong>${sender_empresa}</strong> por ${precio} ${moneda} ha sido aceptada!</p>
          <p>Próximos pasos: consulta tu panel para los detalles de entrega.</p>
          <p>Saludos,<br/>Equipo ConectaFlor</p>
        `,
      };
    }

    // Cotización rechazada: UPDATE → rejected
    if (type === "UPDATE" && old_status === "sent" && status === "rejected") {
      return {
        to: requester_email,
        subject: "Cotización rechazada",
        html: `
          <h2>Hola ${requester_empresa},</h2>
          <p>Has rechazado la cotización de <strong>${sender_empresa}</strong> por ${precio} ${moneda}.</p>
          <p>Puedes solicitar nuevas cotizaciones en tu panel: <a href="https://conectaflor.netlify.app/panel.html">Panel de Control</a></p>
          <p>Saludos,<br/>Equipo ConectaFlor</p>
        `,
      };
    }
  }

  // ========== SURPLUS (Sobrantes) ==========
  if (table === "surplus") {
    if (type === "INSERT") {
      const flores = record.flores as string;
      const cantidad = record.cantidad as string;
      const precio = record.precio as number;
      const florista_empresa = record.florista_empresa as string;

      // Nota: Este email se envía a todos los florícolas (broadcast)
      // El trigger debe manejar enviar a múltiples destinatarios
      return {
        to: "broadcast", // Marcador especial para triggers
        subject: `Sobrantes disponibles: ${flores}`,
        html: `
          <h2>Sobrantes Disponibles</h2>
          <p><strong>${florista_empresa}</strong> tiene sobrantes disponibles:</p>
          <p><strong>Flores:</strong> ${flores}</p>
          <p><strong>Cantidad:</strong> ${cantidad}</p>
          <p><strong>Precio:</strong> ${precio} USD</p>
          <p>Accede al tablón para ofertar: <a href="https://conectaflor.netlify.app">ConectaFlor</a></p>
          <p>Saludos,<br/>Equipo ConectaFlor</p>
        `,
      };
    }
  }

  return null;
}

serve(async (req) => {
  // Solo acepta POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const payload: SupabaseWebhookPayload = await req.json();

    console.log("Webhook received:", {
      type: payload.type,
      table: payload.table,
    });

    // Obtener contenido del email según el evento
    const emailContent = getEmailContent(payload);

    if (!emailContent) {
      console.log("No email to send for this event");
      return new Response(JSON.stringify({ status: "skipped" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Para broadcast (sobrantes), retornar indicador (los triggers lo manejan)
    if (emailContent.to === "broadcast") {
      console.log("Broadcast email (sobrantes):", emailContent.subject);
      return new Response(
        JSON.stringify({
          status: "pending_broadcast",
          subject: emailContent.subject,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Enviar email individual
    const brevoResponse = await sendEmail(
      emailContent.to,
      emailContent.subject,
      emailContent.html
    );

    if (!brevoResponse.ok) {
      throw new Error(`Failed to send email: ${brevoResponse.statusText}`);
    }

    console.log("Email sent successfully to:", emailContent.to);

    return new Response(
      JSON.stringify({
        status: "sent",
        email: emailContent.to,
        subject: emailContent.subject,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
