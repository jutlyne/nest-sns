import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Post,
	Req,
	Res,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
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
import { setCookies } from '@/utils/heplers';

@ApiTags('Auth')
@Controller(Routes.AUTH)
@UseInterceptors(TransformResponseInterceptor)
export class AuthController {
	constructor(
		@Inject(Services.AUTH) private readonly authService: IAuthService,
	) {}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(
		@Body() loginDto: EmailLoginDto,
		@Res({ passthrough: true }) res: Response,
	): Promise<ResponseInterface<LoginResponseInterface>> {
		const { token, refreshToken, tokenExpires, user } =
			await this.authService.userLogin(loginDto);

		setCookies(res, 'token', token, tokenExpires);
		setCookies(res, 'refreshToken', refreshToken, tokenExpires);

		return { data: { user } };
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
