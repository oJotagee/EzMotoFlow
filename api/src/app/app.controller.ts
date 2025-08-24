import { LoggerInterceptor } from 'src/commom/interceptors/logger.interceptor';
import { Controller, UseInterceptors } from '@nestjs/common';

@UseInterceptors(LoggerInterceptor)
@Controller()
export class AppController {}
