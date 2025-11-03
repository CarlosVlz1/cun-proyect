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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const statistics_service_1 = require("./statistics.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let StatisticsController = class StatisticsController {
    constructor(statisticsService) {
        this.statisticsService = statisticsService;
    }
    async getGeneralStats(req) {
        return this.statisticsService.getGeneralStats(req.user.userId);
    }
    async getByPriority(req) {
        return this.statisticsService.getByPriority(req.user.userId);
    }
    async getByCategory(req) {
        return this.statisticsService.getByCategory(req.user.userId);
    }
    async getWeeklyProductivity(req) {
        return this.statisticsService.getWeeklyProductivity(req.user.userId);
    }
    async getMonthlyProductivity(req) {
        return this.statisticsService.getMonthlyProductivity(req.user.userId);
    }
};
exports.StatisticsController = StatisticsController;
__decorate([
    (0, common_1.Get)('general'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener estadísticas generales del usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estadísticas obtenidas exitosamente' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getGeneralStats", null);
__decorate([
    (0, common_1.Get)('by-priority'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener estadísticas por prioridad' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estadísticas obtenidas exitosamente' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getByPriority", null);
__decorate([
    (0, common_1.Get)('by-category'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener estadísticas por categoría' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estadísticas obtenidas exitosamente' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getByCategory", null);
__decorate([
    (0, common_1.Get)('weekly-productivity'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener productividad semanal (tareas completadas por día)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Productividad obtenida exitosamente' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getWeeklyProductivity", null);
__decorate([
    (0, common_1.Get)('monthly-productivity'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener productividad mensual (tareas completadas por día)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Productividad obtenida exitosamente' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getMonthlyProductivity", null);
exports.StatisticsController = StatisticsController = __decorate([
    (0, swagger_1.ApiTags)('statistics'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('statistics'),
    __metadata("design:paramtypes", [statistics_service_1.StatisticsService])
], StatisticsController);
//# sourceMappingURL=statistics.controller.js.map