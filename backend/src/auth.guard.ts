import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  private sessionPassword = process.env.SESSION_PASSWORD;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const passwordFromBody = request.body.password;

    if (!passwordFromBody) {
      throw new UnauthorizedException(
        'Password is missing in the request body',
      );
    }

    if (passwordFromBody === this.sessionPassword) {
      return true;
    } else {
      throw new UnauthorizedException('Invalid password');
    }
  }
}
