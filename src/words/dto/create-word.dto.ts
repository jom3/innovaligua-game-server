import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateWordDto {

  @IsString()
  @IsNotEmpty()
  word: string;

  @IsString()
  @IsOptional()
  image: string;
}
