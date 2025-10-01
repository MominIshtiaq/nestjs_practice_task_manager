import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { InjectRepository } from '@nestjs/typeorm';
// import { User } from './user.entity';
import { UserRepository } from './users.repository';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async getUsers() {
    return await this.userRepository.find();
  }

  async signUp(createUserDto: CreateUserDto) {
    return this.userRepository.createUser(createUserDto);
  }
}
