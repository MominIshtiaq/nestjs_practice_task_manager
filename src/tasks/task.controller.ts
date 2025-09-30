import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import type { UUID } from 'crypto';
import { TaskService } from './task.service';
import type { TaskModel } from './task.model';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskFilterDto } from './dto/task-filter.dto';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  getAllTasks(@Query() taskFilterDto: TaskFilterDto): TaskModel[] {
    if (taskFilterDto) {
      return this.taskService.getFilteredTasks(taskFilterDto);
    } else {
      return this.taskService.getTasks();
    }
  }

  @Get(':id')
  getTaskById(@Param('id') id: UUID): TaskModel {
    return this.taskService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): TaskModel {
    return this.taskService.createTask(createTaskDto);
  }

  @Put(':id')
  updateTask(@Param('id') id: UUID, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: UUID,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    return this.taskService.updateTaskStatus(id, updateTaskStatusDto.status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTask(@Param('id') id: UUID): TaskModel {
    return this.taskService.deleteTask(id);
  }
}
