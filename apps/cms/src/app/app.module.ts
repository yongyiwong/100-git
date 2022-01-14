import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { CoreModule } from './@core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThemeModule } from './@theme/theme.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TooltipModule } from 'primeng/tooltip';
import {
  NbMenuModule,
  //NbThemeModule,
  NbToastrModule,
  NbDialogModule,
  NbTooltipModule,
} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AuthModule } from './pages/auth/auth.module';
import { AuthErrorHandler } from './error-handler';
import {
  NbAuthModule,
  NbPasswordAuthStrategy,
  NbAuthJWTToken,
} from '@nebular/auth';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    ThemeModule.forRoot(),
    BrowserAnimationsModule,
    NbMenuModule.forRoot(),
    Ng2SmartTableModule,
    CoreModule.forRoot(),
    AuthModule,
    HttpClientModule,
    NbToastrModule.forRoot(),
    NbDialogModule.forRoot(),
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',
          token: {
            class: NbAuthJWTToken,
            key: 'token',
          },
          baseEndpoint: environment.apiUrl,
          login: {
            endpoint: environment.loginPath,
          },
          resetPass: {
            endpoint: environment.resetPass,
          },
        }),
      ],
      forms: {
        login: {
          redirectDelay: 200,
          strategy: 'email',
          rememberMe: true,
          showMessages: {
            success: true,
            error: true,
          },
          redirect: {
            success: environment.homePath,
            failure: null,
          },
        },
      },
    }),
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: AuthErrorHandler,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
