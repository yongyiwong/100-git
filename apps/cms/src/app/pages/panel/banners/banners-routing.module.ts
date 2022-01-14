import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BannersComponent } from './banners.component';

export const pageRoutes: Routes = [
  {
    path: 'home',
    component: BannersComponent,
    children: []
  }
]


@NgModule({
  imports: [RouterModule.forChild(pageRoutes)],
  exports: [RouterModule]
})
export class BannersRoutingModule { }
