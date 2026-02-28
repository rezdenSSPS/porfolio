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
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  
  console.log('SMTP Config:', {
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    hasUser: !!smtpUser,
    hasPass: !!smtpPass,
  });
  
  if (!smtpUser || !smtpPass) {
    throw new Error('SMTP credentials are not configured. Please set SMTP_USER and SMTP_PASS environment variables.');
  }
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
};

// Send confirmation email to customer
const sendCustomerConfirmation = async (
  transporter: nodemailer.Transporter,
  data: ContactFormData
) => {
  const logoUrl = 'https://res.cloudinary.com/dg3rfqbvz/image/upload/v1770833911/portfolio/logos/logo-light.png';
  
  const html = `
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
        .wrapper {
          padding: 32px 20px;
        }
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
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.025em;
        }
        .header .subtitle {
          margin-top: 6px;
          font-size: 14px;
          opacity: 0.9;
          font-weight: 500;
        }
        .content { 
          padding: 32px; 
          color: #334155;
        }
        .content h2 {
          color: #0f172a;
          margin-top: 0;
          margin-bottom: 16px;
          font-size: 20px;
          font-weight: 600;
        }
        .content p {
          color: #475569;
          font-size: 15px;
          margin: 0 0 16px 0;
          line-height: 1.6;
        }
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
        .contact-item {
          display: flex;
          align-items: center;
          margin: 10px 0;
          color: #1e293b;
        }
        .contact-item:first-of-type {
          margin-top: 0;
        }
        .contact-item:last-of-type {
          margin-bottom: 0;
        }
        .contact-item a {
          color: #0f172a;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
        }
        .contact-item a:hover {
          color: #b45309;
          text-decoration: underline;
        }
        .signature {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #e2e8f0;
        }
        .signature-row {
          display: flex;
          align-items: center;
        }
        .signature-logo {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          margin-right: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .signature-info {
          flex: 1;
        }
        .signature-name {
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
          margin: 0;
        }
        .signature-title {
          color: #b45309;
          font-weight: 500;
          font-size: 13px;
          margin-top: 2px;
        }
        .footer { 
          background: #f8fafc;
          text-align: center; 
          padding: 20px 32px;
          color: #64748b; 
          font-size: 13px;
          border-top: 1px solid #e2e8f0;
        }
        .footer a {
          color: #b45309;
          text-decoration: none;
          font-weight: 500;
        }
        .footer a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <img src="${logoUrl}" alt="Denis Řezníček" class="logo">
            <h1>Děkuji za Vaši zprávu!</h1>
            <div class="subtitle">Web & Mobile Developer</div>
          </div>
          <div class="content">
            <h2>Dobrý den ${data.name},</h2>
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
              <div class="signature-row">
                <img src="${logoUrl}" alt="Logo" class="signature-logo">
                <div class="signature-info">
                  <p class="signature-name">Denis Řezníček</p>
                  <p class="signature-title">Web & Mobile Developer</p>
                </div>
              </div>
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
    subject: 'Potvrzení přijetí zprávy | Denis Řezníček',
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
