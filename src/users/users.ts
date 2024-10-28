import { NullableType } from '@/utils/interface/nullable.interface';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { EntityCondition } from '@/utils/interface/entity-condition.interface';

export interface IUserService {
	createUser(createUserDto: CreateUserDto): Promise<User>;
	findOne(conditions: EntityCondition<User>): Promise<NullableType<User>>;
}
