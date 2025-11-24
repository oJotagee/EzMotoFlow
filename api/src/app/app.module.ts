import { ApiExceptionFilter } from 'src/commom/filters/exception-filter';
import { MotorcycleModule } from 'src/motorcycle/motorcycle.module';
import { ContractModule } from 'src/contract/contract.module';
import { ClientsModule } from 'src/clients/clients.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UsersModule } from 'src/users/users.module';
import { AwsS3Module } from 'src/aws/aws-s3.module';
import { AuthModule } from 'src/auth/auth.module';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { APP_FILTER } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { join } from 'path';

@Module({
	imports: [
		UsersModule,
		AuthModule,
		MotorcycleModule,
		AwsS3Module,
		ClientsModule,
		ContractModule,
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', '..', 'files'),
			serveRoot: '/files',
		}),
		ConfigModule.forRoot({
			isGlobal: true,
		}),
	],
	controllers: [AppController],
	providers: [
		{
			provide: APP_FILTER,
			useClass: ApiExceptionFilter,
		},
		AppService,
	],
})
export class AppModule {}
