import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
// import { TaskFilterDto } from './dto/task-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async getTasks(): Promise<Task[]> {
    const tasks = await this.tasksRepository.find();
    return tasks;
  }

  async getTasksById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id } });

    if (!found) {
      throw new NotFoundException(`Task with Id "${id}" not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = {
      title,
      description,
      status: TaskStatus.OPEN,
    };
    const createTask = await this.tasksRepository.save(task);
    return createTask;
  }

  async updateTaskStatus(id: string, status: TaskStatus) {
    const updateTask = await this.tasksRepository.update(id, {
      status: status,
    });
    if (!updateTask.affected) {
      throw new NotFoundException(`Task with Id "${id}" not found`);
    }
    return updateTask;
  }

  async taskStatusUpdate(id: string, status: TaskStatus) {
    const task = await this.tasksRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }

  async deleteTask(id: string) {
    const deletedTask = await this.tasksRepository.delete(id);
    console.log(deletedTask);
    return deletedTask;
  }

  async deleteAllTasks() {
    await this.tasksRepository.deleteAll();
    return;
  }

  async taskDelete(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    await this.tasksRepository.remove(task);
    return task;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    const updatedTask = await this.tasksRepository.update(id, updateTaskDto);
    if (!updatedTask.affected) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return updatedTask;
  }

  async taskUpdate(id: string, updateTaskDto: UpdateTaskDto) {
    const { title, description, status } = updateTaskDto;
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    task.title = title;
    task.description = description;
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }

  // this.task = []
  // getFilteredTasks(filterTaskDto: TaskFilterDto): TaskModel[] {
  //   const { search, status } = filterTaskDto;
  //   let tasks = this.tasks; // temperaryly holds all the tasks
  //   if (status) {
  //     // filter task for status
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   if (search) {
  //     // filter task based on search
  //     tasks = tasks.filter((task) => {
  //       if (
  //         task.title.toLowerCase().includes(search.toLowerCase()) ||
  //         task.description.toLowerCase().includes(search.toLowerCase())
  //       ) {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     });
  //   }
  //   return tasks;
  // }

  // getTasks(): TaskModel[] {
  //   return this.tasks;
  // }

  // getTaskById(id: UUID): TaskModel {
  //   const matchingTask = this.tasks.find((task) => task.id === id);
  //   if (!matchingTask) {
  //     throw new NotFoundException();
  //   }
  //   return matchingTask;
  // }

  // createTask(createTaskDto: CreateTaskDto): TaskModel {
  //   const task = {
  //     id: randomUUID(),
  //     title: createTaskDto.title,
  //     description: createTaskDto.description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks.push(task);
  //   return task;
  // }

  // updateTask(id: UUID, updateTaskDto: UpdateTaskDto): TaskModel {
  //   const taskIndex = this.tasks.findIndex((task) => task.id === id);
  //   if (taskIndex === -1) throw new NotFoundException();
  //   const { title, description, status } = updateTaskDto;
  //   this.tasks[taskIndex] = {
  //     id,
  //     title,
  //     description,
  //     status,
  //   };
  //   return this.tasks[taskIndex];
  // }

  // updateTaskStatus(id: UUID, status: TaskStatus) {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }

  // deleteTask(id: UUID): TaskModel {
  //   const taskIndex = this.tasks.findIndex((task) => task.id === id);
  //   if (taskIndex === -1) {
  //     throw new NotFoundException(`Task with ID "${id}" not found`);
  //   }
  //   const [deletedTask] = this.tasks.splice(taskIndex, 1);
  //   return deletedTask;
  // }
}
