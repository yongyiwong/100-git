import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { AppNotificationService } from '../../../app.notification.service';
import { OHB_CMS_MENU_ITEMS } from '../panel-menu';

@Component({
  selector: 'cms-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  menuItems = OHB_CMS_MENU_ITEMS;
  subScriptNumsNewDepositOrders: Subscription;
  subScriptNumsNewWithdrawOrders: Subscription;

  menuDepositOrder: NbMenuItem;
  menuWithdrawOrder: NbMenuItem;

  constructor(private appNotificationService: AppNotificationService) {
    const menuPayment = this.menuItems.find(
      (item) => item.title === 'Payments'
    );

    this.menuDepositOrder = menuPayment
      ? menuPayment.children.find((item) => item.title === 'DepositOrders')
      : null;

    this.menuWithdrawOrder = menuPayment
      ? menuPayment.children.find((item) => item.title === 'WithdrawOrders')
      : null;
  }

  ngOnInit(): void {
    this.subScriptNumsNewDepositOrders = this.appNotificationService.numsDepositOrders$.subscribe(
      (numsDeposit) => {
        if (!this.menuDepositOrder) {
          return;
        }

        this.menuDepositOrder.badge =
          numsDeposit > 0
            ? {
                text: `${numsDeposit}+`,
                status: 'danger',
              }
            : null;
      }
    );

    this.subScriptNumsNewWithdrawOrders = this.appNotificationService.numsWithdrawOrders$.subscribe(
      (numsWithdraw) => {
        if (!this.menuWithdrawOrder) {
          return;
        }

        this.menuWithdrawOrder.badge =
          numsWithdraw > 0
            ? {
                text: `${numsWithdraw}+`,
                status: 'danger',
              }
            : null;
      }
    );
  }

  ngOnDestroy(): void {
    this.subScriptNumsNewDepositOrders.unsubscribe();
    this.subScriptNumsNewWithdrawOrders.unsubscribe();
  }
}
