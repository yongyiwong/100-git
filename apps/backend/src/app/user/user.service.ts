import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { UserModel } from './user.model';
import {
  LoginDto,
  Payload,
  UserRequestDto,
  UserEmailDto,
  LoginResponseDto,
  UserTokenDto,
} from '@workspace/dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private userRepository: typeof UserModel
  ) {}

  async create(userDto: UserRequestDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: userDto.email,
      },
    });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const createdUser = new this.userRepository(userDto);
    await createdUser.save();
    return this.sanitizeUser(createdUser);
  }

  async find(request: UserEmailDto) {
    return this.userRepository.findAll({
      where: {
        email: request.email,
      },
    });
  }

  async findByLogin(userDto: LoginDto): Promise<UserModel> {
    const user = await this.userRepository.findOne({
      where: {
        email: userDto.email,
      },
    });
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    if (await bcrypt.compare(userDto.password, user.password)) {
      return this.sanitizeUser(user);
    } else {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  async findByPayload(payload: Payload) {
    return this.userRepository.findOne({
      where: {
        email: payload.email,
      },
    });
  }

  async findById(userId: string) {
    return this.userRepository.findByPk(userId);
  }

  sanitizeUser(user: UserModel) {
    const sanitized = user;
    delete sanitized['password'];
    return sanitized;
  }

  sanitizeToken(user: UserTokenDto, twoFactorSecret: string): UserRequestDto {
    const sanitized = user;
    delete sanitized['token'];
    return { ...sanitized, twoFactorAuthenticationSecret: twoFactorSecret };
  }
}
