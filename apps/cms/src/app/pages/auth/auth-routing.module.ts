import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NbAuthComponent } from '@nebular/auth';
import { ResetPasswordComponent } from './reset/reset.component';
import { AuthGuard } from '../../shared/guards/auth.guard';

export const AuthRoutes: Routes = [
  {
    path: '',
    component: NbAuthComponent, // <---
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent, // <---
      },
      {
        path: 'reset',
        component: ResetPasswordComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  // {
  //   path: '',
  //   redirectTo: 'login',
  //   pathMatch: 'full',
  // },
  // {
  //   path: '',
  //   //component: NbAuthComponent,
  //   children: [
  //     {
  //       path: 'login',
  //       component: LoginComponent,
  //     },
  //   ],
  // },
];

@NgModule({
  imports: [RouterModule.forChild(AuthRoutes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
