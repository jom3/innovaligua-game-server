import { Module } from '@nestjs/common';
import { WordsService } from './words.service';
import { WordsController } from './words.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './entities/word.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[
    TypeOrmModule.forFeature([Word])
  ],
  controllers: [WordsController],
  providers: [WordsService,JwtService],
})
export class WordsModule {}
