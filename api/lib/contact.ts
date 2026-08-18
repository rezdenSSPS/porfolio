interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

// Sender + recipient are configurable; sender must be on a Resend-verified
// domain (reznicek.xyz is verified via the resend._domainkey DNS records).
const FROM_ADDRESS = process.env.RESEND_FROM || 'Denis Řezníček <kontakt@reznicek.xyz>';
const OWNER_ADDRESS = process.env.CONTACT_TO || 'denis@reznicek.xyz';
const LOGO_URL = 'https://reznicek.xyz/logo-light.png';

// Escape user-supplied values before interpolating into email HTML.
const esc = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

interface ResendPayload {
  from: string;
  to: string;
  subject: string;
  html: string;
  reply_to?: string;
}

// Send an email through the Resend HTTP API.
const sendViaResend = async (payload: ResendPayload): Promise<void> => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY není nastaven. Nastavte ho v proměnných prostředí.');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`Resend send failed (${response.status}):`, body);
    throw new Error('Nepodařilo se odeslat e-mail. Zkuste to prosím znovu.');
  }
};

// HTML for the confirmation email sent to the person who filled the form.
const buildCustomerConfirmation = (data: ContactFormData): string => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #1e293b;
          margin: 0;
          padding: 0;
          background-color: #f8fafc;
          -webkit-font-smoothing: antialiased;
        }
        .wrapper { padding: 32px 20px; }
        .container {
          max-width: 580px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }
        .header {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: #1e293b;
          padding: 32px 32px 24px;
          text-align: center;
        }
        .logo {
          width: 64px;
          height: 64px;
          margin: 0 auto 16px;
          display: block;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em; }
        .header .subtitle { margin-top: 6px; font-size: 14px; opacity: 0.9; font-weight: 500; }
        .content { padding: 32px; color: #334155; }
        .content h2 { color: #0f172a; margin-top: 0; margin-bottom: 16px; font-size: 20px; font-weight: 600; }
        .content p { color: #475569; font-size: 15px; margin: 0 0 16px 0; line-height: 1.6; }
        .contact-section {
          background: #fefce8;
          border: 1px solid #fef08a;
          border-radius: 8px;
          padding: 20px;
          margin: 24px 0;
        }
        .contact-section h3 {
          margin: 0 0 12px 0;
          color: #854d0e;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }
        .contact-item { margin: 10px 0; color: #1e293b; }
        .contact-item a { color: #0f172a; text-decoration: none; font-size: 15px; font-weight: 500; }
        .signature { margin-top: 24px; padding-top: 24px; border-top: 1px solid #e2e8f0; }
        .signature-name { font-size: 16px; font-weight: 600; color: #0f172a; margin: 0; }
        .signature-title { color: #b45309; font-weight: 500; font-size: 13px; margin-top: 2px; }
        .footer {
          background: #f8fafc;
          text-align: center;
          padding: 20px 32px;
          color: #64748b;
          font-size: 13px;
          border-top: 1px solid #e2e8f0;
        }
        .footer a { color: #b45309; text-decoration: none; font-weight: 500; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <img src="${LOGO_URL}" alt="Denis Řezníček" class="logo">
            <h1>Děkuji za Vaši zprávu!</h1>
            <div class="subtitle">Web &amp; Mobile Developer</div>
          </div>
          <div class="content">
            <h2>Dobrý den ${esc(data.name)},</h2>
            <p>Děkuji za Váš zájem a zprávu. Vaši poptávku jsem obdržel a ozvu se Vám co nejdříve, obvykle do 24 hodin.</p>

            <div class="contact-section">
              <h3>Přímý kontakt</h3>
              <div class="contact-item">
                <span style="color: #b45309; font-weight: 600; margin-right: 12px; font-size: 13px;">E-mail:</span>
                <a href="mailto:denis@reznicek.xyz">denis@reznicek.xyz</a>
              </div>
              <div class="contact-item">
                <span style="color: #b45309; font-weight: 600; margin-right: 12px; font-size: 13px;">Telefon:</span>
                <a href="tel:+420776523655">+420 776 523 655</a>
              </div>
            </div>

            <p>Těším se na naši spolupráci!</p>

            <div class="signature">
              <p class="signature-name">Denis Řezníček</p>
              <p class="signature-title">Web &amp; Mobile Developer</p>
            </div>
          </div>
          <div class="footer">
            <p>© 2026 Denis Řezníček | <a href="https://reznicek.xyz">reznicek.xyz</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

// HTML for the notification email sent to the site owner.
const buildOwnerNotification = (data: ContactFormData): string => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #eab308; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; padding: 10px; background: white; border-radius: 4px; }
        .label { font-weight: bold; color: #64748b; font-size: 12px; text-transform: uppercase; }
        .value { font-size: 16px; color: #1e293b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Nová zpráva z portfolia!</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Jméno a příjmení</div>
            <div class="value">${esc(data.name)}</div>
          </div>
          <div class="field">
            <div class="label">Telefon</div>
            <div class="value"><a href="tel:${esc(data.phone)}">${esc(data.phone)}</a></div>
          </div>
          <div class="field">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${esc(data.email)}">${esc(data.email)}</a></div>
          </div>
          <div class="field">
            <div class="label">Předmět</div>
            <div class="value">${esc(data.subject)}</div>
          </div>
          <div class="field">
            <div class="label">Zpráva</div>
            <div class="value">${esc(data.message).replace(/\n/g, '<br>')}</div>
          </div>
          <div class="field" style="background: #fef3c7; border-left: 4px solid #eab308;">
            <div class="label" style="color: #92400e;">Čas odeslání</div>
            <div class="value" style="color: #92400e;">${new Date().toLocaleString('cs-CZ')}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

export const handleContactForm = async (data: ContactFormData) => {
  // Validate required fields
  if (!data.name || !data.phone || !data.email || !data.subject || !data.message) {
    throw new Error('Chybí povinné údaje (jméno, telefon, email, předmět, zpráva)');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error('Neplatný formát emailu');
  }

  // Notify the owner first (most important); confirmation to the visitor second.
  await sendViaResend({
    from: FROM_ADDRESS,
    to: OWNER_ADDRESS,
    reply_to: data.email,
    subject: `Nová zpráva - ${data.name} | ${data.subject}`,
    html: buildOwnerNotification(data),
  });

  await sendViaResend({
    from: FROM_ADDRESS,
    to: data.email,
    reply_to: OWNER_ADDRESS,
    subject: 'Potvrzení přijetí zprávy | Denis Řezníček',
    html: buildCustomerConfirmation(data),
  });

  return { success: true, message: 'Zpráva byla úspěšně odeslána' };
};
