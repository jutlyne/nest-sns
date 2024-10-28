import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AllConfigType } from './config/config.interface';
import validationOptions from './utils/validate-option';
import { useContainer } from 'class-validator';
import { AppLogger } from './utils/logger';
import { Environment } from './config/app.config';
import { checkServerStatus } from './utils/check-server-status';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService<AllConfigType>);

	app.setGlobalPrefix(
		configService.getOrThrow('app.apiPrefix', { infer: true }),
		{
			exclude: ['/'],
		},
	);

	app.useGlobalPipes(new ValidationPipe(validationOptions));
	useContainer(app.select(AppModule), { fallbackOnErrors: true }); // https://github.com/nestjs/typeorm/issues/1352#issuecomment-1193144208

	const PORT = configService.getOrThrow('app.port', { infer: true });

	const config = new DocumentBuilder()
		.setTitle('Instagram API')
		.setDescription('The instagram API')
		.setVersion('1.0')
		.addBearerAuth()
		.addTag('instagram')
		.build();

	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, documentFactory);

	const appLogger = app.get(AppLogger);
	const appEnv = configService.getOrThrow('app.nodeEnv', { infer: true });

	try {
		await app.listen(PORT, async () => {
			appLogger.log(`Running on Port ${PORT}`);
			appLogger.log(
				`Running in ${configService.getOrThrow('app.nodeEnv', {
					infer: true,
				})} `,
			);

			if (appEnv == Environment.Test) {
				try {
					const statusCode = await checkServerStatus(PORT);
					if (statusCode === 200) {
						console.log('Test hosting successful');
						process.exit(0);
					}
					throw new Error(`Test hosting failed: ${statusCode}.`);
				} catch (error) {
					throw new Error(`Error executing curl: ${error}`);
				}
			}
		});
	} catch (err) {
		appLogger.log(err);

		if (appEnv == Environment.Test) {
			process.exit(1);
		}
	}
}

bootstrap();
