
import { AllConfigType } from '@/config/config.interface';
import { Routes } from '@/constants/common';
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheckService, HttpHealthIndicator, HealthCheck } from '@nestjs/terminus';

@Controller(Routes.HEALTH)
export class HealthController {
  constructor(
		private readonly configService: ConfigService<AllConfigType>,
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
	  const port = this.configService.getOrThrow('app.port', { infer: true });
    return this.health.check([
      () => this.http.pingCheck('self', `http://localhost:${port}/api/health/status`),
    ]);
  }

  @Get('status')
  getStatus() {
    return { status: 'ok' };
  }
}
