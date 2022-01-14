import { InjectionToken, Injectable, Inject, PLATFORM_ID, Optional, EventEmitter, Component, ElementRef, NgZone, Input, HostBinding, Output, NgModule, Directive, forwardRef, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { of, BehaviorSubject, Subject } from 'rxjs';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

import * as ɵngcc0 from '@angular/core';
function loadScript(renderMode, onLoaded, urlParams, url, nonce) {
    window.ng2recaptchaloaded = () => {
        onLoaded(grecaptcha);
    };
    const script = document.createElement("script");
    script.innerHTML = "";
    const baseUrl = url || "https://www.recaptcha.net/recaptcha/api.js";
    script.src = `${baseUrl}?render=${renderMode}&onload=ng2recaptchaloaded${urlParams}`;
    if (nonce) {
        script.nonce = nonce;
    }
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

const RECAPTCHA_LANGUAGE = new InjectionToken("recaptcha-language");
const RECAPTCHA_BASE_URL = new InjectionToken("recaptcha-base-url");
const RECAPTCHA_NONCE = new InjectionToken("recaptcha-nonce-tag");
const RECAPTCHA_SETTINGS = new InjectionToken("recaptcha-settings");
const RECAPTCHA_V3_SITE_KEY = new InjectionToken("recaptcha-v3-site-key");

class RecaptchaLoaderService {
    constructor(
    // eslint-disable-next-line @typescript-eslint/ban-types
    platformId, language, baseUrl, nonce, v3SiteKey) {
        this.platformId = platformId;
        this.language = language;
        this.baseUrl = baseUrl;
        this.nonce = nonce;
        this.v3SiteKey = v3SiteKey;
        this.init();
        this.ready = isPlatformBrowser(this.platformId)
            ? RecaptchaLoaderService.ready.asObservable()
            : of();
    }
    /** @internal */
    init() {
        if (RecaptchaLoaderService.ready) {
            return;
        }
        if (isPlatformBrowser(this.platformId)) {
            const subject = new BehaviorSubject(null);
            RecaptchaLoaderService.ready = subject;
            const langParam = this.language ? "&hl=" + this.language : "";
            const renderMode = this.v3SiteKey || "explicit";
            loadScript(renderMode, (grecaptcha) => subject.next(grecaptcha), langParam, this.baseUrl, this.nonce);
        }
    }
}
RecaptchaLoaderService.ɵfac = function RecaptchaLoaderService_Factory(t) { return new (t || RecaptchaLoaderService)(ɵngcc0.ɵɵinject(PLATFORM_ID), ɵngcc0.ɵɵinject(RECAPTCHA_LANGUAGE, 8), ɵngcc0.ɵɵinject(RECAPTCHA_BASE_URL, 8), ɵngcc0.ɵɵinject(RECAPTCHA_NONCE, 8), ɵngcc0.ɵɵinject(RECAPTCHA_V3_SITE_KEY, 8)); };
RecaptchaLoaderService.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: RecaptchaLoaderService, factory: RecaptchaLoaderService.ɵfac });
/**
 * @internal
 * @nocollapse
 */
RecaptchaLoaderService.ready = null;
RecaptchaLoaderService.ctorParameters = () => [
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [RECAPTCHA_LANGUAGE,] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [RECAPTCHA_BASE_URL,] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [RECAPTCHA_NONCE,] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [RECAPTCHA_V3_SITE_KEY,] }] }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(RecaptchaLoaderService, [{
        type: Injectable
    }], function () { return [{ type: Object, decorators: [{
                type: Inject,
                args: [PLATFORM_ID]
            }] }, { type: String, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [RECAPTCHA_LANGUAGE]
            }] }, { type: String, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [RECAPTCHA_BASE_URL]
            }] }, { type: String, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [RECAPTCHA_NONCE]
            }] }, { type: String, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [RECAPTCHA_V3_SITE_KEY]
            }] }]; }, null); })();

