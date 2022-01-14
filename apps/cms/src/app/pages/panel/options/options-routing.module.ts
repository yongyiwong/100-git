import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import { OptionsComponent } from './options.component';


export const pageRoutes: Routes = [
  {
    path: '',
    component: OptionsComponent,
    children: []
  }
]

@NgModule({
  imports: [RouterModule.forChild(pageRoutes)],
  exports: [RouterModule]
})
export class OptionsRoutingModule { }
