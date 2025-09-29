/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../task.model';

export class TaskFilterDto {
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsNotEmpty()
  search?: string;
}
