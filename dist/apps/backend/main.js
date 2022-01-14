(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./apps/backend/src/app/app.controller.ts":
/*!************************************************!*\
  !*** ./apps/backend/src/app/app.controller.ts ***!
  \************************************************/
/*! exports provided: AppController */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppController", function() { return AppController; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "tslib");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tslib__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _nestjs_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
/* harmony import */ var _nestjs_common__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__WEBPACK_IMPORTED_MODULE_1__);


let AppController = class AppController {
    constructor() { }
    getData() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            return "hello";
        });
    }
};
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_nestjs_common__WEBPACK_IMPORTED_MODULE_1__["Get"])('data'),
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:type", Function),
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", []),
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:returntype", Promise)
], AppController.prototype, "getData", null);
AppController = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_nestjs_common__WEBPACK_IMPORTED_MODULE_1__["Controller"])(),
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [])
], AppController);



/***/ }),

/***/ "./apps/backend/src/app/app.module.ts":
/*!********************************************!*\
  !*** ./apps/backend/src/app/app.module.ts ***!
  \********************************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "tslib");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tslib__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _nestjs_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
/* harmony import */ var _nestjs_common__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _nestjs_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
/* harmony import */ var _nestjs_config__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_nestjs_config__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var nest_winston__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! nest-winston */ "nest-winston");
/* harmony import */ var nest_winston__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(nest_winston__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var winston__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! winston */ "winston");
/* harmony import */ var winston__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(winston__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _app_controller__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./app.controller */ "./apps/backend/src/app/app.controller.ts");
/* harmony import */ var _app_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./app.service */ "./apps/backend/src/app/app.service.ts");







// import { BannersModel } from './cms/banners/banners.model';
// import { CmsModule } from './cms/cms.module';
// import { RunnerModule } from './runner/runner.module';
// import { AuthModule } from './auth/auth.module';
// import { PaymentModule } from './payment/payment.module';
// import { StreamModule } from './stream/stream.module';
///////////////////////////////////////////////////////////////////////////////////
// IMPORT MODEL
////////////////////////////////////////////////////////////////////////////////////
// import { UserModel } from './user/user.model';
// import { BankModel } from './models/bank.entity';
// import { ChannelLocaleModel } from './models/channel.locale.model';
// import { PaymentProviderChannelModel } from './models/payment.provider.channel.model';
// import { ChannelModel } from './models/channel.model';
// import { DepositOrderModel } from './models/deposit.order.model';
// import { DepositPendingOrderModel } from './models/deposit.pending.order.model';
// import { LocaleModel } from './models/locale.model';
// import { PaymentProviderBankModel } from './models/payment.provider.bank.entity';
// import { PaymentProviderEntityModel } from './models/payment.provider.entity.model';
// import { PaymentSystemLocaleModel } from './models/payment.system.locale.model';
// import { PaymentSystemModel } from './models/payment.system.model';
// import { WithdrawOrderModel } from './models/withdraw.order.model';
// import { WithdrawPendingOrderModel } from './models/withdraw.pending.order.model';
// import { BCToKSportModel } from './stream/ksport/entities/bc.ksport.entity';
// import { BCToKSportTeamModel } from './stream/ksport/entities/bc.ksport.team.entity';
// import { BullModule } from '@nestjs/bull';
// import { BcOrdersModel } from './models/bcOrders';
// import { TestModel } from './models/test.entity';
// import { OptionsModel } from './models/options.model';
// import { PaymentProviderCardModel } from './models/payment.provider.card.model';
// import { UsdtProtocolModel } from './models/usdtProtocol';
// import { PaymentProviderUsdtProtocolModel } from './models/payment.provider.usdt.protocol.model';
// import { OptionsModule } from './options/options.module';
// import { NotifyModule } from './notify/notify.module';
let AppModule = class AppModule {
    // constructor(private sequelize: Sequelize) {}
    constructor() { }
    configure(consumer) { }
};
AppModule = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_nestjs_common__WEBPACK_IMPORTED_MODULE_1__["Module"])({
        imports: [
            nest_winston__WEBPACK_IMPORTED_MODULE_3__["WinstonModule"].forRoot({
                level: 'debug',
                format: winston__WEBPACK_IMPORTED_MODULE_4__["format"].combine(winston__WEBPACK_IMPORTED_MODULE_4__["format"].errors({ stack: true }), winston__WEBPACK_IMPORTED_MODULE_4__["format"].json(), winston__WEBPACK_IMPORTED_MODULE_4__["format"].timestamp(), nest_winston__WEBPACK_IMPORTED_MODULE_3__["utilities"].format.nestLike()),
                defaultMeta: { service: 'backend' },
                transports: [new winston__WEBPACK_IMPORTED_MODULE_4__["transports"].Console()],
            }),
            // BullModule.forRoot({
            //   redis: {
            //     host: process.env.REDIS_HOST,
            //     port: Number(process.env.REDIS_PORT),
            //     password: process.env.REDIS_PASSWORD,
            //   },
            // }),
            _nestjs_config__WEBPACK_IMPORTED_MODULE_2__["ConfigModule"].forRoot({
                isGlobal: true,
            }),
        ],
        controllers: [_app_controller__WEBPACK_IMPORTED_MODULE_5__["AppController"]],
        providers: [_app_service__WEBPACK_IMPORTED_MODULE_6__["AppService"]],
    }),
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"])("design:paramtypes", [])
], AppModule);



/***/ }),

/***/ "./apps/backend/src/app/app.service.ts":
/*!*********************************************!*\
  !*** ./apps/backend/src/app/app.service.ts ***!
  \*********************************************/
