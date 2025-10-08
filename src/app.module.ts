import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './config/app.config';

import { ClsModule } from 'nestjs-cls';
import { v4 as uuidv4 } from 'uuid';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AppLogger } from './utils/logger';
import { HealthModule } from './health/health.module';
import { ChatModule } from './chat/chat.module';
import { CallModule } from './call/call.module';
import authConfig from './config/auth.config';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
			load: [appConfig, authConfig],
			isGlobal: true,
		}),
		ClsModule.forRoot({
			global: true,
			middleware: {
				mount: true,
				generateId: true,
				idGenerator: (req: Request) => req.headers['X-Request-Id'] ?? uuidv4(),
			},
		}),
		WinstonModule.forRoot({
			level: 'info',
			format: winston.format.combine(
				// https://github.com/winstonjs/winston/issues/1392#issuecomment-689361987
				winston.format.combine(winston.format.errors({ stack: true })),
				winston.format.timestamp(),
				winston.format.prettyPrint(),
			),
			defaultMeta: { service: 'user-service' },
			transports: [
				new winston.transports.File({
					filename: 'logs/error.log',
					level: 'error',
				}),
				new winston.transports.File({
					filename: 'logs/info.log',
					level: 'info',
				}),
			],
		}),
		HealthModule,
		ChatModule,
		CallModule,
	],
	providers: [AppLogger],
})
export class AppModule {}
