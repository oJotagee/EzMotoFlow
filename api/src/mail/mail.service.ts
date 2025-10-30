import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
	private transporter: nodemailer.Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: Number(process.env.SMTP_PORT),
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
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
			from: process.env.FROM_EMAIL,
			to: clientEmail,
			subject: 'Assinatura de Contrato - EzMotoFlow',
			html: `
        <h2>Olá, ${clientName}!</h2>
        <p>Você foi convidado para assinar um contrato.</p>
        <p>Clique no link abaixo para visualizar e assinar o contrato:</p>
        <a href="${signatureUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Assinar Contrato
        </a>
        <p>Este link é válido por 48 horas.</p>
        <p>Atenciosamente,<br>Equipe EzMotoFlow</p>
      `,
		};

		await this.transporter.sendMail(mailOptions);
	}
}
