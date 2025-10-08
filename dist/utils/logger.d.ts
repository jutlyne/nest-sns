import { ClsService } from 'nestjs-cls';
import { Logger as WinstonLogger } from 'winston';
export declare class AppLogger {
    private readonly logger;
    private readonly cls;
    constructor(logger: WinstonLogger, cls: ClsService);
    log(message: string | number): void;
}
