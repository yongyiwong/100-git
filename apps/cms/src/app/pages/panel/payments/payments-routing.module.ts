import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PaymentsComponent } from './payments.component';
import { ProvidersComponent } from './providers/providers.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { ReportsComponent } from './reports/reports.component';
import { ProviderChannelsComponent } from './provider-channels/provider.channels.component';
import { DepositOrdersComponent } from './deposit-orders/deposit.orders.component';
import { ProviderBanksComponent } from './provider-banks/provider.banks.component';
import { WithdrawOrdersComponent } from './withdraw-orders/withdraw.orders.component';
import { ProviderCardsComponent } from './provider-cards/provider.cards.component';

export const pageRoutes: Routes = [
  {
    path: '',
    component: PaymentsComponent,
    children: [
      {
        path: 'providers',
        component: ProvidersComponent,
      },
      {
        path: 'provider-channels',
        component: ProviderChannelsComponent,
      },
      {
        path: 'provider-banks',
        component: ProviderBanksComponent,
      },
      {
        path: 'provider-cards',
        component: ProviderCardsComponent,
      },
      {
        path: 'transaction-history',
        component: TransactionHistoryComponent,
      },
      {
        path: 'deposit-orders',
        component: DepositOrdersComponent,
      },
      {
        path: 'withdraw-orders',
        component: WithdrawOrdersComponent,
      },
      {
        path: 'reports',
        component: ReportsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(pageRoutes)],
  exports: [RouterModule],
})
export class PaymentsRoutingModule {}
