import { IsNumber, IsOptional, Min } from "class-validator";

export class PaginationDto{
  @IsNumber()
  @IsOptional()
  @Min(0)
  limit:number;
  
  @IsNumber()
  @IsOptional()
  @Min(0)
  offset:number;
}