let nextId = 0;
class RecaptchaComponent {
    constructor(elementRef, loader, zone, settings) {
        this.elementRef = elementRef;
        this.loader = loader;
        this.zone = zone;
        this.id = `ngrecaptcha-${nextId++}`;
        this.errorMode = "default";
        this.resolved = new EventEmitter();
        // The rename will happen a bit later
        // eslint-disable-next-line @angular-eslint/no-output-native
        this.error = new EventEmitter();
        if (settings) {
            this.siteKey = settings.siteKey;
            this.theme = settings.theme;
            this.type = settings.type;
            this.size = settings.size;
            this.badge = settings.badge;
        }
    }
    ngAfterViewInit() {
        this.subscription = this.loader.ready.subscribe((grecaptcha) => {
            if (grecaptcha != null && grecaptcha.render instanceof Function) {
                this.grecaptcha = grecaptcha;
                this.renderRecaptcha();
            }
        });
    }
    ngOnDestroy() {
        // reset the captcha to ensure it does not leave anything behind
        // after the component is no longer needed
        this.grecaptchaReset();
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    /**
     * Executes the invisible recaptcha.
     * Does nothing if component's size is not set to "invisible".
     */
    execute() {
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
    }
    reset() {
        if (this.widget != null) {
            if (this.grecaptcha.getResponse(this.widget)) {
                // Only emit an event in case if something would actually change.
                // That way we do not trigger "touching" of the control if someone does a "reset"
                // on a non-resolved captcha.
                this.resolved.emit(null);
            }
            this.grecaptchaReset();
        }
    }
    /** @internal */
    expired() {
        this.resolved.emit(null);
    }
    /** @internal */
    errored(args) {
        this.error.emit(args);
    }
    /** @internal */
    captchaResponseCallback(response) {
        this.resolved.emit(response);
    }
    /** @internal */
    grecaptchaReset() {
        if (this.widget != null) {
            this.zone.runOutsideAngular(() => this.grecaptcha.reset(this.widget));
        }
    }
    /** @internal */
    renderRecaptcha() {
        // This `any` can be removed after @types/grecaptcha get updated
        const renderOptions = {
            badge: this.badge,
            callback: (response) => {
                this.zone.run(() => this.captchaResponseCallback(response));
            },
            "expired-callback": () => {
                this.zone.run(() => this.expired());
            },
            sitekey: this.siteKey,
            size: this.size,
            tabindex: this.tabIndex,
            theme: this.theme,
            type: this.type,
        };
        if (this.errorMode === "handled") {
            renderOptions["error-callback"] = (...args) => {
                this.zone.run(() => this.errored(args));
            };
        }
        this.widget = this.grecaptcha.render(this.elementRef.nativeElement, renderOptions);
        if (this.executeRequested === true) {
            this.executeRequested = false;
            this.execute();
        }
    }
}
RecaptchaComponent.ɵfac = function RecaptchaComponent_Factory(t) { return new (t || RecaptchaComponent)(ɵngcc0.ɵɵdirectiveInject(ɵngcc0.ElementRef), ɵngcc0.ɵɵdirectiveInject(RecaptchaLoaderService), ɵngcc0.ɵɵdirectiveInject(ɵngcc0.NgZone), ɵngcc0.ɵɵdirectiveInject(RECAPTCHA_SETTINGS, 8)); };
RecaptchaComponent.ɵcmp = ɵngcc0.ɵɵdefineComponent({ type: RecaptchaComponent, selectors: [["re-captcha"]], hostVars: 1, hostBindings: function RecaptchaComponent_HostBindings(rf, ctx) { if (rf & 2) {
        ɵngcc0.ɵɵattribute("id", ctx.id);
    } }, inputs: { id: "id", errorMode: "errorMode", siteKey: "siteKey", theme: "theme", type: "type", size: "size", badge: "badge", tabIndex: "tabIndex" }, outputs: { resolved: "resolved", error: "error" }, exportAs: ["reCaptcha"], decls: 0, vars: 0, template: function RecaptchaComponent_Template(rf, ctx) { }, encapsulation: 2 });
RecaptchaComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: RecaptchaLoaderService },
    { type: NgZone },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [RECAPTCHA_SETTINGS,] }] }
];
RecaptchaComponent.propDecorators = {
    id: [{ type: Input }, { type: HostBinding, args: ["attr.id",] }],
    siteKey: [{ type: Input }],
    theme: [{ type: Input }],
    type: [{ type: Input }],
    size: [{ type: Input }],
    tabIndex: [{ type: Input }],
    badge: [{ type: Input }],
    errorMode: [{ type: Input }],
    resolved: [{ type: Output }],
    error: [{ type: Output }]
};
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(RecaptchaComponent, [{
        type: Component,
        args: [{
                exportAs: "reCaptcha",
                selector: "re-captcha",
                template: ``
            }]
    }], function () { return [{ type: ɵngcc0.ElementRef }, { type: RecaptchaLoaderService }, { type: ɵngcc0.NgZone }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [RECAPTCHA_SETTINGS]
            }] }]; }, { id: [{
            type: Input
        }, {
            type: HostBinding,
            args: ["attr.id"]
        }], errorMode: [{
            type: Input
        }], resolved: [{
            type: Output
        }], error: [{
            type: Output
        }], siteKey: [{
            type: Input
        }], theme: [{
            type: Input
        }], type: [{
            type: Input
        }], size: [{
            type: Input
        }], badge: [{
            type: Input
        }], tabIndex: [{
            type: Input
        }] }); })();

