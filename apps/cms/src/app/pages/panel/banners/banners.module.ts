import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbAccordionModule,
  NbButtonModule,
  NbCardModule,
  NbInputModule,
  NbTabsetModule,
  NbToggleModule
} from '@nebular/theme';
import { ColorPickerModule } from 'ngx-color-picker';
import { BannersRoutingModule } from './banners-routing.module';
import { BannersComponent } from './banners.component';



@NgModule({
  declarations: [BannersComponent],
  imports: [
    CommonModule,
    BannersRoutingModule,
    NbCardModule,
    NbAccordionModule,
    NbTabsetModule,
    NbButtonModule,
    NbInputModule,
    NbToggleModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    ColorPickerModule
  ]
})
export class BannersModule { }
