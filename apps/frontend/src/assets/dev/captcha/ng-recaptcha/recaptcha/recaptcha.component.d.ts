/// <reference types="grecaptcha" />
import { AfterViewInit, ElementRef, EventEmitter, NgZone, OnDestroy } from "@angular/core";
import { RecaptchaLoaderService } from "./recaptcha-loader.service";
import { RecaptchaSettings } from "./recaptcha-settings";
import * as ɵngcc0 from '@angular/core';
export declare type NeverUndefined<T> = T extends undefined ? never : T;
export declare type RecaptchaErrorParameters = Parameters<NeverUndefined<ReCaptchaV2.Parameters["error-callback"]>>;
export declare class RecaptchaComponent implements AfterViewInit, OnDestroy {
    private elementRef;
    private loader;
    private zone;
    id: string;
    siteKey: string;
    theme: ReCaptchaV2.Theme;
    type: ReCaptchaV2.Type;
    size: ReCaptchaV2.Size;
    tabIndex: number;
    badge: ReCaptchaV2.Badge;
    errorMode: "handled" | "default";
    resolved: EventEmitter<string>;
    error: EventEmitter<[]>;
    /** @internal */
    private subscription;
    /** @internal */
    private widget;
    /** @internal */
    private grecaptcha;
    /** @internal */
    private executeRequested;
    constructor(elementRef: ElementRef, loader: RecaptchaLoaderService, zone: NgZone, settings?: RecaptchaSettings);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /**
     * Executes the invisible recaptcha.
     * Does nothing if component's size is not set to "invisible".
     */
    execute(): void;
    reset(): void;
    /** @internal */
    private expired;
    /** @internal */
    private errored;
    /** @internal */
    private captchaResponseCallback;
    /** @internal */
    private grecaptchaReset;
    /** @internal */
    private renderRecaptcha;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<RecaptchaComponent, [null, null, null, { optional: true; }]>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<RecaptchaComponent, "re-captcha", ["reCaptcha"], { "id": "id"; "errorMode": "errorMode"; "siteKey": "siteKey"; "theme": "theme"; "type": "type"; "size": "size"; "badge": "badge"; "tabIndex": "tabIndex"; }, { "resolved": "resolved"; "error": "error"; }, never, never>;
}

//# sourceMappingURL=recaptcha.component.d.ts.map