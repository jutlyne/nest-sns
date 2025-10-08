"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_config_1 = __importDefault(require("./config/app.config"));
const nestjs_cls_1 = require("nestjs-cls");
const uuid_1 = require("uuid");
const nest_winston_1 = require("nest-winston");
const winston = __importStar(require("winston"));
const logger_1 = require("./utils/logger");
const health_module_1 = require("./health/health.module");
const chat_module_1 = require("./chat/chat.module");
const call_module_1 = require("./call/call.module");
const auth_config_1 = __importDefault(require("./config/auth.config"));
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                load: [app_config_1.default, auth_config_1.default],
                isGlobal: true,
            }),
            nestjs_cls_1.ClsModule.forRoot({
                global: true,
                middleware: {
                    mount: true,
                    generateId: true,
                    idGenerator: (req) => req.headers['X-Request-Id'] ?? (0, uuid_1.v4)(),
                },
            }),
            nest_winston_1.WinstonModule.forRoot({
                level: 'info',
                format: winston.format.combine(winston.format.combine(winston.format.errors({ stack: true })), winston.format.timestamp(), winston.format.prettyPrint()),
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
            health_module_1.HealthModule,
            chat_module_1.ChatModule,
            call_module_1.CallModule,
        ],
        providers: [logger_1.AppLogger],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map