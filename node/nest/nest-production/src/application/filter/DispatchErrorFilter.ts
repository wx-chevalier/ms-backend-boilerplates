import { HttpException } from '@nestjs/core';
import { Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'sequelize';

/**
 *
 */
@Catch(ValidationError, HttpException, Error)
export class DispatchErrorFilter implements ExceptionFilter {
  public catch(err, res) {
    if (err instanceof ValidationError) {
      /* Sequelize validation error. */
      res.setHeader(
        'x-message-code-error',
        (err as ValidationError).errors[0].type
      );
      res.setHeader('x-message', (err as ValidationError).errors[0].message);
      res.setHeader('x-httpStatus-error', HttpStatus.BAD_REQUEST);

      return res.status(HttpStatus.BAD_REQUEST).send();
    } else {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }
}
