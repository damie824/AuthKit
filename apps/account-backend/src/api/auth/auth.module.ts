import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@authkit/account-database';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET')?.trim();
        const expiresIn = configService
          .get<string>('JWT_ACCESS_EXPIRES_IN')
          ?.toString()
          .trim();

        if (!secret || !expiresIn) {
          throw new Error(
            `JWT environment variables missing: secret=${secret}, expiresIn=${expiresIn}`,
          );
        }

        return {
          secret,
          signOptions: {
            expiresIn: expiresIn as never,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
