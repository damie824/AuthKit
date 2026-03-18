import { UserRegisterSchema } from '@authkit/account-schema';
import { createZodDto } from 'nestjs-zod';

export class UserRegisterDto extends createZodDto(UserRegisterSchema) {}