class RecaptchaCommonModule {
}
RecaptchaCommonModule.ɵmod = ɵngcc0.ɵɵdefineNgModule({ type: RecaptchaCommonModule });
RecaptchaCommonModule.ɵinj = ɵngcc0.ɵɵdefineInjector({ factory: function RecaptchaCommonModule_Factory(t) { return new (t || RecaptchaCommonModule)(); } });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵngcc0.ɵɵsetNgModuleScope(RecaptchaCommonModule, { declarations: [RecaptchaComponent], exports: [RecaptchaComponent] }); })();
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(RecaptchaCommonModule, [{
        type: NgModule,
        args: [{
                declarations: [RecaptchaComponent],
                exports: [RecaptchaComponent]
            }]
    }], null, null); })();

class RecaptchaModule {
}
RecaptchaModule.ɵmod = ɵngcc0.ɵɵdefineNgModule({ type: RecaptchaModule });
RecaptchaModule.ɵinj = ɵngcc0.ɵɵdefineInjector({ factory: function RecaptchaModule_Factory(t) { return new (t || RecaptchaModule)(); }, providers: [RecaptchaLoaderService], imports: [[RecaptchaCommonModule]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵngcc0.ɵɵsetNgModuleScope(RecaptchaModule, { imports: [RecaptchaCommonModule], exports: [RecaptchaComponent] }); })();
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(RecaptchaModule, [{
        type: NgModule,
        args: [{
                exports: [RecaptchaComponent],
                imports: [RecaptchaCommonModule],
                providers: [RecaptchaLoaderService]
            }]
    }], null, null); })();

/**
 * The main service for working with reCAPTCHA v3 APIs.
 *
 * Use the `execute` method for executing a single action, and
 * `onExecute` observable for listening to all actions at once.
 */
