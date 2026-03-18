import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './providers/database/typeorm.config';
import { AuthModule } from './api/auth/auth.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisConfigService } from './providers/database/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    RedisModule.forRootAsync(
      {
        imports: [ConfigModule],
        inject: [ConfigService], // ConfigService 주입
        useFactory: (configService: ConfigService) => {
          const redisConfig = new RedisConfigService(configService);
          return redisConfig.createRedisModuleOptions('auth'); // 여기서 명시적으로 'auth' 전달
        },
      },
      'auth',
    ),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
