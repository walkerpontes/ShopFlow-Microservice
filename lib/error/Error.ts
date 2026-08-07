import { HttpException } from '@nestjs/common';
import { catchError, MonoTypeOperatorFunction } from 'rxjs';

interface RpcError {
  message: string;
  status: number;
}
export default function DefaultErro<T>(): MonoTypeOperatorFunction<T> {
  return catchError((err) => {
    const error = err as RpcError;
    throw new HttpException(error.message, error.status);
  });
}
