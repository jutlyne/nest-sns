import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';
export interface Response<T> {
    statusCode: number;
    message: string;
    data: T;
}
export declare class TransformResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    private readonly cls;
    constructor(cls: ClsService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>>;
}
