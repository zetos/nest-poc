import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { findSubstringInArray } from '../util';

import { DatabaseError } from 'pg';

@Catch(DatabaseError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: DatabaseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const code = exception.code;
    if (code === '23505') {
      const match = exception.detail!.match(/\(([^)]+)\)/);
      const uniqueField = match ? match[1] : null;

      if (!uniqueField) {
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
      } else {
        response.status(HttpStatus.BAD_REQUEST).json({
          message: [`${uniqueField} must be unique.`],
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
    } else if (code === '23503') {
      const match = exception.detail!.match(/\(([^)]+)\)/);
      const uniqueField = match ? match[1] : null;

      if (!uniqueField) {
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
      } else {
        const reqBodyKeys = Object.keys(request.body);
        const subString =
          findSubstringInArray(uniqueField, reqBodyKeys) || 'unknown';
        response.status(HttpStatus.BAD_REQUEST).json({
          message: [`${subString} not found.`],
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
    } else {
      console.error('>>> Uncaugh DatabaseError:', exception);
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
