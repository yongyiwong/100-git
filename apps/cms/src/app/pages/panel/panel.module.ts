import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SmartTableDatePickerComponent } from '../../@theme/components/smart-table-date-picker.component';
import { PanelComponent } from './panel.component';
import { PanelRoutingModule } from './panel-routing.module';
import {
  NbActionsModule,
  NbBadgeModule,
  NbCardModule,
  NbContextMenuModule,
  NbIconModule,
  NbLayoutModule,
  NbMenuModule,
  NbMenuService,
  NbSidebarModule,
  NbSidebarService,
  NbTooltipModule,
  NbUserModule,
} from '@nebular/theme';
import { HeaderComponent } from './header/header.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { MenuComponent } from './menu/menu.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ColorPickerModule } from 'ngx-color-picker';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [
    PanelComponent,
    HeaderComponent,
    MenuComponent,
    SmartTableDatePickerComponent,
  ],
  imports: [
    CommonModule,
    PanelRoutingModule,
    NbLayoutModule,
    NbSidebarModule,
    NbIconModule,
    NbEvaIconsModule,
    NbMenuModule,
    DashboardModule,
    NbActionsModule,
    NbBadgeModule,
    NbUserModule,
    NbContextMenuModule,
    NbUserModule,
    NbCardModule,
    Ng2SmartTableModule,
    FormsModule,
    ColorPickerModule,
    ToastModule,
  ],
  providers: [
    NbSidebarService,
    NbMenuService,
    ConfirmationService,
    MessageService,
  ],
})
export class PanelModule {}
