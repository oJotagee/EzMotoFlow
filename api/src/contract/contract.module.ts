import { ContractController } from './contract.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ContractService } from './contract.service';
import { EmailModule } from 'src/mail/mail.module';
import { AuthModule } from 'src/auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AwsS3Module } from 'src/aws/aws-s3.module';

@Module({
	imports: [PrismaModule, AuthModule, HttpModule, EmailModule, AwsS3Module],
	controllers: [ContractController],
	providers: [ContractService],
})
export class ContractModule {}
