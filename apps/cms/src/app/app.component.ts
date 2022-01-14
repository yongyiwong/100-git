import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService, NbTokenService } from '@nebular/auth';
import { PrimeNGConfig } from 'primeng/api';
import { AppNotificationService } from './app.notification.service';

@Component({
  selector: 'cms-root',
  template: '<router-outlet></router-outlet>',
  providers: [AppNotificationService],
})
export class AppComponent implements OnInit {
  title = 'cms';

  constructor(
    private authService: NbAuthService,
    private router: Router,
    private tokenService: NbTokenService,
    private primengConfig: PrimeNGConfig,
    private appNotificationService: AppNotificationService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;

    this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      this.appNotificationService.reset();
    });

    // this.authService.onAuthenticationChange().subscribe((isAuthenticated) => {
    //   //console.log('isAuthenticated:', isAuthenticated, '+++');
    // });
  }
}
