import { Response } from 'express';
export declare function hashPassword(rawPassword: string): Promise<string>;
export declare function compareHash(rawPassword: string, hashedPassword: string): Promise<boolean>;
export declare function setCookies(res: Response, name: string, value: string, maxAge?: number): void;
