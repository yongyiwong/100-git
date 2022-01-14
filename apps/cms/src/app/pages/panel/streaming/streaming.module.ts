import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbSpinnerModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { StreamingRoutingModule } from './streaming-routing.module';
import { StreamingComponent } from './streaming.component';



@NgModule({
  declarations: [StreamingComponent],
  imports: [
    CommonModule,
    NbSpinnerModule,
    NbCardModule,
    Ng2SmartTableModule,
    StreamingRoutingModule
  ]
})

export class StreamingModule { }
