import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private createTransporter() {
    const port = Number(process.env.SMTP_PORT) || 587;
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
      socketTimeout: 10000,
    });
  }

  async sendSignatureLink(
    clientEmail: string,
    clientName: string,
    contractId: string,
    signatureToken: string,
  ) {
    const signatureUrl = `${process.env.FRONTEND_URL}/signature/${contractId}?token=${signatureToken}`;

    const mailOptions = {
      from: `EzMotoFlow <${process.env.FROM_EMAIL}>`,
      to: clientEmail,
      subject: 'Assinatura de Contrato - EzMotoFlow',
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Assinatura de Contrato</title>
        </head>
        <body style="margin:0;padding:0;background-color:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

                  <!-- Header -->
                  <tr>
                    <td align="center" bgcolor="#0f3460" style="background-color:#0f3460;border-radius:12px 12px 0 0;padding:40px 48px;">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">EzMotoFlow</h1>
                            <p style="margin:6px 0 0;color:#a0bcd8;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Gestão de Contratos</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="background:#ffffff;padding:48px;">

                      <h2 style="margin:0 0 8px;color:#1a1a2e;font-size:22px;font-weight:700;">Olá, ${clientName}!</h2>
                      <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
                        Você tem um contrato aguardando a sua assinatura. Por favor, revise os detalhes e assine digitalmente clicando no botão abaixo.
                      </p>

                      <!-- Info box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                        <tr>
                          <td style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #0f3460;border-radius:8px;padding:16px 20px;">
                            <table cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding-right:12px;font-size:20px;vertical-align:top;">📋</td>
                                <td>
                                  <p style="margin:0 0 4px;color:#1a1a2e;font-size:14px;font-weight:600;">Contrato de Venda</p>
                                  <p style="margin:0;color:#6b7280;font-size:13px;">Este link é válido por <strong style="color:#1a1a2e;">48 horas</strong> a partir do recebimento deste email.</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                        <tr>
                          <td align="center">
                            <a href="${signatureUrl}"
                              style="display:inline-block;background-color:#0f3460;color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;padding:16px 48px;border-radius:8px;letter-spacing:0.3px;">
                              ✍️ &nbsp; Assinar Contrato
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="margin:0 0 8px;color:#9ca3af;font-size:13px;text-align:center;">
                        Ou copie e cole o link abaixo no seu navegador:
                      </p>
                      <p style="margin:0;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:12px 16px;font-size:12px;color:#6b7280;word-break:break-all;text-align:center;">
                        ${signatureUrl}
                      </p>

                    </td>
                  </tr>

                  <!-- Divider -->
                  <tr>
                    <td style="background:#ffffff;padding:0 48px;">
                      <hr style="border:none;border-top:1px solid #e2e8f0;margin:0;" />
                    </td>
                  </tr>

                  <!-- Warning -->
                  <tr>
                    <td style="background:#ffffff;padding:24px 48px;">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding-right:10px;font-size:18px;vertical-align:top;">⚠️</td>
                          <td>
                            <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.6;">
                              Se você não esperava receber este email ou acredita que foi um engano, ignore esta mensagem. Nenhuma ação será tomada sem a sua assinatura.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center" style="background:#f8fafc;border-radius:0 0 12px 12px;border-top:1px solid #e2e8f0;padding:24px 48px;">
                      <p style="margin:0 0 4px;color:#1a1a2e;font-size:14px;font-weight:600;">EzMotoFlow</p>
                      <p style="margin:0;color:#9ca3af;font-size:12px;">Este é um email automático, por favor não responda.</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    const transporter = this.createTransporter();
    try {
      await transporter.sendMail(mailOptions);
    } finally {
      transporter.close();
    }
  }
}
