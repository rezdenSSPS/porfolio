import * as nodemailer from 'nodemailer';

interface ContactFormData {
  name: string;
  phone: string;
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
          background: linear-gradient(135deg, #eab308 0%, #fbbf24 100%); 
          color: #1e293b; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .header .subtitle {
          margin-top: 8px;
          font-size: 14px;
          opacity: 0.8;
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
        .contact-box {
          background: linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%);
          border: 2px solid #eab308;
          border-radius: 12px;
          padding: 24px;
          margin: 24px 0;
        }
        .contact-box h3 {
          margin: 0 0 16px 0;
          color: #92400e;
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .contact-item {
          display: flex;
          align-items: center;
          margin: 12px 0;
          color: #1e293b;
        }
        .contact-item a {
          color: #1e293b;
          text-decoration: none;
        }
        .contact-item a:hover {
          text-decoration: underline;
        }
        .contact-icon {
          width: 24px;
          height: 24px;
          background: #eab308;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          font-size: 12px;
        }
        .signature {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #f1f5f9;
        }
        .signature-name {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
        }
        .signature-title {
          color: #eab308;
          font-weight: 600;
          font-size: 14px;
          margin-top: 4px;
        }
        .footer { 
          background: #1e293b;
          text-align: center; 
          padding: 24px 30px;
          color: #94a3b8; 
          font-size: 13px;
        }
        .footer a {
          color: #eab308;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1>Děkuji za zprávu!</h1>
            <div class="subtitle">Denis Řezníček | Vývojář</div>
          </div>
          <div class="content">
            <h2>Dobrý den ${data.name},</h2>
            <p>děkuji za Váš zájem a zprávu. Vaši poptávku jsem obdržel a ozvu se Vám co nejdříve, obvykle do 24 hodin.</p>
            <p>V případě naléhavosti mě neváhejte kontaktovat přímo:</p>
            
            <div class="contact-box">
              <h3>Kontakt</h3>
              <div class="contact-item">
                <span class="contact-icon">📧</span>
                <a href="mailto:denis@reznicek.xyz">denis@reznicek.xyz</a>
              </div>
              <div class="contact-item">
                <span class="contact-icon">📞</span>
                <a href="tel:+420776523655">+420 776 523 655</a>
              </div>
            </div>
            
            <p>Těším se na naši spolupráci!</p>
            
            <div class="signature">
              <div class="signature-name">Denis Řezníček</div>
              <div class="signature-title">Web & Mobile Developer</div>
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

  await transporter.sendMail({
    from: `"Denis Řezníček" <${process.env.SMTP_USER}>`,
    to: data.email,
    subject: 'Děkuji za Vaši zprávu | Denis Řezníček',
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
            <div class="label">Jméno a příjmení</div>
            <div class="value">${data.name}</div>
          </div>
          <div class="field">
            <div class="label">Telefon</div>
            <div class="value"><a href="tel:${data.phone}">${data.phone}</a></div>
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
  if (!data.name || !data.phone || !data.email || !data.subject || !data.message) {
    throw new Error('Chybí povinné údaje (jméno, telefon, email, předmět, zpráva)');
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
