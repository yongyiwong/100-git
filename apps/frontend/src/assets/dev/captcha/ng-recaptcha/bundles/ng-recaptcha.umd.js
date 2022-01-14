(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('rxjs'), require('@angular/forms')) :
    typeof define === 'function' && define.amd ? define('ng-recaptcha', ['exports', '@angular/core', '@angular/common', 'rxjs', '@angular/forms'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['ng-recaptcha'] = {}, global.ng.core, global.ng.common, global.rxjs, global.ng.forms));
}(this, (function (exports, core, common, rxjs, forms) { 'use strict';

    function loadScript(renderMode, onLoaded, urlParams, url, nonce) {
        window.ng2recaptchaloaded = function () {
            onLoaded(grecaptcha);
        };
        var script = document.createElement("script");
        script.innerHTML = "";
        var baseUrl = url || "https://www.recaptcha.net/recaptcha/api.js";
        script.src = baseUrl + "?render=" + renderMode + "&onload=ng2recaptchaloaded" + urlParams;
        if (nonce) {
            script.nonce = nonce;
        }
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    }

    var RECAPTCHA_LANGUAGE = new core.InjectionToken("recaptcha-language");
    var RECAPTCHA_BASE_URL = new core.InjectionToken("recaptcha-base-url");
    var RECAPTCHA_NONCE = new core.InjectionToken("recaptcha-nonce-tag");
    var RECAPTCHA_SETTINGS = new core.InjectionToken("recaptcha-settings");
    var RECAPTCHA_V3_SITE_KEY = new core.InjectionToken("recaptcha-v3-site-key");

    var RecaptchaLoaderService = /** @class */ (function () {
        function RecaptchaLoaderService(
        // eslint-disable-next-line @typescript-eslint/ban-types
        platformId, language, baseUrl, nonce, v3SiteKey) {
            this.platformId = platformId;
            this.language = language;
            this.baseUrl = baseUrl;
            this.nonce = nonce;
            this.v3SiteKey = v3SiteKey;
            this.init();
            this.ready = common.isPlatformBrowser(this.platformId)
                ? RecaptchaLoaderService.ready.asObservable()
                : rxjs.of();
        }
        /** @internal */
        RecaptchaLoaderService.prototype.init = function () {
            if (RecaptchaLoaderService.ready) {
                return;
            }
            if (common.isPlatformBrowser(this.platformId)) {
                var subject_1 = new rxjs.BehaviorSubject(null);
                RecaptchaLoaderService.ready = subject_1;
                var langParam = this.language ? "&hl=" + this.language : "";
                var renderMode = this.v3SiteKey || "explicit";
                loadScript(renderMode, function (grecaptcha) { return subject_1.next(grecaptcha); }, langParam, this.baseUrl, this.nonce);
            }
        };
        return RecaptchaLoaderService;
    }());
    /**
     * @internal
     * @nocollapse
     */
    RecaptchaLoaderService.ready = null;
    RecaptchaLoaderService.decorators = [
        { type: core.Injectable }
    ];
    RecaptchaLoaderService.ctorParameters = function () { return [
        { type: Object, decorators: [{ type: core.Inject, args: [core.PLATFORM_ID,] }] },
        { type: String, decorators: [{ type: core.Optional }, { type: core.Inject, args: [RECAPTCHA_LANGUAGE,] }] },
        { type: String, decorators: [{ type: core.Optional }, { type: core.Inject, args: [RECAPTCHA_BASE_URL,] }] },
        { type: String, decorators: [{ type: core.Optional }, { type: core.Inject, args: [RECAPTCHA_NONCE,] }] },
        { type: String, decorators: [{ type: core.Optional }, { type: core.Inject, args: [RECAPTCHA_V3_SITE_KEY,] }] }
    ]; };

    var nextId = 0;
    var RecaptchaComponent = /** @class */ (function () {
        function RecaptchaComponent(elementRef, loader, zone, settings) {
            this.elementRef = elementRef;
            this.loader = loader;
            this.zone = zone;
            this.id = "ngrecaptcha-" + nextId++;
            this.errorMode = "default";
            this.resolved = new core.EventEmitter();
            // The rename will happen a bit later
            // eslint-disable-next-line @angular-eslint/no-output-native
            this.error = new core.EventEmitter();
            if (settings) {
                this.siteKey = settings.siteKey;
                this.theme = settings.theme;
                this.type = settings.type;
                this.size = settings.size;
                this.badge = settings.badge;
            }
        }
        RecaptchaComponent.prototype.ngAfterViewInit = function () {
            var _this = this;
            this.subscription = this.loader.ready.subscribe(function (grecaptcha) {
                if (grecaptcha != null && grecaptcha.render instanceof Function) {
                    _this.grecaptcha = grecaptcha;
                    _this.renderRecaptcha();
                }
            });
        };
        RecaptchaComponent.prototype.ngOnDestroy = function () {
            // reset the captcha to ensure it does not leave anything behind
            // after the component is no longer needed
            this.grecaptchaReset();
            if (this.subscription) {
                this.subscription.unsubscribe();
            }
        };
        /**
         * Executes the invisible recaptcha.
         * Does nothing if component's size is not set to "invisible".
         */
        RecaptchaComponent.prototype.execute = function () {
            if (this.size !== "invisible") {
                return;
            }
            if (this.widget != null) {
                this.grecaptcha.execute(this.widget);
            }
            else {
                // delay execution of recaptcha until it actually renders
                this.executeRequested = true;
            }
        };
        RecaptchaComponent.prototype.reset = function () {
            if (this.widget != null) {
                if (this.grecaptcha.getResponse(this.widget)) {
                    // Only emit an event in case if something would actually change.
                    // That way we do not trigger "touching" of the control if someone does a "reset"
                    // on a non-resolved captcha.
                    this.resolved.emit(null);
                }
                this.grecaptchaReset();
            }
        };
        /** @internal */
        RecaptchaComponent.prototype.expired = function () {
            this.resolved.emit(null);
        };
        /** @internal */
        RecaptchaComponent.prototype.errored = function (args) {
            this.error.emit(args);
        };
        /** @internal */
        RecaptchaComponent.prototype.captchaResponseCallback = function (response) {
            this.resolved.emit(response);
        };
        /** @internal */
        RecaptchaComponent.prototype.grecaptchaReset = function () {
            var _this = this;
            if (this.widget != null) {
                this.zone.runOutsideAngular(function () { return _this.grecaptcha.reset(_this.widget); });
            }
        };
        /** @internal */
        RecaptchaComponent.prototype.renderRecaptcha = function () {
            var _this = this;
            // This `any` can be removed after @types/grecaptcha get updated
            var renderOptions = {
                badge: this.badge,
                callback: function (response) {
                    _this.zone.run(function () { return _this.captchaResponseCallback(response); });
                },
                "expired-callback": function () {
                    _this.zone.run(function () { return _this.expired(); });
                },
                sitekey: this.siteKey,
                size: this.size,
                tabindex: this.tabIndex,
                theme: this.theme,
                type: this.type,
            };
            if (this.errorMode === "handled") {
                renderOptions["error-callback"] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    _this.zone.run(function () { return _this.errored(args); });
                };
            }
            this.widget = this.grecaptcha.render(this.elementRef.nativeElement, renderOptions);
            if (this.executeRequested === true) {
                this.executeRequested = false;
                this.execute();
            }
        };
        return RecaptchaComponent;
    }());
    RecaptchaComponent.decorators = [
        { type: core.Component, args: [{
                    exportAs: "reCaptcha",
                    selector: "re-captcha",
                    template: ""
                },] }
    ];
    RecaptchaComponent.ctorParameters = function () { return [
        { type: core.ElementRef },
        { type: RecaptchaLoaderService },
        { type: core.NgZone },
        { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [RECAPTCHA_SETTINGS,] }] }
    ]; };
    RecaptchaComponent.propDecorators = {
        id: [{ type: core.Input }, { type: core.HostBinding, args: ["attr.id",] }],
        siteKey: [{ type: core.Input }],
        theme: [{ type: core.Input }],
        type: [{ type: core.Input }],
        size: [{ type: core.Input }],
        tabIndex: [{ type: core.Input }],
        badge: [{ type: core.Input }],
        errorMode: [{ type: core.Input }],
        resolved: [{ type: core.Output }],
        error: [{ type: core.Output }]
    };

    var RecaptchaCommonModule = /** @class */ (function () {
        function RecaptchaCommonModule() {
        }
        return RecaptchaCommonModule;
    }());
    RecaptchaCommonModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [RecaptchaComponent],
                    exports: [RecaptchaComponent],
                },] }
    ];

    var RecaptchaModule = /** @class */ (function () {
        function RecaptchaModule() {
        }
        return RecaptchaModule;
    }());
    RecaptchaModule.decorators = [
        { type: core.NgModule, args: [{
                    exports: [RecaptchaComponent],
                    imports: [RecaptchaCommonModule],
                    providers: [RecaptchaLoaderService],
                },] }
    ];

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    ;
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }
    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

    /**
     * The main service for working with reCAPTCHA v3 APIs.
     *
     * Use the `execute` method for executing a single action, and
     * `onExecute` observable for listening to all actions at once.
     */
    var ReCaptchaV3Service = /** @class */ (function () {
        function ReCaptchaV3Service(zone, siteKey,
        // eslint-disable-next-line @typescript-eslint/ban-types
        platformId, baseUrl, nonce, language) {
            var _this = this;
            /** @internal */
            this.onLoadComplete = function (grecaptcha) {
                _this.grecaptcha = grecaptcha;
                if (_this.actionBacklog && _this.actionBacklog.length > 0) {
                    _this.actionBacklog.forEach(function (_a) {
                        var _b = __read(_a, 2), action = _b[0], subject = _b[1];
                        return _this.executeActionWithSubject(action, subject);
                    });
                    _this.actionBacklog = undefined;
                }
            };
            this.zone = zone;
            this.isBrowser = common.isPlatformBrowser(platformId);
            this.siteKey = siteKey;
            this.nonce = nonce;
            this.language = language;
            this.baseUrl = baseUrl;
            this.init();
        }
        Object.defineProperty(ReCaptchaV3Service.prototype, "onExecute", {
            get: function () {
                if (!this.onExecuteSubject) {
                    this.onExecuteSubject = new rxjs.Subject();
                    this.onExecuteObservable = this.onExecuteSubject.asObservable();
                }
                return this.onExecuteObservable;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ReCaptchaV3Service.prototype, "onExecuteError", {
            get: function () {
                if (!this.onExecuteErrorSubject) {
                    this.onExecuteErrorSubject = new rxjs.Subject();
                    this.onExecuteErrorObservable = this.onExecuteErrorSubject.asObservable();
                }
                return this.onExecuteErrorObservable;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Executes the provided `action` with reCAPTCHA v3 API.
         * Use the emitted token value for verification purposes on the backend.
         *
         * For more information about reCAPTCHA v3 actions and tokens refer to the official documentation at
         * https://developers.google.com/recaptcha/docs/v3.
         *
         * @param {string} action the action to execute
         * @returns {Observable<string>} an `Observable` that will emit the reCAPTCHA v3 string `token` value whenever ready.
         * The returned `Observable` completes immediately after emitting a value.
         */
        ReCaptchaV3Service.prototype.execute = function (action) {
            var subject = new rxjs.Subject();
            if (this.isBrowser) {
                if (!this.grecaptcha) {
                    // todo: add to array of later executions
                    if (!this.actionBacklog) {
                        this.actionBacklog = [];
                    }
                    this.actionBacklog.push([action, subject]);
                }
                else {
                    this.executeActionWithSubject(action, subject);
                }
            }
            return subject.asObservable();
        };
        /** @internal */
        ReCaptchaV3Service.prototype.executeActionWithSubject = function (action, subject) {
            var _this = this;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            var onError = function (error) {
                _this.zone.run(function () {
                    subject.error(error);
                    if (_this.onExecuteErrorSubject) {
                        // We don't know any better at this point, unfortunately, so have to resort to `any`
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        _this.onExecuteErrorSubject.next({ action: action, error: error });
                    }
                });
            };
            this.zone.runOutsideAngular(function () {
                try {
                    _this.grecaptcha
                        .execute(_this.siteKey, { action: action })
                        .then(function (token) {
                        _this.zone.run(function () {
                            subject.next(token);
                            subject.complete();
                            if (_this.onExecuteSubject) {
                                _this.onExecuteSubject.next({ action: action, token: token });
                            }
                        });
                    }, onError);
                }
                catch (e) {
                    onError(e);
                }
            });
        };
        /** @internal */
        ReCaptchaV3Service.prototype.init = function () {
            if (this.isBrowser) {
                if ("grecaptcha" in window) {
                    this.grecaptcha = grecaptcha;
                }
                else {
                    var langParam = this.language ? "&hl=" + this.language : "";
                    loadScript(this.siteKey, this.onLoadComplete, langParam, this.baseUrl, this.nonce);
                }
            }
        };
        return ReCaptchaV3Service;
    }());
    ReCaptchaV3Service.decorators = [
        { type: core.Injectable }
    ];
    ReCaptchaV3Service.ctorParameters = function () { return [
        { type: core.NgZone },
        { type: String, decorators: [{ type: core.Inject, args: [RECAPTCHA_V3_SITE_KEY,] }] },
        { type: Object, decorators: [{ type: core.Inject, args: [core.PLATFORM_ID,] }] },
        { type: String, decorators: [{ type: core.Optional }, { type: core.Inject, args: [RECAPTCHA_BASE_URL,] }] },
        { type: String, decorators: [{ type: core.Optional }, { type: core.Inject, args: [RECAPTCHA_NONCE,] }] },
        { type: String, decorators: [{ type: core.Optional }, { type: core.Inject, args: [RECAPTCHA_LANGUAGE,] }] }
    ]; };

    var RecaptchaV3Module = /** @class */ (function () {
        function RecaptchaV3Module() {
        }
        return RecaptchaV3Module;
    }());
    RecaptchaV3Module.decorators = [
        { type: core.NgModule, args: [{
                    providers: [ReCaptchaV3Service],
                },] }
    ];

    var RecaptchaValueAccessorDirective = /** @class */ (function () {
        function RecaptchaValueAccessorDirective(host) {
            this.host = host;
        }
        RecaptchaValueAccessorDirective.prototype.writeValue = function (value) {
            if (!value) {
                this.host.reset();
            }
        };
        RecaptchaValueAccessorDirective.prototype.registerOnChange = function (fn) {
            this.onChange = fn;
        };
        RecaptchaValueAccessorDirective.prototype.registerOnTouched = function (fn) {
            this.onTouched = fn;
        };
        RecaptchaValueAccessorDirective.prototype.onResolve = function ($event) {
            if (this.onChange) {
                this.onChange($event);
            }
            if (this.onTouched) {
                this.onTouched();
            }
        };
        return RecaptchaValueAccessorDirective;
    }());
    RecaptchaValueAccessorDirective.decorators = [
        { type: core.Directive, args: [{
                    providers: [
                        {
                            multi: true,
                            provide: forms.NG_VALUE_ACCESSOR,
                            // tslint:disable-next-line:no-forward-ref
                            useExisting: core.forwardRef(function () { return RecaptchaValueAccessorDirective; }),
                        },
                    ],
                    // tslint:disable-next-line:directive-selector
                    selector: "re-captcha[formControlName],re-captcha[formControl],re-captcha[ngModel]",
                },] }
    ];
    RecaptchaValueAccessorDirective.ctorParameters = function () { return [
        { type: RecaptchaComponent }
    ]; };
    RecaptchaValueAccessorDirective.propDecorators = {
        onResolve: [{ type: core.HostListener, args: ["resolved", ["$event"],] }]
    };

    var RecaptchaFormsModule = /** @class */ (function () {
        function RecaptchaFormsModule() {
        }
        return RecaptchaFormsModule;
    }());
    RecaptchaFormsModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [RecaptchaValueAccessorDirective],
                    exports: [RecaptchaValueAccessorDirective],
                    imports: [forms.FormsModule, RecaptchaCommonModule],
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.RECAPTCHA_BASE_URL = RECAPTCHA_BASE_URL;
    exports.RECAPTCHA_LANGUAGE = RECAPTCHA_LANGUAGE;
    exports.RECAPTCHA_NONCE = RECAPTCHA_NONCE;
    exports.RECAPTCHA_SETTINGS = RECAPTCHA_SETTINGS;
    exports.RECAPTCHA_V3_SITE_KEY = RECAPTCHA_V3_SITE_KEY;
    exports.ReCaptchaV3Service = ReCaptchaV3Service;
    exports.RecaptchaComponent = RecaptchaComponent;
    exports.RecaptchaFormsModule = RecaptchaFormsModule;
    exports.RecaptchaLoaderService = RecaptchaLoaderService;
    exports.RecaptchaModule = RecaptchaModule;
    exports.RecaptchaV3Module = RecaptchaV3Module;
    exports.RecaptchaValueAccessorDirective = RecaptchaValueAccessorDirective;
    exports.ɵa = RecaptchaCommonModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ng-recaptcha.umd.js.map
