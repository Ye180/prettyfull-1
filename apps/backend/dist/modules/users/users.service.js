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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
let UsersService = class UsersService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(createUserDto) {
        const existingUser = await this.userModel.findOne({
            email: createUserDto.email.toLowerCase(),
        });
        if (existingUser) {
            throw new common_1.ConflictException('Un utilisateur avec cet email existe déjà');
        }
        const user = new this.userModel({
            ...createUserDto,
            email: createUserDto.email.toLowerCase(),
        });
        return user.save();
    }
    async findAll() {
        return this.userModel
            .find()
            .select('-password')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findOne(id) {
        const user = await this.userModel.findById(id).select('-password').exec();
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        return user;
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email: email.toLowerCase() }).exec();
    }
    async update(id, updateUserDto) {
        const user = await this.userModel
            .findByIdAndUpdate(id, updateUserDto, { new: true })
            .select('-password')
            .exec();
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        return user;
    }
    async remove(id) {
        const result = await this.userModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
    }
    async updateLastLogin(id) {
        await this.userModel
            .findByIdAndUpdate(id, { lastLoginAt: new Date() })
            .exec();
    }
    async countByRole(role) {
        return this.userModel.countDocuments({ role }).exec();
    }
    async findAdmins() {
        return this.userModel
            .find({ role: user_schema_1.UserRole.ADMIN })
            .select('-password')
            .sort({ createdAt: -1 })
            .exec();
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map