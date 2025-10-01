import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async getUsers() {
    return await this.userRepository.find();
  }

  async signUp(createUserDto: CreateUserDto) {
    return this.userRepository.createUser(createUserDto);
  }

  async signIn(createUserDto: CreateUserDto): Promise<string> {
    const { username, password } = createUserDto;

    const user = await this.userRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return 'Success';
    } else {
      throw new UnauthorizedException('please check your login credentials');
    }
  }
}
