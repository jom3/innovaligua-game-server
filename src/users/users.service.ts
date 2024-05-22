import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../shared/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { encryptPassword } from 'src/shared/utils/encryptPassword';
import * as _ from 'lodash'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...toCreate } = createUserDto;
    try {
      const user = this.userRepository.create({
        
        password: await encryptPassword(password),
        ...toCreate,
      });
      await this.userRepository.save(user);
      return {
        statusCode: 201,
        message: 'User created',
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const users = await this.userRepository.find({
      take: limit,
      skip: offset,
    });
    return users.map(user=>{
      const restUserData = _.omit(user,['username','password', 'created_at', 'updated_at'])
      return restUserData
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new BadRequestException(`There's not a user with this id`);
    }
    return _.omit(user,['password','username']);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      await this.findOne(id)
      await this.userRepository.update({id},{
        email:updateUserDto.email,
        first_name:updateUserDto.first_name,
        last_name:updateUserDto.last_name
      })
      return {
        statusCode: 200,
        message: 'User was updated',
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.userRepository.update({ id: id }, { status: false });
    return {
      statusCode:200,
      message:'The user was removed'
    };
  }

  async restore(id: string) {
    await this.findOne(id);
    await this.userRepository.update({ id: id }, { status: true });
    return {
      statusCode:200,
      message:'The user was restored'
    };
  }

  private handleError(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    if (error.status === 401) {
      throw new UnauthorizedException(error.response.message);
    }
    throw new InternalServerErrorException('Contact with the ADMIN');
  }
}
