"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app_module_1 = require("./app.module");
const validate_option_1 = __importDefault(require("./utils/validate-option"));
const class_validator_1 = require("class-validator");
const logger_1 = require("./utils/logger");
const app_config_1 = require("./config/app.config");
const check_server_status_1 = require("./utils/check-server-status");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get((config_1.ConfigService));
    app.setGlobalPrefix(configService.getOrThrow('app.apiPrefix', { infer: true }), { exclude: ['/'] });
    app.use((0, cookie_parser_1.default)());
    app.useGlobalPipes(new common_1.ValidationPipe(validate_option_1.default));
    app.enableCors({
        origin: configService.getOrThrow('app.frontendUrl', { infer: true }),
        credentials: true,
    });
    (0, class_validator_1.useContainer)(app.select(app_module_1.AppModule), { fallbackOnErrors: true });
    const PORT = configService.getOrThrow('app.port', { infer: true });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Instagram API')
        .setDescription('The instagram API')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('instagram')
        .build();
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, documentFactory);
    const appLogger = app.get(logger_1.AppLogger);
    const appEnv = configService.getOrThrow('app.nodeEnv', { infer: true });
    try {
        await app.listen(PORT, async () => {
            appLogger.log(`Running on Port ${PORT}`);
            appLogger.log(`Running in ${configService.getOrThrow('app.nodeEnv', {
                infer: true,
            })} `);
            if (appEnv == app_config_1.Environment.Test) {
                try {
                    const statusCode = await (0, check_server_status_1.checkServerStatus)(PORT);
                    if (statusCode === 200) {
                        console.log('Test hosting successful');
                        process.exit(0);
                    }
                    throw new Error(`Test hosting failed: ${statusCode}.`);
                }
                catch (error) {
                    throw new Error(`Error executing curl: ${error}`);
                }
            }
        });
    }
    catch (err) {
        appLogger.log(err);
        if (appEnv == app_config_1.Environment.Test) {
            process.exit(1);
        }
    }
}
bootstrap();
//# sourceMappingURL=main.js.map