import { UserEntity } from '@authkit/account-database';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRegisterDto } from 'src/common/dto/auth/register.dto';
import { Repository } from 'typeorm';
import { UserLoginDto } from 'src/common/dto/auth/login.dto';
import { randomBytes } from 'crypto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import * as bcrypt from 'bcrypt';
import Redis from 'ioredis';
import { UserRefreshPayloadDto } from 'src/common/dto/auth/refresh-payload.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRedis('auth') private readonly authRedis: Redis,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Proceeds with user registration using the provided information.
   *
   * @param registerDto The data required for user registration.
   */
  async register(
    registerDto: UserRegisterDto,
  ): Promise<{ registered: boolean }> {
    const existingUser = await this.userRepository.findOneBy({
      email: registerDto.email,
    });
    if (existingUser)
      throw new ConflictException(
        'User who use requested email already exist.',
      );

    //generate empty user object
    const user = this.userRepository.create({
      email: registerDto.email,
      nickname: registerDto.nickname,
    });

    //generate hashed password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hasehdPassword = await bcrypt.hash(registerDto.password, salt);
    user.password = hasehdPassword;

    //save registered user
    await this.userRepository.save(user);
    this.logger.log(`Created new user : ${user.id}`);
    return { registered: true };
  }

  /**
   * Validates the login credentials and returns the user information.
   *
   * @param loginDto The input data required for login.
   * @returns The user information.
   */
  async validateUser(loginDto: UserLoginDto): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({
      email: loginDto.email as string,
    });
    if (!user)
      throw new NotFoundException('Could not find user with requested email');

    // validate password
    const validatePw = await bcrypt.compare(
      loginDto.password as string,
      user.password,
    );
    if (!validatePw) throw new UnauthorizedException('Incorrect password.');

    return user;
  }

  /**
   * Genereate new access token
   *
   * @param user The data required for generate access token.
   * @returns Generated access token
   */
  async generateAccessToken(
    user: UserEntity,
  ): Promise<{ access_token: string; expires_in: number }> {
    const payload = {
      id: user.id,
    };
    const ttl = this.configService.get<number>('JWT_ACCESS_EXPIRES_IN') || 0;
    const options: JwtSignOptions = {
      expiresIn: ttl,
    };
    const token = await this.jwtService.signAsync(payload, options);
    return {
      access_token: token,
      expires_in: ttl,
    };
  }

  /**
   * Generates a refresh token based on the provided user and login data.
   *
   * @param loginDto The login request payload
   * @param user The authenticated user.
   * @param userIp The client's IP address.
   * @returns The newly issued refresh token.
   */
  async generateRefreshToken(
    user: UserEntity,
    device: string,
    userIp: string,
  ): Promise<{ refresh_token: string; refresh_token_expires_in: number }> {
    const opaque = randomBytes(32).toString('base64url');
    const metadata = JSON.stringify({
      ip: userIp,
      device: device,
      createdAt: new Date().toISOString(),
    });
    const ttl = this.configService.get<number>('REFRESH_TOKEN_EXPIRES_IN') || 0;
    await this.authRedis.set(
      `authkit:refresh:${user.id}:${opaque}`,
      metadata,
      'EX',
      ttl,
    );
    this.logger.log(`Generated new refresh token for ${user.id}`);

    // hide user's id.
    return {
      refresh_token: Buffer.from(`${user.id}:${opaque}`).toString('base64url'),
      refresh_token_expires_in: ttl,
    };
  }

  /**
   * Refreshes the access token and reissues a new refresh token
   * if its remaining validity is less than 3 days.
   *
   * @param refreshToken The refresh token used for reissuing tokens.
   */
  async refresh(refreshToken: string): Promise<{
    access_token: string;
    expires_in: number;
    refresh_token: string;
    refresh_token_expires_in: number;
  }> {
    const decoded = Buffer.from(refreshToken, 'base64url').toString();
    const [userId, rid] = decoded.split(':');

    const redisKey = `authkit:refresh:${userId}:${rid}`;
    const rawRefresh = await this.authRedis.get(redisKey);

    // check if token exist
    if (!rawRefresh || !userId)
      throw new UnauthorizedException('Invalid session.');

    const user = await this.userRepository.findOneBy({ id: Number(userId) });
    if (!user) throw new UnauthorizedException('Invalid user.');

    const { access_token, expires_in } = await this.generateAccessToken(user);

    const refreshInfo = JSON.parse(rawRefresh) as UserRefreshPayloadDto;
    await this.authRedis.expire(redisKey, 30);

    const newRefresh = await this.generateRefreshToken(
      user,
      refreshInfo.device as string,
      refreshInfo.ip as string,
    );

    return {
      access_token,
      expires_in,
      ...newRefresh,
    };
  }

  /**
   * Retrieves the current session information.
   *
   * @param userId The ID of the user.
   * @returns The user's session information.
   */
  async getSessionInfo(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException("Couldn't find user");
    return {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
    };
  }
}
