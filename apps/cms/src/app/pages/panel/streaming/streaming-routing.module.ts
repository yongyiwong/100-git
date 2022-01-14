import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import { StreamingComponent } from './streaming.component';


export const pageRoutes: Routes = [
  {
    path: '',
    component: StreamingComponent,
    children: []
  }
]

@NgModule({
  imports: [RouterModule.forChild(pageRoutes)],
  exports: [RouterModule]
})
export class StreamingRoutingModule { }
