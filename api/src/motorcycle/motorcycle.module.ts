import { MotorcycleController } from './motorcycle.controller';
import { MotorcycleService } from './motorcycle.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AwsS3Module } from 'src/aws/aws-s3.module';
import { AuthModule } from 'src/auth/auth.module';
import { Module } from '@nestjs/common';

@Module({
	imports: [PrismaModule, AuthModule, AwsS3Module],
	controllers: [MotorcycleController],
	providers: [MotorcycleService],
})
export class MotorcycleModule {}
