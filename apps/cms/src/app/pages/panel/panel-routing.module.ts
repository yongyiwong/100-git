import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelComponent } from './panel.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const pageRoutes: Routes = [
  {
    path: '',
    component: PanelComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'payments',
        loadChildren: () =>
          import('./payments/payments.module').then((m) => m.PaymentsModule),
      },
      {
        path: 'streaming',
        loadChildren: () =>
          import('./streaming/streaming.module').then((m) => m.StreamingModule),
      },
      {
        path: 'banners',
        loadChildren: () =>
          import('./banners/banners.module').then((m) => m.BannersModule),
      },
      {
        path: 'options',
        loadChildren: () =>
          import('./options/options.module').then((m) => m.OptionsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(pageRoutes)],
  exports: [RouterModule],
})
export class PanelRoutingModule {}
