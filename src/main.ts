import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AllConfigType } from './config/config.interface';
import validationOptions from './utils/validate-option';
import { useContainer } from 'class-validator';
import { AppLogger } from './utils/logger';

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

	try {
		await app.listen(PORT, () => {
			appLogger.log(`Running on Port ${PORT}`);
			appLogger.log(
				`Running in ${configService.getOrThrow('app.nodeEnv', {
					infer: true,
				})} `,
			);
		});
	} catch (err) {
		console.log(err);
	}
}
bootstrap();
