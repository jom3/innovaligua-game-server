import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PaginationDto } from '../shared/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { Repository } from 'typeorm';
import { CheckActivityDto } from './dto/check-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  async create(createActivityDto: CreateActivityDto) {
    try {
      const activity = this.activityRepository.create(createActivityDto);
      await this.activityRepository.save(activity);
      return {
        statusCode: 201,
        message: 'Actividad creada con éxito!',
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(paginationDto: PaginationDto):Promise<Activity[]> {
    const { limit = 10, offset = 0 } = paginationDto;
    const activities = await this.activityRepository.find({
      take: limit,
      skip: offset,
    });
    return activities;
  }

  async findAllUserActivities(paginationDto: PaginationDto, id: string) {
    const { limit = 5, offset = 0 } = paginationDto;
    const activities = await this.activityRepository.find({
      take: limit,
      skip: offset,
      where: { userId: id },
    });
    return activities;
  }

  async findOne(id: string) {
    const activity = await this.activityRepository.findOneBy({ id });
    if (!activity) {
      throw new NotFoundException('No existe una actividad con ese id');
    }
    return activity;
  }

  async update(id: string, updateActivityDto: UpdateActivityDto) {
    await this.findOne(id);
    try {
      await this.activityRepository.update(
        { id },
        { attempts: updateActivityDto.attempts, type: updateActivityDto.type },
      );
      return {
        statusCode: 200,
        message: 'La actividad fue modificada con éxito!',
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.activityRepository.delete({ id });
    return {
      statusCode: 200,
      message: 'La actividad fue eliminada con éxito!',
    };
  }

  async checked(id: string, checkActivityDto:CheckActivityDto) {
    console.log(id, checkActivityDto)
    const {score} = checkActivityDto
    const activity = await this.findOne(id);
    console.log(activity.attempts)
    if(score===100 && activity.attempts>=1){
      await this.activityRepository.update({id},{
        state:2,
        ended_at:new Date(),
        max_score:score
      })
      return {
        statusCode: 200,
        message: 'Felicidades acabaste la actividad con éxito!',
      };
    }
    if (activity.attempts > 1) {
      await this.activityRepository.update(
        { id },
        {
          attempts: activity.attempts-1,
          max_score: score >= activity.max_score ? score : activity.max_score,
        },
      );
      return {
        statusCode: 200,
        message: 'Se actualizo la cantidad de intentos!',
      };
    }
    if (activity.attempts < 2 && score<100) {
      await this.activityRepository.update(
        { id },
        {
          attempts: 0,
          state:0,
          ended_at: new Date(),
          max_score: score >= activity.max_score ? score : activity.max_score,
        },
      );
      return {
        statusCode: 200,
        message: 'Se finalizo la actividad por el uso máximo de intentos!',
      };
    }
    
  }

  private handleError(error: any) {
    throw new InternalServerErrorException({
      message: 'contact with an Admin',
      error,
    });
  }
}
