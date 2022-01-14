import { ControlValueAccessor } from "@angular/forms";
import { RecaptchaComponent } from "./recaptcha.component";
import * as ɵngcc0 from '@angular/core';
export declare class RecaptchaValueAccessorDirective implements ControlValueAccessor {
    private host;
    /** @internal */
    private onChange;
    /** @internal */
    private onTouched;
    constructor(host: RecaptchaComponent);
    writeValue(value: string): void;
    registerOnChange(fn: (value: string) => void): void;
    registerOnTouched(fn: () => void): void;
    onResolve($event: string): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<RecaptchaValueAccessorDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<RecaptchaValueAccessorDirective, "re-captcha[formControlName],re-captcha[formControl],re-captcha[ngModel]", never, {}, {}, never>;
}

//# sourceMappingURL=recaptcha-value-accessor.directive.d.ts.map