import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  ParseUUIDPipe,
  Header,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { WordsService } from './words.service';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileNamer } from 'src/shared/utils/fileNamer';
import { fileFilter } from 'src/shared/utils/fileFilter';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import * as fs from 'fs';
import { AuthGuard } from 'src/shared/guards/auth/auth.guard';

export const multerOptions = {
  storage: diskStorage({
    destination: './static/words',
    filename: fileNamer,
  }),
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 },
};

@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  create(
    @Body() createWordDto: CreateWordDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.wordsService.create(createWordDto, file);
  }

  @UseGuards(AuthGuard)
  @Get('file/:wordImage')
  @Header('Content-Type', 'image/jpeg')
  findWordImage(@Param('wordImage') wordImage:string){
    const stream = fs.createReadStream(this.wordsService.findWordImage(wordImage));
    return new StreamableFile(stream)
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.wordsService.findAll(paginationDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.wordsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWordDto: UpdateWordDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.wordsService.update(id, updateWordDto, file);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.wordsService.remove(id);
  }
}
