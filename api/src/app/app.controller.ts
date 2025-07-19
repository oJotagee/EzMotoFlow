import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggerInterceptor } from 'src/commom/interceptors/logger.interceptor';

@UseInterceptors(LoggerInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
