import { Controller, UseInterceptors } from '@nestjs/common';
import { LoggerInterceptor } from 'src/commom/interceptors/logger.interceptor';

@UseInterceptors(LoggerInterceptor)
@Controller()
export class AppController {}
