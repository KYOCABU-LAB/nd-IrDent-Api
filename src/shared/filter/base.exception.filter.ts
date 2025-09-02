import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

Catch();
export class BaseExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {}
}
