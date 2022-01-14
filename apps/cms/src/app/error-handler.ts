import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthErrorHandler implements ErrorHandler {
  constructor(private router: Router) {}

  handleError(error) {
    if (
      error &&
      error.error &&
      (error.error.statusCode === 401 || error.error.statusCode === 403)
    ) {
      this.router.navigate(['auth/login']);
    }

    if (error.message) {
      const matches = error.message.match(/\"statusCode\":([0-9]+)?,/);
      if (matches && matches.length > 1) {
        const statusCode = matches[1];
        if (`${statusCode}` === `401`) {
          this.router.navigate(['auth/login']);
        }
      }
    }

    throw error;
  }
}
