import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as _ from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(loginUserDto: LoginUserDto): Promise<any> {
    const { password, username } = loginUserDto;
    const user = await this.userRepository.findOneBy({username:username})
    if(!user){
      throw new NotFoundException('No existe el usuario')
    }
    if (!compareSync(password, user.password)) {
      throw new UnauthorizedException(
        'La contraseña es incorrecta',
      );
    }
    const payload = {user:_.omit(user,['id','username','password','created_at','updated_at']), userId: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
