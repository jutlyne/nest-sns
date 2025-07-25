import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { DatabaseConfigService } from './database/database-config.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { IsExist } from './utils/validators/is-exists.validator';
import { IsNotExist } from './utils/validators/is-not-exists.validator';
import { ClsModule } from 'nestjs-cls';
import { v4 as uuidv4 } from 'uuid';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AppLogger } from './utils/logger';
import { HealthModule } from './health/health.module';
import authConfig from './config/auth.config';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
			load: [appConfig, databaseConfig, authConfig],
			isGlobal: true,
		}),
		TypeOrmModule.forRootAsync({
			useClass: DatabaseConfigService,
			imports: [ConfigModule],
			inject: [ConfigService],
			dataSourceFactory: async (options: DataSourceOptions) => {
				const dataSource = new DataSource(options);
				try {
					if (!dataSource.isInitialized) {
						await dataSource.initialize();
					}
				} catch (error) {
					console.error(error?.message);
				}
				return dataSource;
			},
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
		UsersModule,
		AuthModule,
		HealthModule,
	],
	providers: [IsExist, IsNotExist, AppLogger],
})
export class AppModule {}
