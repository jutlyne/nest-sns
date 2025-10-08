"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = exports.Services = void 0;
var Services;
(function (Services) {
    Services["AUTH"] = "AUTH_SERVICE";
    Services["USERS"] = "USERS_SERVICE";
    Services["SESSION"] = "SESSION_SERVICE";
    Services["MAILER"] = "MAILER_SERVICE";
    Services["MAILS"] = "MAILS_SERVICE";
    Services["FORGOT_PASSWORD"] = "FORGOT_PASSWORD_SERVICE";
    Services["AUTH_GOOGLE"] = "AUTH_GOOGLE_SERVICE";
})(Services || (exports.Services = Services = {}));
var Routes;
(function (Routes) {
    Routes["AUTH"] = "auth";
    Routes["AUTH_GOOGLE"] = "auth/google";
    Routes["USERS"] = "users";
    Routes["HEALTH"] = "health";
})(Routes || (exports.Routes = Routes = {}));
//# sourceMappingURL=common.js.map