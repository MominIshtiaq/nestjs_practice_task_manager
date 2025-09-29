import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import type { UUID } from 'crypto';
import { TaskService } from './task.service';
import type { TaskModel } from './task.model';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  getAllTasks(): TaskModel[] {
    return this.taskService.getAllTasks();
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

  @Patch(':id')
  semiUpdateTask(@Param(':id') id: UUID, updateTaskDto: UpdateTaskDto) {
    return this.taskService.semiUpdateTask(id, updateTaskDto);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: UUID): TaskModel {
    return this.taskService.deleteTask(id);
  }
}
