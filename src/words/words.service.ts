import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Word } from './entities/word.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class WordsService {

  constructor(
    @InjectRepository(Word)
    private readonly wordRepository:Repository<Word>
  ){}

  async create(createWordDto: CreateWordDto, file:Express.Multer.File) {
    try {
      const word = this.wordRepository.create({
        image: file.filename,
        ...createWordDto
      })
      await this.wordRepository.save(word)
      return {
        statusCode:201,
        message:'Word added into system'
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  findWordImage(wordImage:string){
    const path = join(__dirname, '../../static/words', wordImage)
    if(!fs.existsSync(path)){
      throw new BadRequestException(`No word file found with name ${wordImage}`)
    }
    return path
  }

  async findAll(paginationDto:PaginationDto) {
    const {limit=10, offset=0} = paginationDto;
    const words = await this.wordRepository.find({
      take:limit,
      skip:offset
    })
    return words;
  }

  async findOne(id: string) {
    const word = await this.wordRepository.findOneBy({id})
    if(!word){
      throw new NotFoundException('There is not a word with that id')
    }
    return word;
  }

  async update(id: string, updateWordDto: UpdateWordDto, file:Express.Multer.File) {
    const word = await this.findOne(id)
    if (file) {
      try {
        fs.unlinkSync('static' + `/words/${word.image}`);
      } catch (error) {
        throw new BadRequestException('file could not be deleted');
      }
    }

    try {
      await this.wordRepository.update({id},{
        image: file ? file.filename : word.image,
        ...updateWordDto
      })
      return {
        statusCode:200,
        message:'Word was updated'
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string) {
    const word = await this.findOne(id)
    try {
      fs.unlinkSync('static' + `/words/${word.image}`);
    } catch (error) {
      throw new BadRequestException('file could not be deleted');
    }
    await this.wordRepository.delete({id})
    return {
      statusCode:200,
      message:'word was deleted'
    };
  }

  private handleError(error:any){
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException('Contact with the ADMIN');
  }
}
