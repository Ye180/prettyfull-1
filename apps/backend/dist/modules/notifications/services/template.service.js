"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TemplateService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const Handlebars = __importStar(require("handlebars"));
const path = __importStar(require("path"));
let TemplateService = TemplateService_1 = class TemplateService {
    logger = new common_1.Logger(TemplateService_1.name);
    templatesDir;
    templateCache = new Map();
    constructor() {
        this.templatesDir = path.join(__dirname, '..', 'templates');
        this.logger.log(`📄 Template service initialized: ${this.templatesDir}`);
        this.registerHelpers();
    }
    registerHelpers() {
        Handlebars.registerHelper('formatCurrency', (amount, currency) => {
            return new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: currency || 'USD',
            }).format(amount);
        });
        Handlebars.registerHelper('formatDate', (date, locale = 'fr') => {
            return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
                dateStyle: 'long',
            }).format(new Date(date));
        });
        Handlebars.registerHelper('eq', (a, b) => {
            return a === b;
        });
    }
    render(templateName, data, language = 'fr') {
        try {
            const templateFileName = `${templateName}.${language}.hbs`;
            const cacheKey = templateFileName;
            let template = this.templateCache.get(cacheKey);
            if (!template) {
                const templatePath = path.join(this.templatesDir, templateFileName);
                if (!fs.existsSync(templatePath)) {
                    throw new Error(`Template not found: ${templatePath}`);
                }
                const templateSource = fs.readFileSync(templatePath, 'utf-8');
                template = Handlebars.compile(templateSource);
                this.templateCache.set(cacheKey, template);
                this.logger.debug(`Template loaded and cached: ${templateFileName}`);
            }
            const html = template(data);
            return html;
        }
        catch (error) {
            this.logger.error(`Failed to render template ${templateName}:`, error);
            throw error;
        }
    }
    clearCache() {
        this.templateCache.clear();
        this.logger.log('Template cache cleared');
    }
};
exports.TemplateService = TemplateService;
exports.TemplateService = TemplateService = TemplateService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], TemplateService);
//# sourceMappingURL=template.service.js.map