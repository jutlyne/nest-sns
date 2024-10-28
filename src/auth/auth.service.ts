import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EmailLoginDto } from './dtos/email-login.dto';
import { LoginResponseInterface } from './interface/login-response.interface';
import { IAuthService } from './auth';
import { Services } from '@/constants/common';
import { IUserService } from '@/users/users';
import { CreateUserDto } from '@/users/dtos/create-user.dto';
import { User } from '@/users/entities/user.entity';
import { compareHash } from '@/utils/heplers';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@/config/config.interface';
import ms from 'ms';

@Injectable()
export class AuthService implements IAuthService {
	constructor(
		@Inject(Services.USERS) private readonly usersService: IUserService,
		private readonly configService: ConfigService<AllConfigType>,
		private readonly jwtService: JwtService,
	) {}

	async userLogin(loginDto: EmailLoginDto): Promise<ResponseInterface<LoginResponseInterface>> {
		const user = await this.usersService.findOne({
			email: loginDto.email,
		});

		if (!user) {
			throw new HttpException(
				{
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						email: 'notFound',
					},
				},
				HttpStatus.UNPROCESSABLE_ENTITY,
			);
		}

		const isValidPassword = await compareHash(loginDto.password, user.password);
		if (!isValidPassword) {
			throw new HttpException(
				{
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						password: 'incorrectPassword',
					},
				},
				HttpStatus.UNPROCESSABLE_ENTITY,
			);
		}

		const { token, refreshToken, tokenExpires } = await this.getTokensData({
			id: user.id,
		});

		return {
			data: {
				token,
				refreshToken,
				tokenExpires,
				user,
			},
		};
	}

	async userRegister(registerDto: CreateUserDto): Promise<ResponseInterface<User>> {
		const user = await this.usersService.createUser(registerDto);
		return {
			data: user,
		};
	}

	private async getTokensData(data: { id: User['id'] }) {
		const tokenExpiresIn = this.configService.getOrThrow<string>(
			'auth.expires',
			{
				infer: true,
			},
		);

		const tokenExpires = Date.now() + ms(tokenExpiresIn);

		const [token, refreshToken] = await Promise.all([
			await this.jwtService.signAsync(
				{
					id: data.id,
				},
				{
					secret: this.configService.getOrThrow<string>('auth.secret', {
						infer: true,
					}),
					expiresIn: tokenExpiresIn,
				},
			),

			await this.jwtService.signAsync(
				{
					sessionId: data.id,
				},
				{
					secret: this.configService.getOrThrow<string>('auth.refreshSecret', {
						infer: true,
					}),
					expiresIn: this.configService.getOrThrow<string>(
						'auth.refreshExpires',
						{
							infer: true,
						},
					),
				},
			),
		]);

		return {
			token,
			refreshToken,
			tokenExpires,
		};
	}
}
