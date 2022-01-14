import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsComponent } from './payments.component';
import { PaymentsRoutingModule } from './payments-routing.module';
import { ProvidersComponent } from './providers/providers.component';
import { ProviderChannelsComponent } from './provider-channels/provider.channels.component';
import { ProviderBanksComponent } from './provider-banks/provider.banks.component';
import { ProviderCardsComponent } from './provider-cards/provider.cards.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { ReportsComponent } from './reports/reports.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbSpinnerModule, NbTooltipModule } from '@nebular/theme';
import { DepositOrdersComponent } from './deposit-orders/deposit.orders.component';
import { WithdrawOrdersComponent } from './withdraw-orders/withdraw.orders.component';
import { ManualDepositOrderComponent } from './deposit-orders/manual/manual.deposit.order.component';
import { ManualWithdrawOrderComponent } from './withdraw-orders/manual/manual.withdraw.order.component';
import { MakeItSuccessComponent } from './deposit-orders/makeitsuccess/makeitsuccess.component';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { BlockUIModule } from 'primeng/blockui';
import { PanelModule } from 'primeng/panel';
import { InputNumberModule } from 'primeng/inputnumber';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MultiSelectModule } from 'primeng/multiselect';
//import { ConfirmationService, MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { TestDepositComponent } from './provider-channels/testDeposit/test.deposit.component';
import { AddProviderCardComponent } from './provider-cards/addCard/add.provider.card.component';

@NgModule({
  declarations: [
    PaymentsComponent,
    ProvidersComponent,
    ProviderChannelsComponent,
    ProviderBanksComponent,
    ProviderCardsComponent,
    TransactionHistoryComponent,
    ReportsComponent,
    DepositOrdersComponent,
    WithdrawOrdersComponent,
    ManualDepositOrderComponent,
    ManualWithdrawOrderComponent,
    MakeItSuccessComponent,
    TestDepositComponent,
    AddProviderCardComponent,
  ],
  imports: [
    PaymentsRoutingModule,
    Ng2SmartTableModule,
    NbCardModule,
    CommonModule,
    NbSpinnerModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    DropdownModule,
    ProgressSpinnerModule,
    FormsModule,
    BlockUIModule,
    PanelModule,
    InputNumberModule,
    MatDialogModule,
    ConfirmDialogModule,
    MultiSelectModule,
    TooltipModule,
    CheckboxModule,
  ],
  providers: [],
})
export class PaymentsModule {}
