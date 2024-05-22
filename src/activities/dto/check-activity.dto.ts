import { IsNotEmpty, IsNumber } from "class-validator";

export class CheckActivityDto{
  @IsNumber()
  @IsNotEmpty()
  score:number
}