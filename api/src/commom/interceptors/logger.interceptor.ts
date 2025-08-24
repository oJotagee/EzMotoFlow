import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
	intercept(
		context: ExecutionContext,
		next: CallHandler<any>,
	): Observable<any> | Promise<Observable<any>> {
		const now = Date.now();

		return next.handle().pipe(
			tap(() => {
				console.log(`${Date.now() - now}ms`);
			}),
		);
	}
}
