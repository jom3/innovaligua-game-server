import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ActivitiesModule } from './activities/activities.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Activity } from './activities/entities/activity.entity';
import { AuthModule } from './auth/auth.module';
import { WordsModule } from './words/words.module';
import { Word } from './words/entities/word.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type:'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
      entities:[User, Activity, Word],
      synchronize:true,
    }),
    UsersModule,
    ActivitiesModule,
    AuthModule,
    WordsModule,
  ],
  controllers: [],
  providers: [ ConfigService],
})
export class AppModule {}
