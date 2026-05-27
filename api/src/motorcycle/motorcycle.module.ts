import { MotorcycleController } from './motorcycle.controller';
import { MotorcycleService } from './motorcycle.service';
import { PrismaModule } from '@api/prisma/prisma.module';
import { AwsS3Module } from '@api/aws/aws-s3.module';
import { AuthModule } from '@api/auth/auth.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule, AuthModule, AwsS3Module],
  controllers: [MotorcycleController],
  providers: [MotorcycleService],
})
export class MotorcycleModule {}
