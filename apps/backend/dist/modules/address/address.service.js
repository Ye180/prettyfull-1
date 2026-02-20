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
exports.AddressService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const format_response_1 = require("../../shared/utils/format-response");
const notifications_producer_service_1 = require("../notifications/notifications.producer.service");
const address_schema_1 = require("./schemas/address.schema");
let AddressService = class AddressService {
    address;
    notificationsProducer;
    constructor(address, notificationsProducer) {
        this.address = address;
        this.notificationsProducer = notificationsProducer;
    }
    async getAllAddresses() {
        const addresses = await this.address.find().exec();
        return (0, format_response_1.formatResponse)({
            data: addresses,
            message: 'Addresses retrieved successfully',
        });
    }
    async createAddress(addressDto) {
        const createdAddress = new this.address(addressDto);
        await createdAddress.save();
        return (0, format_response_1.formatResponse)({
            data: createdAddress,
            message: 'Address created successfully',
        });
    }
    async getAddressById(id) {
        const address = await this.address.findById(id).exec();
        return (0, format_response_1.formatResponse)({
            data: address,
            message: address ? 'Address retrieved successfully' : 'Address not found',
        });
    }
    async getAddressesByUserId(userId) {
        const addresses = await this.address.find({ userId }).exec();
        return (0, format_response_1.formatResponse)({
            data: addresses,
            message: 'Addresses retrieved successfully',
        });
    }
    async makeDefaultAddress(id, userId, data = true) {
        await this.address
            .updateMany({ userId, isDefault: data }, { isDefault: false })
            .exec();
        const updatedAddress = await this.address
            .findByIdAndUpdate(id, { isDefault: true }, { new: true })
            .exec();
        return (0, format_response_1.formatResponse)({
            data: updatedAddress,
            message: updatedAddress
                ? 'Address set as default successfully'
                : 'Address not found',
        });
    }
    async getDefaultAddressByUserId(userId) {
        const addresses = await this.address
            .find({ userId, isDefault: true })
            .exec();
        return (0, format_response_1.formatResponse)({
            data: addresses,
            message: addresses
                ? 'Default address retrieved successfully'
                : 'No default address found',
        });
    }
    async updateAddress(id, addressDto) {
        const addressUpdated = await this.address
            .findByIdAndUpdate(id, addressDto, { new: true })
            .exec();
        return (0, format_response_1.formatResponse)({
            data: addressUpdated,
            message: addressUpdated
                ? 'Address updated successfully'
                : 'Address not found',
        });
    }
    async deleteAddress(id) {
        const address = await this.address.findByIdAndDelete(id).exec();
        return (0, format_response_1.formatResponse)({
            data: address,
            message: address ? 'Address deleted successfully' : 'Address not found',
        });
    }
};
exports.AddressService = AddressService;
exports.AddressService = AddressService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(address_schema_1.Address.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        notifications_producer_service_1.NotificationsProducerService])
], AddressService);
//# sourceMappingURL=address.service.js.map