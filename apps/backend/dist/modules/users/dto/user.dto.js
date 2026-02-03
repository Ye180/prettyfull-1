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
exports.UserProfileDto = exports.UserResponseDto = exports.PublicUserDto = exports.UpdateUserDto = exports.CreateUserDto = exports.UserDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const user_schema_1 = require("../schemas/user.schema");
class UserDto {
    id;
    email;
    firstName;
    lastName;
    phone;
    avatar;
    bio;
    role;
    status;
    preferredLanguage;
    preferredCurrency;
    isEmailVerified;
    lastLoginAt;
    createdAt;
    updatedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String, format: "uuid" }, email: { required: true, type: () => String, format: "email" }, firstName: { required: true, type: () => String, minLength: 2 }, lastName: { required: true, type: () => String, minLength: 2 }, phone: { required: false, type: () => String }, avatar: { required: false, type: () => String }, bio: { required: false, type: () => String }, role: { required: true, enum: require("../schemas/user.schema").UserRole }, status: { required: true, enum: require("../schemas/user.schema").UserStatus }, preferredLanguage: { required: true, enum: require("../schemas/user.schema").Language }, preferredCurrency: { required: true, enum: require("../schemas/user.schema").Currency }, isEmailVerified: { required: true, type: () => Boolean }, lastLoginAt: { required: false, type: () => Date }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.UserDto = UserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User unique identifier' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UserDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email address',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User first name', minLength: 2 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], UserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User last name', minLength: 2 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], UserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User phone number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User avatar URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User bio/description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User role', enum: user_schema_1.UserRole }),
    (0, class_validator_1.IsEnum)(user_schema_1.UserRole),
    __metadata("design:type", String)
], UserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User status', enum: user_schema_1.UserStatus }),
    (0, class_validator_1.IsEnum)(user_schema_1.UserStatus),
    __metadata("design:type", String)
], UserDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Preferred language', enum: user_schema_1.Language }),
    (0, class_validator_1.IsEnum)(user_schema_1.Language),
    __metadata("design:type", String)
], UserDto.prototype, "preferredLanguage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Preferred currency', enum: user_schema_1.Currency }),
    (0, class_validator_1.IsEnum)(user_schema_1.Currency),
    __metadata("design:type", String)
], UserDto.prototype, "preferredCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email verification status' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UserDto.prototype, "isEmailVerified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Last login timestamp' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UserDto.prototype, "lastLoginAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Account creation timestamp' }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UserDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Account last update timestamp' }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UserDto.prototype, "updatedAt", void 0);
class CreateUserDto extends (0, swagger_1.PickType)(UserDto, [
    'email',
    'firstName',
    'lastName',
    'phone',
    'avatar',
    'bio',
    'preferredLanguage',
    'preferredCurrency',
]) {
    password;
    static _OPENAPI_METADATA_FACTORY() {
        return { password: { required: true, type: () => String, minLength: 6 } };
    }
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User password', minLength: 6 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
class UpdateUserDto extends (0, swagger_1.PartialType)((0, swagger_1.PickType)(UserDto, [
    'firstName',
    'lastName',
    'phone',
    'avatar',
    'bio',
    'preferredLanguage',
    'preferredCurrency',
])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateUserDto = UpdateUserDto;
class PublicUserDto extends (0, swagger_1.PickType)(UserDto, [
    'id',
    'firstName',
    'lastName',
    'avatar',
]) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.PublicUserDto = PublicUserDto;
class UserResponseDto extends (0, swagger_1.OmitType)(UserDto, [
    'updatedAt',
]) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UserResponseDto = UserResponseDto;
class UserProfileDto extends (0, swagger_1.PickType)(UserDto, [
    'id',
    'firstName',
    'lastName',
    'avatar',
    'bio',
    'createdAt',
]) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UserProfileDto = UserProfileDto;
//# sourceMappingURL=user.dto.js.map