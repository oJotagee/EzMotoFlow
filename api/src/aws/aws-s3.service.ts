import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class AwsS3Service {
	private s3: S3Client;
	private bucket: string;

	constructor(private configService: ConfigService) {
		const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
		const secretAccessKey = this.configService.get<string>(
			'AWS_SECRET_ACCESS_KEY',
		);
		const region = this.configService.get<string>('AWS_REGION');
		const bucket = this.configService.get<string>('AWS_S3_BUCKET');

		if (!accessKeyId || !secretAccessKey || !region || !bucket) {
			throw new Error('Configurações AWS não definidas no .env');
		}

		this.s3 = new S3Client({
			region,
			credentials: {
				accessKeyId,
				secretAccessKey,
			},
		});

		this.bucket = bucket;
	}

	async uploadBase64Image(base64: string): Promise<string> {
		try {
			// Regex para capturar o mimeType e o conteúdo base64 (apenas imagens)
			const matches = base64.match(/^data:(image\/.+);base64,(.+)$/);
			if (!matches) throw new Error('Base64 inválido ou não é uma imagem');

			const mimeType = matches[1]; // ex: image/jpeg
			const base64Data = matches[2];

			// Cria buffer a partir do base64
			const buffer = Buffer.from(base64Data, 'base64');

			// Extrai a extensão do mimeType (ex: jpeg, png, gif)
			let extension = mimeType.split('/')[1];
			// Tratamento para mime types com "+", ex: svg+xml -> svg
			if (extension.includes('+')) {
				extension = extension.split('+')[0];
			}

			// Gera nome de arquivo único
			const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${extension}`;

			// Cria o comando para envio ao S3
			const command = new PutObjectCommand({
				Bucket: this.bucket,
				Key: fileName,
				Body: buffer,
				ContentType: mimeType,
			});

			// Envia para o S3
			await this.s3.send(command);

			// Retorna a URL pública do arquivo
			return `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
		} catch (error) {
			// Log ou tratamento específico que quiser
			console.error('Erro ao fazer upload da imagem:', error);
			throw new Error('Falha no upload da imagem');
		}
	}

	async deleteImage(fileUrl: string): Promise<void> {
		try {
			const fileName = fileUrl.split('/').pop(); // extrai o nome do arquivo
			const command = new DeleteObjectCommand({
				Bucket: this.bucket,
				Key: fileName,
			});

			await this.s3.send(command);
		} catch (error) {
			console.error('Erro ao deletar imagem do S3:', error);
		}
	}
}
