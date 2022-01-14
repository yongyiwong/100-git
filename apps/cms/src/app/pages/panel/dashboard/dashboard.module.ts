import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from "./dashboard.component";
import { DashboardTrafficComponent } from './dashboard-traffic/dashboard-traffic.component';
import { NbCardModule, NbIconModule, NbListModule, NbSelectModule } from "@nebular/theme";
import { DashboardProfitComponent } from './dashboard-profit/dashboard-profit.component';
import { NgxEchartsModule } from "ngx-echarts";
import { ProfitAnimationBarComponent } from './dashboard-profit/profit-animation-bar/profit-animation-bar.component';
import { DashboardGraphComponent } from './dashboard-graph/dashboard-graph.component';


@NgModule({
  declarations: [
    DashboardComponent,
    DashboardTrafficComponent,
    DashboardProfitComponent,
    ProfitAnimationBarComponent,
    DashboardGraphComponent
  ],
  imports: [
    CommonModule,
    NbCardModule,
    NbSelectModule,
    NbListModule,
    NbIconModule,
    NgxEchartsModule
  ]
})
export class DashboardModule {
}
