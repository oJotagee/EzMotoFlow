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
exports.AwsS3Service = void 0;
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
let AwsS3Service = class AwsS3Service {
    configService;
    s3;
    bucket;
    constructor(configService) {
        this.configService = configService;
        const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
        const region = this.configService.get('AWS_REGION');
        const bucket = this.configService.get('AWS_S3_BUCKET');
        if (!accessKeyId || !secretAccessKey || !region || !bucket) {
            throw new Error('Configurações AWS não definidas no .env');
        }
        this.s3 = new client_s3_1.S3Client({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
        this.bucket = bucket;
    }
    async uploadBase64Image(base64) {
        try {
            const matches = base64.match(/^data:(image\/.+);base64,(.+)$/);
            if (!matches)
                throw new Error('Base64 inválido ou não é uma imagem');
            const mimeType = matches[1];
            const base64Data = matches[2];
            const buffer = Buffer.from(base64Data, 'base64');
            let extension = mimeType.split('/')[1];
            if (extension.includes('+')) {
                extension = extension.split('+')[0];
            }
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${extension}`;
            const command = new client_s3_1.PutObjectCommand({
                Bucket: this.bucket,
                Key: fileName,
                Body: buffer,
                ContentType: mimeType,
            });
            await this.s3.send(command);
            return `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        }
        catch (error) {
            console.error('Erro ao fazer upload da imagem:', error);
            throw new Error('Falha no upload da imagem');
        }
    }
    async deleteImage(fileUrl) {
        try {
            const fileName = fileUrl.split('/').pop();
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: this.bucket,
                Key: fileName,
            });
            await this.s3.send(command);
        }
        catch (error) {
            console.error('Erro ao deletar imagem do S3:', error);
        }
    }
};
exports.AwsS3Service = AwsS3Service;
exports.AwsS3Service = AwsS3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AwsS3Service);
//# sourceMappingURL=aws-s3.service.js.map