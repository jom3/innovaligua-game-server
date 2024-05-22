import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { ActivityType } from "src/shared/types/activityType";

export class CreateActivityDto {

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(ActivityType)
  @IsOptional()
  type: ActivityType;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  max_score: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  attempts: number;
}
