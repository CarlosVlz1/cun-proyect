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
exports.BackupController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const backup_service_1 = require("./backup.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let BackupController = class BackupController {
    constructor(backupService) {
        this.backupService = backupService;
    }
    async exportData(req) {
        return this.backupService.exportData(req.user.userId);
    }
    async importData(req, data) {
        return this.backupService.importData(req.user.userId, data);
    }
    async createBackup(req) {
        return this.backupService.createBackup(req.user.userId);
    }
    async restoreBackup(req, backupData) {
        return this.backupService.restoreBackup(req.user.userId, backupData);
    }
    async deleteAllData(req) {
        return this.backupService.deleteAllData(req.user.userId);
    }
};
exports.BackupController = BackupController;
__decorate([
    (0, common_1.Get)('export'),
    (0, common_1.Header)('Content-Type', 'application/json'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename="tareas-backup.json"'),
    (0, swagger_1.ApiOperation)({ summary: 'Exportar todos los datos del usuario a JSON' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Datos exportados exitosamente' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "exportData", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Importar datos desde un archivo JSON',
        description: 'Importa tareas y categorías. Las categorías duplicadas se omiten.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Datos importados exitosamente',
        schema: {
            type: 'object',
            properties: {
                imported: { type: 'number', example: 25 },
                skipped: { type: 'number', example: 3 },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Formato de datos inválido' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "importData", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('create'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un backup completo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Backup creado exitosamente' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "createBackup", null);
__decorate([
    (0, common_1.Post)('restore'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Restaurar desde un backup' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Backup restaurado exitosamente' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "restoreBackup", null);
__decorate([
    (0, common_1.Delete)('delete-all'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Eliminar TODOS los datos del usuario',
        description: '⚠️ PRECAUCIÓN: Esta acción elimina permanentemente todas las tareas y categorías.',
    }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Todos los datos eliminados' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BackupController.prototype, "deleteAllData", null);
exports.BackupController = BackupController = __decorate([
    (0, swagger_1.ApiTags)('backup'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('backup'),
    __metadata("design:paramtypes", [backup_service_1.BackupService])
], BackupController);
//# sourceMappingURL=backup.controller.js.map