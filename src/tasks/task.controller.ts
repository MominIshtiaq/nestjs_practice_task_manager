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
  UseGuards,
} from '@nestjs/common';

import { TaskService } from './task.service';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  getTasks(@Query() taskFilterDto: TaskFilterDto, @GetUser() user: User) {
    return this.taskService.getFilterTasks(taskFilterDto, user);
  }

  @Get(':id')
  getTaskById(@Param('id') id: string, @GetUser() user: User) {
    return this.taskService.getTasksById(id, user);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.taskService.createTask(createTaskDto, user);
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
    @GetUser() user: User,
  ) {
    return this.taskService.taskStatusUpdate(
      id,
      updateTaskStatusDto.status,
      user,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }

  @Delete('/:id/delete')
  taskDelete(@Param('id') id: string, @GetUser() user: User) {
    return this.taskService.taskDelete(id, user);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAllTask(@GetUser() user: User) {
    return this.taskService.deleteAllTasks(user);
  }
}
