import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
//import { findSubstringInArray } from '../util';
import { DrizzleError } from 'drizzle-orm';

@Catch(DrizzleError)
export class DrizzleExceptionFilter implements ExceptionFilter {
  catch(exception: DrizzleError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    console.error('Uncaugh DrizzleError:', exception);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
