"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("../constants/common");
const common_2 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const terminus_1 = require("@nestjs/terminus");
let HealthController = class HealthController {
    constructor(configService, health, http) {
        this.configService = configService;
        this.health = health;
        this.http = http;
    }
    check() {
        const port = this.configService.getOrThrow('app.port', { infer: true });
        return this.health.check([
            () => this.http.pingCheck('self', `http://localhost:${port}/api/health/status`),
        ]);
    }
    getStatus() {
        return { status: 'ok' };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_2.Get)(),
    (0, terminus_1.HealthCheck)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "check", null);
__decorate([
    (0, common_2.Get)('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "getStatus", null);
exports.HealthController = HealthController = __decorate([
    (0, common_2.Controller)(common_1.Routes.HEALTH),
    __metadata("design:paramtypes", [config_1.ConfigService,
        terminus_1.HealthCheckService,
        terminus_1.HttpHealthIndicator])
], HealthController);
//# sourceMappingURL=health.controller.js.map