/// <reference types="grecaptcha" />
import { Observable } from "rxjs";
import * as ɵngcc0 from '@angular/core';
export declare class RecaptchaLoaderService {
    private readonly platformId;
    /**
     * @internal
     * @nocollapse
     */
    private static ready;
    ready: Observable<ReCaptchaV2.ReCaptcha>;
    /** @internal */
    private language;
    /** @internal */
    private baseUrl;
    /** @internal */
    private nonce;
    /** @internal */
    private v3SiteKey;
    constructor(platformId: Object, language?: string, baseUrl?: string, nonce?: string, v3SiteKey?: string);
    /** @internal */
    private init;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<RecaptchaLoaderService, [null, { optional: true; }, { optional: true; }, { optional: true; }, { optional: true; }]>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<RecaptchaLoaderService>;
}

//# sourceMappingURL=recaptcha-loader.service.d.ts.map