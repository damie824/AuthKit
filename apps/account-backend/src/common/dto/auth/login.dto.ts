import { UserLoginSchema } from '@authkit/account-schema';
import { createZodDto } from 'nestjs-zod';

export class UserLoginDto extends createZodDto(UserLoginSchema) {}
