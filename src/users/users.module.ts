import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Services } from '@/constants/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsNotExist } from '@/utils/validators/is-not-exists.validator';
import { IsExist } from '@/utils/validators/is-exists.validator';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
	controllers: [UsersController],
	providers: [
		IsExist,
    IsNotExist,
		{
			provide: Services.USERS,
			useClass: UsersService,
		},
	],
	exports: [
		{
			provide: Services.USERS,
			useClass: UsersService,
		},
	],
})
export class UsersModule {}