class ReCaptchaV3Service {
    constructor(zone, siteKey,
    // eslint-disable-next-line @typescript-eslint/ban-types
    platformId, baseUrl, nonce, language) {
        /** @internal */
        this.onLoadComplete = (grecaptcha) => {
            this.grecaptcha = grecaptcha;
            if (this.actionBacklog && this.actionBacklog.length > 0) {
                this.actionBacklog.forEach(([action, subject]) => this.executeActionWithSubject(action, subject));
                this.actionBacklog = undefined;
            }
        };
        this.zone = zone;
        this.isBrowser = isPlatformBrowser(platformId);
        this.siteKey = siteKey;
        this.nonce = nonce;
        this.language = language;
        this.baseUrl = baseUrl;
        this.init();
    }
    get onExecute() {
        if (!this.onExecuteSubject) {
            this.onExecuteSubject = new Subject();
            this.onExecuteObservable = this.onExecuteSubject.asObservable();
        }
        return this.onExecuteObservable;
    }
    get onExecuteError() {
        if (!this.onExecuteErrorSubject) {
            this.onExecuteErrorSubject = new Subject();
            this.onExecuteErrorObservable = this.onExecuteErrorSubject.asObservable();
        }
        return this.onExecuteErrorObservable;
    }
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
    execute(action) {
        const subject = new Subject();
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
    }
    /** @internal */
    executeActionWithSubject(action, subject) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const onError = (error) => {
            this.zone.run(() => {
                subject.error(error);
                if (this.onExecuteErrorSubject) {
                    // We don't know any better at this point, unfortunately, so have to resort to `any`
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    this.onExecuteErrorSubject.next({ action, error });
                }
            });
        };
        this.zone.runOutsideAngular(() => {
            try {
                this.grecaptcha
                    .execute(this.siteKey, { action })
                    .then((token) => {
                    this.zone.run(() => {
                        subject.next(token);
                        subject.complete();
                        if (this.onExecuteSubject) {
                            this.onExecuteSubject.next({ action, token });
                        }
                    });
                }, onError);
            }
            catch (e) {
                onError(e);
            }
        });
    }
    /** @internal */
    init() {
        if (this.isBrowser) {
            if ("grecaptcha" in window) {
                this.grecaptcha = grecaptcha;
            }
            else {
                const langParam = this.language ? "&hl=" + this.language : "";
                loadScript(this.siteKey, this.onLoadComplete, langParam, this.baseUrl, this.nonce);
            }
        }
    }
}
ReCaptchaV3Service.ɵfac = function ReCaptchaV3Service_Factory(t) { return new (t || ReCaptchaV3Service)(ɵngcc0.ɵɵinject(ɵngcc0.NgZone), ɵngcc0.ɵɵinject(RECAPTCHA_V3_SITE_KEY), ɵngcc0.ɵɵinject(PLATFORM_ID), ɵngcc0.ɵɵinject(RECAPTCHA_BASE_URL, 8), ɵngcc0.ɵɵinject(RECAPTCHA_NONCE, 8), ɵngcc0.ɵɵinject(RECAPTCHA_LANGUAGE, 8)); };
ReCaptchaV3Service.ɵprov = ɵngcc0.ɵɵdefineInjectable({ token: ReCaptchaV3Service, factory: ReCaptchaV3Service.ɵfac });
ReCaptchaV3Service.ctorParameters = () => [
    { type: NgZone },
    { type: String, decorators: [{ type: Inject, args: [RECAPTCHA_V3_SITE_KEY,] }] },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [RECAPTCHA_BASE_URL,] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [RECAPTCHA_NONCE,] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [RECAPTCHA_LANGUAGE,] }] }
];
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(ReCaptchaV3Service, [{
        type: Injectable
    }], function () { return [{ type: ɵngcc0.NgZone }, { type: String, decorators: [{
                type: Inject,
                args: [RECAPTCHA_V3_SITE_KEY]
            }] }, { type: Object, decorators: [{
                type: Inject,
                args: [PLATFORM_ID]
            }] }, { type: String, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [RECAPTCHA_BASE_URL]
            }] }, { type: String, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [RECAPTCHA_NONCE]
            }] }, { type: String, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [RECAPTCHA_LANGUAGE]
            }] }]; }, null); })();

class RecaptchaV3Module {
}
RecaptchaV3Module.ɵmod = ɵngcc0.ɵɵdefineNgModule({ type: RecaptchaV3Module });
RecaptchaV3Module.ɵinj = ɵngcc0.ɵɵdefineInjector({ factory: function RecaptchaV3Module_Factory(t) { return new (t || RecaptchaV3Module)(); }, providers: [ReCaptchaV3Service] });
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(RecaptchaV3Module, [{
        type: NgModule,
        args: [{
                providers: [ReCaptchaV3Service]
            }]
    }], null, null); })();

