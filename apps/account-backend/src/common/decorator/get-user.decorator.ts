import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * Custom decorator to extract the user object or a specific property
 * from the Express Request object.
 *
 * @param data - The specific property name to retrieve from the user object.
 * @param ctx - The execution context of the request.
 * @returns The full user object, a specific property, or null if not found.
 */
export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    // Cast the request to a type that includes the 'user' property
    // to avoid '@typescript-eslint/no-unsafe-assignment'
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user?: Record<string, unknown> }>();

    const user = request.user;

    // Return null if the user object is not attached to the request
    if (!user) {
      return null;
    }

    // Return the specific property if 'data' is provided,
    // otherwise return the entire user object
    return data ? user[data] : user;
  },
);
