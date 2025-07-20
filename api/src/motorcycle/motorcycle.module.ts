import { Module } from '@nestjs/common';
import { MotorcycleController } from './motorcycle.controller';
import { MotorcycleService } from './motorcycle.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { AwsS3Module } from 'src/aws/aws-s3.module';

@Module({
	imports: [PrismaModule, AuthModule, AwsS3Module],
	controllers: [MotorcycleController],
	providers: [MotorcycleService],
})
export class MotorcycleModule {}
