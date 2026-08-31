import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

interface SupabaseWebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  record: {
    id: string;
    email: string;
    nombre_empresa: string;
    status: "pending" | "approved" | "rejected";
    tipo: string;
  };
  old_record?: {
    status: string;
  };
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

function getEmailContent(
  event: SupabaseWebhookPayload
): { subject: string; html: string } | null {
  const { type, record, old_record } = event;
  const { nombre_empresa, email, status } = record;

  // Bienvenida: cuando se registra una nueva empresa
  if (type === "INSERT") {
    return {
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

  // Aprobación: cuando el admin cambia status a 'approved'
  if (type === "UPDATE" && old_record?.status === "pending" && status === "approved") {
    return {
      subject: "¡Tu empresa ha sido aprobada en ConectaFlor!",
      html: `
        <h2>¡Felicidades ${nombre_empresa}!</h2>
        <p>Tu empresa ha sido aprobada y ahora es visible en el directorio de ConectaFlor.</p>
        <p>Puedes acceder a tu panel aquí: <a href="https://conectaflor.netlify.app/panel.html">Panel de Control</a></p>
        <p>Saludos,<br/>Equipo ConectaFlor</p>
      `,
    };
  }

  // Rechazo: cuando el admin cambia status a 'rejected'
  if (type === "UPDATE" && old_record?.status === "pending" && status === "rejected") {
    return {
      subject: "Tu solicitud en ConectaFlor",
      html: `
        <h2>Hola ${nombre_empresa},</h2>
        <p>Lamentablemente, tu solicitud de registro no fue aprobada en esta ocasión.</p>
        <p>Si tienes preguntas, contáctanos en support@conectaflor.com</p>
        <p>Saludos,<br/>Equipo ConectaFlor</p>
      `,
    };
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
      email: payload.record.email,
      status: payload.record.status,
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

    // Enviar email
    const brevoResponse = await sendEmail(
      payload.record.email,
      emailContent.subject,
      emailContent.html
    );

    if (!brevoResponse.ok) {
      throw new Error(`Failed to send email: ${brevoResponse.statusText}`);
    }

    console.log("Email sent successfully to:", payload.record.email);

    return new Response(
      JSON.stringify({
        status: "sent",
        email: payload.record.email,
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