class RecaptchaValueAccessorDirective {
    constructor(host) {
        this.host = host;
    }
    writeValue(value) {
        if (!value) {
            this.host.reset();
        }
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    onResolve($event) {
        if (this.onChange) {
            this.onChange($event);
        }
        if (this.onTouched) {
            this.onTouched();
        }
    }
}
RecaptchaValueAccessorDirective.ɵfac = function RecaptchaValueAccessorDirective_Factory(t) { return new (t || RecaptchaValueAccessorDirective)(ɵngcc0.ɵɵdirectiveInject(RecaptchaComponent)); };
RecaptchaValueAccessorDirective.ɵdir = ɵngcc0.ɵɵdefineDirective({ type: RecaptchaValueAccessorDirective, selectors: [["re-captcha", "formControlName", ""], ["re-captcha", "formControl", ""], ["re-captcha", "ngModel", ""]], hostBindings: function RecaptchaValueAccessorDirective_HostBindings(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵlistener("resolved", function RecaptchaValueAccessorDirective_resolved_HostBindingHandler($event) { return ctx.onResolve($event); });
    } }, features: [ɵngcc0.ɵɵProvidersFeature([
            {
                multi: true,
                provide: NG_VALUE_ACCESSOR,
                // tslint:disable-next-line:no-forward-ref
                useExisting: forwardRef(() => RecaptchaValueAccessorDirective)
            },
        ])] });
RecaptchaValueAccessorDirective.ctorParameters = () => [
    { type: RecaptchaComponent }
];
RecaptchaValueAccessorDirective.propDecorators = {
    onResolve: [{ type: HostListener, args: ["resolved", ["$event"],] }]
};
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(RecaptchaValueAccessorDirective, [{
        type: Directive,
        args: [{
                providers: [
                    {
                        multi: true,
                        provide: NG_VALUE_ACCESSOR,
                        // tslint:disable-next-line:no-forward-ref
                        useExisting: forwardRef(() => RecaptchaValueAccessorDirective)
                    },
                ],
                // tslint:disable-next-line:directive-selector
                selector: "re-captcha[formControlName],re-captcha[formControl],re-captcha[ngModel]"
            }]
    }], function () { return [{ type: RecaptchaComponent }]; }, { onResolve: [{
            type: HostListener,
            args: ["resolved", ["$event"]]
        }] }); })();

class RecaptchaFormsModule {
}
RecaptchaFormsModule.ɵmod = ɵngcc0.ɵɵdefineNgModule({ type: RecaptchaFormsModule });
RecaptchaFormsModule.ɵinj = ɵngcc0.ɵɵdefineInjector({ factory: function RecaptchaFormsModule_Factory(t) { return new (t || RecaptchaFormsModule)(); }, imports: [[FormsModule, RecaptchaCommonModule]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵngcc0.ɵɵsetNgModuleScope(RecaptchaFormsModule, { declarations: function () { return [RecaptchaValueAccessorDirective]; }, imports: function () { return [FormsModule, RecaptchaCommonModule]; }, exports: function () { return [RecaptchaValueAccessorDirective]; } }); })();
/*@__PURE__*/ (function () { ɵngcc0.ɵsetClassMetadata(RecaptchaFormsModule, [{
        type: NgModule,
        args: [{
                declarations: [RecaptchaValueAccessorDirective],
                exports: [RecaptchaValueAccessorDirective],
                imports: [FormsModule, RecaptchaCommonModule]
            }]
    }], null, null); })();

/**
 * Generated bundle index. Do not edit.
 */

export { RECAPTCHA_BASE_URL, RECAPTCHA_LANGUAGE, RECAPTCHA_NONCE, RECAPTCHA_SETTINGS, RECAPTCHA_V3_SITE_KEY, ReCaptchaV3Service, RecaptchaComponent, RecaptchaFormsModule, RecaptchaLoaderService, RecaptchaModule, RecaptchaV3Module, RecaptchaValueAccessorDirective, RecaptchaCommonModule as ɵa };

//# sourceMappingURL=ng-recaptcha.js.map