/*! exports provided: AppService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppService", function() { return AppService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "tslib");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tslib__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _nestjs_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
/* harmony import */ var _nestjs_common__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__WEBPACK_IMPORTED_MODULE_1__);


let AppService = class AppService {
    getData() {
        return { message: 'Welcome to backend!' };
    }
};
AppService = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_nestjs_common__WEBPACK_IMPORTED_MODULE_1__["Injectable"])()
], AppService);



/***/ }),

/***/ "./apps/backend/src/app/middleware/filter.request.middleware.ts":
/*!**********************************************************************!*\
  !*** ./apps/backend/src/app/middleware/filter.request.middleware.ts ***!
  \**********************************************************************/
/*! exports provided: filterRequest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "filterRequest", function() { return filterRequest; });
function filterRequest(req, res, next) {
    if (req.headers['content-encoding'] &&
        (req.headers['content-encoding'].toUpperCase() === `UTF-8` ||
            req.headers['content-encoding'].toUpperCase() === `UTF8`)) {
        delete req.headers['content-encoding'];
    }
    next();
}


/***/ }),

/***/ "./apps/backend/src/main.ts":
/*!**********************************!*\
  !*** ./apps/backend/src/main.ts ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "tslib");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tslib__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _nestjs_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
/* harmony import */ var _nestjs_common__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_nestjs_common__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _nestjs_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
/* harmony import */ var _nestjs_config__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_nestjs_config__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _nestjs_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
/* harmony import */ var _nestjs_core__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_nestjs_core__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var nest_winston__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! nest-winston */ "nest-winston");
/* harmony import */ var nest_winston__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(nest_winston__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./app/app.module */ "./apps/backend/src/app/app.module.ts");
/* harmony import */ var _nestjs_swagger__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
/* harmony import */ var _nestjs_swagger__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_nestjs_swagger__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var request_ip__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! request-ip */ "request-ip");
/* harmony import */ var request_ip__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(request_ip__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _app_middleware_filter_request_middleware__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./app/middleware/filter.request.middleware */ "./apps/backend/src/app/middleware/filter.request.middleware.ts");









function bootstrap() {
    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
        const app = yield _nestjs_core__WEBPACK_IMPORTED_MODULE_3__["NestFactory"].create(_app_app_module__WEBPACK_IMPORTED_MODULE_5__["AppModule"]);
        app.use(_app_middleware_filter_request_middleware__WEBPACK_IMPORTED_MODULE_8__["filterRequest"]);
        const configService = app.get(_nestjs_config__WEBPACK_IMPORTED_MODULE_2__["ConfigService"]);
        const globalPrefix = configService.get('BACKEND_PREFIX');
        app.setGlobalPrefix(globalPrefix);
        if (configService.get('ENVIRONMENT') === 'development' || 'stage') {
            const swaggerOptions = new _nestjs_swagger__WEBPACK_IMPORTED_MODULE_6__["DocumentBuilder"]()
                .setTitle('100Bet API documentation')
                .setDescription('Below You can test out the backend api and read the description of all endpoints and it`s examples')
                .setVersion('0.0.1')
                .addBearerAuth({
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'jwt',
            })
                .build();
            const swaggerDocument = _nestjs_swagger__WEBPACK_IMPORTED_MODULE_6__["SwaggerModule"].createDocument(app, swaggerOptions);
            _nestjs_swagger__WEBPACK_IMPORTED_MODULE_6__["SwaggerModule"].setup(globalPrefix, app, swaggerDocument, {
                swaggerUrl: `${configService.get('BACKEND_HOST')}/api/docs-json/`,
                explorer: true,
                swaggerOptions: {
                    docExpansion: 'list',
                    filter: true,
                    displayRequestDuration: true,
                },
                customCss: '.opblock-summary-path {font-size: 18px !important; font-weight: normal !important;}' +
                    '.opblock-summary-description {font-size: 18px !important; text-align: right !important;' +
                    'font-weight: bold !important;}',
            });
        }
        app.useLogger(app.get(nest_winston__WEBPACK_IMPORTED_MODULE_4__["WINSTON_MODULE_NEST_PROVIDER"]));
        app.useGlobalPipes(new _nestjs_common__WEBPACK_IMPORTED_MODULE_1__["ValidationPipe"]({
            whitelist: false,
            transform: true,
        }));
        app.use(request_ip__WEBPACK_IMPORTED_MODULE_7__["mw"]());
        app.enableCors({
            origin: true,
        });
        const port = configService.get('BACKEND_PORT');
        yield app.listen(port);
    });
}
bootstrap();


/***/ }),

/***/ 0:
/*!****************************************!*\
  !*** multi ./apps/backend/src/main.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /srv/elastic-beanstalk/100-elastic/apps/backend/src/main.ts */"./apps/backend/src/main.ts");


/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/swagger":
/*!**********************************!*\
  !*** external "@nestjs/swagger" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@nestjs/swagger");

/***/ }),

/***/ "nest-winston":
/*!*******************************!*\
  !*** external "nest-winston" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("nest-winston");

/***/ }),

/***/ "request-ip":
/*!*****************************!*\
  !*** external "request-ip" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("request-ip");

/***/ }),

/***/ "tslib":
/*!************************!*\
  !*** external "tslib" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("tslib");

/***/ }),

/***/ "winston":
/*!**************************!*\
  !*** external "winston" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("winston");

/***/ })

/******/ })));
//# sourceMappingURL=main.js.map