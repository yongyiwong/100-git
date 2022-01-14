import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  NbAuthResult,
  NbAuthService,
  NbResetPasswordComponent,
  NB_AUTH_OPTIONS,
} from '@nebular/auth';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'cms-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetPasswordComponent
  extends NbResetPasswordComponent
  implements OnInit {
  shakeError: boolean;

  constructor(
    protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router,
    private http: HttpClient
  ) {
    super(service, options, cd, router);
  }

  ngOnInit(): void {
    //this.shakeError = false;
  }

  async resetPass(): Promise<void> {
    this.errors = this.messages = [];
    this.submitted = true;

    const token = await this.service.getToken().toPromise();

    try {
      const result = await this.http
        .put(environment.apiUrl + environment.resetPass, this.user, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }),
        })
        .toPromise();

      if (result !== true) {
        this.submitted = false;
        return;
      }

      setTimeout(() => {
        this.submitted = false;
        return this.router.navigateByUrl('/');
      }, this.redirectDelay);
    } catch (error) {
      this.submitted = false;
    }

    // this.service
    //   .resetPassword(this.strategy, this.user)
    //   .subscribe((result: NbAuthResult) => {
    //     this.submitted = false;
    //     if (result.isSuccess()) {
    //       this.messages = result.getMessages();
    //     } else {
    //       this.errors = result.getErrors();
    //     }

    //     const redirect = result.getRedirect();
    //     if (redirect) {
    //       setTimeout(() => {
    //         return this.router.navigateByUrl(redirect);
    //       }, this.redirectDelay);
    //     }
    //     this.cd.detectChanges();
    //   });
  }
}
