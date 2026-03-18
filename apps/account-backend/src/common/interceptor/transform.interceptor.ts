import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data: unknown) => ({
        success: true,
        timestamp: new Date().toISOString(),
        data,
      })),
    );
  }
}
