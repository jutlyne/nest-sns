import { Injectable } from '@nestjs/common';
import { IUserService } from './users';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { EntityCondition } from '@/utils/interfaces/entity-condition.interface';
import { NullableType } from '@/utils/interfaces/nullable.interface';

@Injectable()
export class UsersService implements IUserService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {}

	createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

	findOne(conditions: EntityCondition<User>): Promise<NullableType<User>> {
    const user = this.usersRepository.findOneBy(conditions);
		return user;
	}
}
