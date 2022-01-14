import { Component, OnInit } from '@angular/core';
import { NbLoginComponent } from '@nebular/auth';

@Component({
  selector: 'cms-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends NbLoginComponent implements OnInit {
  shakeError: boolean;
  loadingButton: boolean;
  emptyUsername: boolean;
  emptyPassword: boolean;
  empty2facode: boolean;

  ngOnInit(): void {
    this.loadingButton = false;
    this.shakeError = false;
    this.emptyUsername = true;
    this.emptyPassword = true;
    this.empty2facode = true;
  }

  checkFields(input) {
    if (input.name === 'email') {
      if (input.value !== '' && typeof input.value !== 'undefined') {
        this.emptyUsername = false;
      } else {
        this.emptyUsername = true;
      }
    }
    if (input.name === 'password') {
      if (input.value !== '' && typeof input.value !== 'undefined') {
        this.emptyPassword = false;
      } else {
        this.emptyPassword = true;
      }
    }

    if (input.name === 'twoFactorAuthenticationCode') {
      if (input.value !== '' && typeof input.value !== 'undefined') {
        this.empty2facode = false;
      } else {
        this.empty2facode = true;
      }
    }
  }
}
