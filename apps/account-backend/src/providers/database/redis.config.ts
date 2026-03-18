import { Injectable } from '@nestjs/common';
import {
  RedisModuleOptions,
  RedisModuleOptionsFactory,
} from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisConfigService implements RedisModuleOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createRedisModuleOptions(
    name?: string,
  ): Promise<RedisModuleOptions> | RedisModuleOptions {
    const prefix = name ? `REDIS_${name.toUpperCase()}` : 'REDIS';

    // set type of redis nodes
    const mode =
      this.configService.get<'single' | 'cluster'>(`${prefix}_MODE`) ||
      'single';

    if (mode === 'cluster') {
      // get nodes from enviroment variables.
      const hostsString =
        this.configService.get<string>(`${prefix}_HOSTS`) || '';
      const nodes = hostsString
        .split(',')
        .filter(Boolean)
        .map((node) => {
          const [host, port] = node.split(':');
          return {
            host,
            port: Number(port) || 6379,
          };
        });

      if (mode === 'cluster' && nodes.length === 0) {
        throw new Error(`${prefix}_HOSTS is empty`);
      }

      // return cluster options
      return {
        type: 'cluster',
        nodes,
        options: {
          redisOptions: {
            password: this.configService.get(`${prefix}_PASSWORD`),
            showFriendlyErrorStack: false,
          },
          dnsLookup: (address, callback) => callback(null, address),
          enableReadyCheck: true,
        },
      };
    }

    // return single node options
    return {
      type: 'single',
      options: {
        host: this.configService.get(`${prefix}_HOST`) || 'localhost',
        port: Number(this.configService.get(`${prefix}_PORT`)) || 6379,
        password: this.configService.get(`${prefix}_PASSWORD`),
      },
    };
  }
}
