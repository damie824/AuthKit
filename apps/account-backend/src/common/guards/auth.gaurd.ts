import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Authenticates the request by verifying the JWT stored in cookies.
   * * @param ctx - The execution context of the current request.
   * @returns A boolean indicating whether the request is authorized.
   */
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    try {
      const request = ctx
        .switchToHttp()
        .getRequest<Request & { user?: Record<string, unknown> }>();

      // Access 'sid' from cookies and ensure it's treated as a string for verification
      const accessToken = request.cookies?.['sid'] as string | undefined;

      if (!accessToken) {
        return false;
      }

      // Verify the JWT and cast the result to a safe record type
      const user =
        await this.jwtService.verifyAsync<Record<string, unknown>>(accessToken);

      // Attach the verified user payload to the request object
      request.user = user;

      return true;
    } catch {
      // Return false if token verification fails or any error occurs
      return false;
    }
  }
}
