import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { ApiExceptionFilter } from 'src/commom/filters/exception-filter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MotorcycleModule } from 'src/motorcycle/motorcycle.module';
import { AwsS3Module } from 'src/aws/aws-s3.module';
import { ClientsModule } from 'src/clients/clients.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		UsersModule,
		AuthModule,
		UsersModule,
		MotorcycleModule,
		AwsS3Module,
		ClientsModule,
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
