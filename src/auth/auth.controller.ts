import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Post,
	Req,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { Routes, Services } from '@/constants/common';
import { ApiTags } from '@nestjs/swagger';
import { IAuthService } from './auth';
import { EmailLoginDto } from './dtos/email-login.dto';
import { LoginResponseInterface } from './interfaces/login-response.interface';
import { CreateUserDto } from '@/users/dtos/create-user.dto';
import { TransformResponseInterceptor } from '@/interceptor/transform-response.interceptor';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '@/users/entities/user.entity';

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

	@Get('profile')
	@UseGuards(JwtAuthGuard)
	getProfile(@Req() request: Request) {
		const userId = (request.user as User)?.id;
		return this.authService.getProfile(userId);
	}
}
