import { AppConfig } from './config.interface';
export declare enum Environment {
    Development = "development",
    Production = "production",
    Test = "test"
}
declare const _default: import("@nestjs/config").ConfigFactory<AppConfig> & import("@nestjs/config").ConfigFactoryKeyHost<AppConfig | Promise<AppConfig>>;
export default _default;
