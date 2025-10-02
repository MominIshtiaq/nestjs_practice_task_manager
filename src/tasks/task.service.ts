/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { Task } from './task.entity';
import { ILike, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';

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

  // using QueryBuilder
  // Best if you need complex filtering, multiple OR conditions, joins, etc.
  async getFilterTasks(
    taskFilterDto: TaskFilterDto,
    user: User,
  ): Promise<Task[]> {
    const { status, search } = taskFilterDto;
    const query = this.tasksRepository.createQueryBuilder('task');

    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  // using ILike from typeORM
  // Simpler than QueryBuilder.
  // But combining multiple fields (title OR description) requires an array of where objects.
  async getFilterTasks02(taskFilterDto: TaskFilterDto): Promise<Task[]> {
    const { status, search } = taskFilterDto;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      // For single field
      where.title = ILike(`%${search}%`);
      // OR for multiple fields, you can use an array of conditions
      return this.tasksRepository.find({
        where: [
          { ...where, title: ILike(`%${search}%`) },
          { ...where, description: ILike(`%${search}%`) },
        ],
      });
    }

    return this.tasksRepository.find({ where });
  }

  // using Raw from typeORM
  // More flexible than ILike.
  // Still trickier for OR conditions across multiple fields.
  async getFilterTasks03(taskFilterDto: TaskFilterDto): Promise<Task[]> {
    const { status, search } = taskFilterDto;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.title = Raw((alias) => `${alias} ILIKE '%${search}%'`);
      // You can also combine multiple Raw conditions
    }

    return this.tasksRepository.find({ where });
  }

  async getTasksById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id, user } });

    if (!found) {
      throw new NotFoundException(`Task with Id "${id}" not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    await this.tasksRepository.save(task);
    return task;
  }

  async createTask02(createTaskDto: CreateTaskDto): Promise<Task> {
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

  async taskStatusUpdate(id: string, status: TaskStatus, user: User) {
    const task = await this.tasksRepository.findOne({ where: { id, user } });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }

  async deleteTask(id: string) {
    const deletedTask = await this.tasksRepository.delete(id);
    return deletedTask;
  }

  async deleteAllTasks(user: User) {
    await this.tasksRepository.delete({ user: { id: user.id } });
    return;
  }

  async taskDelete(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id, user } });
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
