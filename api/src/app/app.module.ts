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

@Module({
	imports: [
		UsersModule,
		AuthModule,
		UsersModule,
		MotorcycleModule,
		AwsS3Module,
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', '..', 'files'),
			serveRoot: '/files',
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
