import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbSpinnerModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { OptionsRoutingModule } from './options-routing.module';
import { OptionsComponent } from './options.component';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [OptionsComponent],
  imports: [
    CommonModule,
    FormsModule,
    NbSpinnerModule,
    NbCardModule,
    Ng2SmartTableModule,
    OptionsRoutingModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    InputNumberModule,
    InputTextModule,
  ],
})
export class OptionsModule {}
