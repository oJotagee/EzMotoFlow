import { ConfigService } from '@nestjs/config';
export declare class AwsS3Service {
    private configService;
    private s3;
    private bucket;
    constructor(configService: ConfigService);
    uploadBase64Image(base64: string): Promise<string>;
    deleteImage(fileUrl: string): Promise<void>;
}
