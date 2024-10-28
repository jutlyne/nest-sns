import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Services } from '@/constants/common';
import { IsExist } from '@/utils/validators/is-exists.validator';
import { IsNotExist } from '@/utils/validators/is-not-exists.validator';
import { UsersModule } from '@/users/users.module';
import { AppLogger } from '@/utils/logger';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [
    UsersModule,
		JwtModule.register({
      global: true,
    }),
  ],
	controllers: [AuthController],
	providers: [
		IsExist,
    IsNotExist,
		AppLogger,
		{
			provide: Services.AUTH,
			useClass: AuthService,
		},
	],
	exports: [
		{
			provide: Services.AUTH,
			useClass: AuthService,
		},
	],
})

export class AuthModule {}
