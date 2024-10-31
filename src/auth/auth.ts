import { CreateUserDto } from '@/users/dtos/create-user.dto';
import { EmailLoginDto } from './dtos/email-login.dto';
import { LoginResponseInterface } from './interfaces/login-response.interface';
import { User } from '@/users/entities/user.entity';

export interface IAuthService {
	userLogin(loginDto: EmailLoginDto): Promise<ResponseInterface<LoginResponseInterface>>;
	userRegister(userRegister: CreateUserDto): Promise<ResponseInterface<User>>;
	getProfile(id: number): Promise<ResponseInterface<User | {}>>;
}
