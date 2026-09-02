import 'dotenv/config'
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express'

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwt: JwtService) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (token === undefined) {
      throw new UnauthorizedException('Please Login to access application')
    }
    else {
      try {
        const payload = await this.jwt.verifyAsync(token, { secret: process.env.JWTSECRET });
        request['user'] = payload;
      } catch {
        throw new UnauthorizedException('Login Expired....');
      }
      return true;
    }
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const token = req.headers.authorization;
    if (token) {
      console.log(token);
      return token;
    } else {
      return undefined;
    }
  }

}
