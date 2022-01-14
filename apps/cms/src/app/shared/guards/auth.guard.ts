import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  CanActivateChild,
} from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NbAuthJWTToken, NbAuthService, NbTokenService } from '@nebular/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private authService: NbAuthService,
    private tokenService: NbTokenService
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // return this.tokenService.get().pipe(
    //   tap((token) => {
    //     console.log(token.isValid(), ':tokenVaild');
    //   })
    // );

    return this.authService.isAuthenticated().pipe(
      tap(async (authenticated) => {
        // const token = <NbAuthJWTToken>await this.tokenService.get().toPromise();
        // console.log(token);
        if (!authenticated) {
          this.router.navigate(['auth/login']);
        }
      })
    );
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    // console.log('canActivateChild');

    return this.authService.isAuthenticatedOrRefresh().pipe(
      tap((authenticated) => {
        if (!authenticated) {
          this.router.navigate(['auth/login']);
        }
      })
    );
  }
}
