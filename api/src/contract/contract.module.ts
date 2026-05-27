import { ContractController } from './contract.controller';
import { PrismaModule } from '@api/prisma/prisma.module';
import { ContractService } from './contract.service';
import { EmailModule } from '@api/mail/mail.module';
import { AuthModule } from '@api/auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AwsS3Module } from '@api/aws/aws-s3.module';

@Module({
  imports: [PrismaModule, AuthModule, HttpModule, EmailModule, AwsS3Module],
  controllers: [ContractController],
  providers: [ContractService],
})
export class ContractModule {}
