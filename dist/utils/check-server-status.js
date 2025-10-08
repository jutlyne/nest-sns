"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkServerStatus = void 0;
const child_process_1 = require("child_process");
const checkServerStatus = (port) => {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(`curl -s --retry 10 --retry-connrefused -o /dev/null -w "%{http_code}" http://localhost:${port}/api/health`, (error, stdout) => {
            if (error) {
                console.error('Error executing curl:', error.message);
                reject(new Error(error.message));
                return;
            }
            const statusCode = parseInt(stdout.trim());
            console.log(`Health check status code: ${statusCode}`);
            resolve(statusCode);
        });
    });
};
exports.checkServerStatus = checkServerStatus;
//# sourceMappingURL=check-server-status.js.map