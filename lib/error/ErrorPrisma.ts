import { RpcException } from '@nestjs/microservices';
interface Err {
  constructor?: { name: string };
  message: string;
  code?: string;
}
export class ErroPrisma {
  constructor(public erro: unknown) {
    const error = erro as Err;
    const errorClassName = error.constructor?.name;
    const errorConfig: Record<string, { status: number; message: string }> = {
      P1000: { status: 500, message: 'Database Authentication failed' },
      P1001: { status: 500, message: 'Can not reach database server' },
      P1002: { status: 504, message: 'Database Connection timeout' },
      P1003: { status: 500, message: 'Database file not found' },
      P2000: {
        status: 400,
        message:
          'The values exceeds the limit allowed by the column in the database.',
      },
      P2002: { status: 409, message: 'Duplication of unique values' },
      P2003: { status: 422, message: 'Foreign key constraint failed' },
      P2011: { status: 400, message: 'Null value saved in a non-null field.' },
      P2014: { status: 400, message: 'Required relation violation' },
      P2025: { status: 404, message: 'Register not found' },
    };

    if (errorClassName === 'PrismaClientValidationError') {
      throw new RpcException({
        message: 'Input data is poorly formatted or invalid for the database.',
        status: 400,
      });
    }

    if (
      errorClassName === 'PrismaClientInitializationError' ||
      errorClassName === 'PrismaClientUnknownRequestError' ||
      errorClassName === 'PrismaClientRustPanicError'
    ) {
      throw new RpcException({
        message: 'Internal infrastructure error or database connection error.',
        status: 500,
      });
    }

    if (!error.code) {
      throw new RpcException({
        message: 'Intern error',
        status: 500,
      });
    }

    if (errorConfig[error.code]) {
      const config = errorConfig[error.code];
      throw new RpcException({
        message: config.message,
        status: config.status,
      });
    }

    throw new RpcException({
      message: 'Internal server error',
      status: 500,
    });
  }
}
