import { AllConfigType } from '@/config/config.interface';
import { ConfigService } from '@nestjs/config';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
export declare class HealthController {
    private readonly configService;
    private readonly health;
    private readonly http;
    constructor(configService: ConfigService<AllConfigType>, health: HealthCheckService, http: HttpHealthIndicator);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult>;
    getStatus(): {
        status: string;
    };
}
