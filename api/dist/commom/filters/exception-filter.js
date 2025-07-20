"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiExceptionFilter = void 0;
class ApiExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.status || 500;
        response.status(status).json({
            statusCode: status,
            error: exception.name,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exception.message !== ''
                ? exception.message
                : 'Error performing the operation',
        });
    }
}
exports.ApiExceptionFilter = ApiExceptionFilter;
//# sourceMappingURL=exception-filter.js.map