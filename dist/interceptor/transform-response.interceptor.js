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
exports.TransformResponseInterceptor = void 0;
const common_1 = require("@nestjs/common");
const nestjs_cls_1 = require("nestjs-cls");
const rxjs_1 = require("rxjs");
let TransformResponseInterceptor = class TransformResponseInterceptor {
    constructor(cls) {
        this.cls = cls;
    }
    intercept(context, next) {
        return next
            .handle()
            .pipe((0, rxjs_1.map)((data) => ({
            reqId: this.cls.getId(),
            statusCode: context.switchToHttp().getResponse().statusCode,
            message: data.message || 'Success',
            data: data.data,
        })));
    }
};
exports.TransformResponseInterceptor = TransformResponseInterceptor;
exports.TransformResponseInterceptor = TransformResponseInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_cls_1.ClsService])
], TransformResponseInterceptor);
//# sourceMappingURL=transform-response.interceptor.js.map