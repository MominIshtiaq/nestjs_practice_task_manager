import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskModel, TaskStatus } from './task.model';
import { randomUUID, type UUID } from 'crypto';

import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  private tasks: TaskModel[] = [];

  getAllTasks(): TaskModel[] {
    return this.tasks;
  }

  getTaskById(id: UUID): TaskModel {
    const matchingTask = this.tasks.find((task) => task.id === id);
    if (!matchingTask) {
      throw new NotFoundException();
    }
    return matchingTask;
  }

  createTask(createTaskDto: CreateTaskDto): TaskModel {
    const task = {
      id: randomUUID(),
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }
}
