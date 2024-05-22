import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Activity } from 'src/activities/entities/activity.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([User, Activity])
  ],
  controllers: [UsersController],
  providers: [UsersService,JwtService],
})
export class UsersModule {}
