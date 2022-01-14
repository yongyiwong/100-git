import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset/reset.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { HttpResponse } from '@angular/common/http';

import { NbAuthModule } from '@nebular/auth';
import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule,
  NbMenuService,
  NbSidebarService,
} from '@nebular/theme';

@NgModule({
  declarations: [LoginComponent, ResetPasswordComponent],
  imports: [
    NbAlertModule,
    NbButtonModule,
    NbCheckboxModule,
    CommonModule,
    AuthRoutingModule,
    RouterModule,
    NbInputModule,
    FormsModule,
    NbAuthModule,
  ],
  providers: [
    /* NbSidebarService, NbMenuService */
  ],
})
export class AuthModule {}
