import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskModel, TaskStatus } from './task.model';
import { randomUUID, type UUID } from 'crypto';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';

@Injectable()
export class TaskService {
  private tasks: TaskModel[] = [];

  getFilteredTasks(filterTaskDto: TaskFilterDto): TaskModel[] {
    const { search, status } = filterTaskDto;
    let tasks = this.tasks; // temperaryly holds all the tasks

    if (status) {
      // filter task for status
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      // filter task based on search
      tasks = tasks.filter((task) => {
        if (
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase())
        ) {
          return true;
        } else {
          return false;
        }
      });
    }

    return tasks;
  }

  getTasks(): TaskModel[] {
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

  updateTask(id: UUID, updateTaskDto: UpdateTaskDto): TaskModel {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) throw new NotFoundException();

    const { title, description, status } = updateTaskDto;

    this.tasks[taskIndex] = {
      id,
      title,
      description,
      status,
    };

    return this.tasks[taskIndex];
  }

  updateTaskStatus(id: UUID, status: TaskStatus) {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }

  deleteTask(id: UUID): TaskModel {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    const [deletedTask] = this.tasks.splice(taskIndex, 1);
    return deletedTask;
  }
}
