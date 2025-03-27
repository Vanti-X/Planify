import { HttpException, HttpStatus } from '@nestjs/common';

type TField = {
  [key: string]: string | null | undefined;
};

export class BaseException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus,
    code?: string,
    fields?: TField,
  ) {
    super(
      {
        statusCode,
        error:
          statusCode === HttpStatus.BAD_REQUEST ? 'Bad Request' : 'Conflict',
        message,
        code:
          code ||
          (statusCode === HttpStatus.BAD_REQUEST ? 'BAD_REQUEST' : 'CONFLICT'),
        fields: fields || {},
      },
      statusCode,
    );
  }
}

export class QBadRequestException extends BaseException {
  constructor(message: string, code?: string, fields?: TField) {
    super(message, HttpStatus.BAD_REQUEST, code, fields);
  }
}

export class QConflictException extends BaseException {
  constructor(message: string, code?: string, fields?: TField) {
    super(message, HttpStatus.CONFLICT, code, fields);
  }
}
