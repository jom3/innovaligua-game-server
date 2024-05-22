import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { CheckActivityDto } from './dto/check-activity.dto';
import { AuthGuard } from 'src/shared/guards/auth/auth.guard';

@Controller('activity')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activitiesService.create(createActivityDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.activitiesService.findAll(paginationDto);
  }

  @UseGuards(AuthGuard)
  @Get('user/:userId')
  findAllUserActivities(@Query() paginationDto: PaginationDto, @Param('userId', ParseUUIDPipe) userId:string) {
    return this.activitiesService.findAllUserActivities(paginationDto, userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.activitiesService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateActivityDto: UpdateActivityDto) {
    return this.activitiesService.update(id, updateActivityDto);
  }

  @UseGuards(AuthGuard)
  @Delete('remove/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.activitiesService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Patch('checked/:id')
  checked(@Param('id', ParseUUIDPipe) id: string, @Body() checkActivityDto:CheckActivityDto) {
    return this.activitiesService.checked(id, checkActivityDto);
  }
}
