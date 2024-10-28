import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Inject,
	Post,
	UseInterceptors,
} from '@nestjs/common';
import { Routes, Services } from '@/constants/common';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IAuthService } from './auth';
import { EmailLoginDto } from './dtos/email-login.dto';
import { LoginResponseInterface } from './interface/login-response.interface';
import { CreateUserDto } from '@/users/dtos/create-user.dto';
import { TransformResponseInterceptor } from '@/interceptor/transform-response.interceptor';

@ApiTags('Auth')
@Controller(Routes.AUTH)
@UseInterceptors(TransformResponseInterceptor)
export class AuthController {
	constructor(
		@Inject(Services.AUTH) private readonly authService: IAuthService,
	) {}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	login(
		@Body() loginDto: EmailLoginDto,
	): Promise<ResponseInterface<LoginResponseInterface>> {
		return this.authService.userLogin(loginDto);
	}

	@Post('register')
	@HttpCode(HttpStatus.OK)
	register(@Body() registerDto: CreateUserDto) {
		return this.authService.userRegister(registerDto);
	}
}
