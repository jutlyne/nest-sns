import { User } from '@/users/entities/user.entity';

export interface JwtPayloadInterface extends Pick<User, 'id'> {
	iat: number;
	exp: number;
};
