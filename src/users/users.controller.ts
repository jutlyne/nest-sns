import { Controller, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Routes, Services } from '@/constants/common';
import { IUserService } from './users';

@ApiTags('Users')
@Controller(Routes.USERS)
export class UsersController {
	constructor(
		@Inject(Services.USERS) private readonly userService: IUserService,
	) {}
}
