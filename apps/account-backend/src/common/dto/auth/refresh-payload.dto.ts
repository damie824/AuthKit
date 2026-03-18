import { UserRefreshPayloadSchema } from '@authkit/account-schema';
import { createZodDto } from 'nestjs-zod';

export class UserRefreshPayloadDto extends createZodDto(
  UserRefreshPayloadSchema,
) {}
