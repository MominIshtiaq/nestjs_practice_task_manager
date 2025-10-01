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

import { TaskService } from './task.service';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskFilterDto } from './dto/task-filter.dto';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  getTasks(@Query() taskFilterDto: TaskFilterDto) {
    if (taskFilterDto) {
      return this.taskService.getFilterTasks(taskFilterDto);
    } else {
      return this.taskService.getTasks();
    }
  }

  @Get(':id')
  getTaskById(@Param('id') id: string) {
    return this.taskService.getTasksById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.createTask(createTaskDto);
  }

  @Put(':id')
  updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @Put(':id/update')
  taskUpdate(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.taskUpdate(id, updateTaskDto);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    return this.taskService.updateTaskStatus(id, updateTaskStatusDto.status);
  }

  @Patch('/status/:id')
  TaskStatusUpdate(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    return this.taskService.taskStatusUpdate(id, updateTaskStatusDto.status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }

  @Delete('/:id/delete')
  taskDelete(@Param('id') id: string) {
    return this.taskService.taskDelete(id);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAllTask() {
    return this.taskService.deleteAllTasks();
  }
}
