"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let EmailService = class EmailService {
    transporter;
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
    async sendSignatureLink(clientEmail, clientName, contractId, signatureToken) {
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
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=mail.service.js.map