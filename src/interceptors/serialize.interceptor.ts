import { UserDto } from './../users/dtos/user.dto';
import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';

export const Serialize = (dto: any) => {
  return UseInterceptors(new SerializeInterceptor(dto));
};

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    console.log('I am running before req handler', context);

    return next.handle().pipe(
      map((data: any) => {
        return plainToClass(data, UserDto, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
