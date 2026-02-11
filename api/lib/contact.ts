import nodemailer from 'nodemailer';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send confirmation email to customer
const sendCustomerConfirmation = async (
  transporter: nodemailer.Transporter,
  data: ContactFormData
) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.8; 
          color: #1e293b; 
          margin: 0;
          padding: 0;
          background-color: #f1f5f9;
        }
        .wrapper {
          padding: 40px 20px;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .content { 
          padding: 40px 30px; 
          color: #1e293b;
        }
        .content h2 {
          color: #1e293b;
          margin-top: 0;
          font-size: 24px;
        }
        .content p {
          color: #475569;
          font-size: 16px;
          margin: 16px 0;
        }
        .footer { 
          background: #f8fafc;
          text-align: center; 
          padding: 24px 30px;
          color: #64748b; 
          font-size: 13px;
          border-top: 1px solid #e2e8f0;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1>Reznucek Portfolio</h1>
          </div>
          <div class="content">
            <h2>Děkujeme za Vaši zprávu!</h2>
            <p>Dobrý den ${data.name},</p>
            <p>děkuji za Váš zájem a zprávu. Vaši zprávu jsem obdržel a ozvu se Vám co nejdříve.</p>
            <p>V případě naléhavosti mě neváhejte kontaktovat přímo na emailu níže.</p>
            <p style="margin-top: 30px;">
              S pozdravem,<br>
              <strong>Reznucek</strong>
            </p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Reznucek | Všechna práva vyhrazena</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Reznucek Portfolio" <${process.env.SMTP_USER}>`,
    to: data.email,
    subject: 'Děkujeme za Váš zájem | Reznucek Portfolio',
    html,
  });
};

// Send notification email to site owner
const sendOwnerNotification = async (
  transporter: nodemailer.Transporter,
  data: ContactFormData
) => {
  const html = `
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
            <div class="label">Jméno</div>
            <div class="value">${data.name}</div>
          </div>
          <div class="field">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
          </div>
          <div class="field">
            <div class="label">Předmět</div>
            <div class="value">${data.subject}</div>
          </div>
          <div class="field">
            <div class="label">Zpráva</div>
            <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
          </div>
          <div class="field" style="background: #fef3c7; border-left: 4px solid #eab308;">
            <div class="label" style="color: #92400e;">Čas odeslání</div>
            <div class="value" style="color: #92400e;">
              ${new Date().toLocaleString('cs-CZ')}
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Web Kontakt" <${process.env.SMTP_USER}>`,
    to: 'Denis@Reznicek.xyz',
    replyTo: data.email,
    subject: `Nová zpráva - ${data.name} | ${data.subject}`,
    html,
  });
};

export const handleContactForm = async (data: ContactFormData) => {
  // Validate required fields
  if (!data.name || !data.email || !data.subject || !data.message) {
    throw new Error('Chybí povinné údaje (jméno, email, předmět, zpráva)');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error('Neplatný formát emailu');
  }

  const transporter = createTransporter();

  // Send both emails
  await Promise.all([
    sendCustomerConfirmation(transporter, data),
    sendOwnerNotification(transporter, data),
  ]);

  return { success: true, message: 'Zpráva byla úspěšně odeslána' };
};
