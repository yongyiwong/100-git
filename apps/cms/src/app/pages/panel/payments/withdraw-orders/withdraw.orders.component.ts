import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { environment } from '../../../../../environments/environment';
import { NbAuthService, NbAuthToken } from '@nebular/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  ConfirmationService,
  FilterMatchMode,
  FilterService,
  MessageService,
} from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment-timezone';
import { ManualWithdrawOrderComponent } from './manual/manual.withdraw.order.component';
import { AppNotificationService } from 'apps/cms/src/app/app.notification.service';

@Component({
  selector: 'cms-withdraw-orders',
  templateUrl: './withdraw.orders.component.html',
  styleUrls: ['./withdraw.orders.component.scss'],
})
export class WithdrawOrdersComponent implements OnInit {
  first = 0;
  page = 1;
  loading = false;
  withdrawOrders = [];
  paymentProviders = [];
  statuses = [
    { name: 'new' },
    { name: 'readyToPay' },
    { name: 'pending' },
    { name: 'failed' },
    { name: 'success' },
  ];
  channels = [];
  cols: any[] = [
    {
      field: 'userId',
      header: 'UserID',
    },
    {
      field: 'bankAccountName',
      header: 'Name',
    },
    {
      field: 'date',
      header: 'Date',
    },
    {
      field: 'amount',
      header: 'Amount',
    },
    {
      field: 'status',
      header: 'Status',
    },
    {
      field: 'orderId',
      header: 'OrderID',
    },
    {
      field: 'paymentProviderId',
      header: 'Provider',
    },
    {
      field: 'providerOrderId',
      header: 'Provider OrderID',
    },
    {
      field: 'errorCode',
      header: 'Error',
    },
    {
      field: 'bankAccountNumber',
      header: 'bankNumber',
    },
    {
      field: 'branch',
      header: 'branch',
    },
    {
      field: 'province',
      header: 'province',
    },
    {
      field: 'city',
      header: 'city',
    },
  ];

  @ViewChild('dt') table: Table;

  constructor(
    private filterService: FilterService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private http: HttpClient,
    private authService: NbAuthService,
    private dialog: MatDialog,
    private appNotificationService: AppNotificationService
  ) {}

  ngOnInit(): void {
    this.getWithdrawOrders();
    this.getProviders();

    this.filterService.register(
      'isPaymentProvider',
      (value, filter): boolean => {
        if (!filter || filter.length < 1) {
          return true;
        }
        const findValue = filter.find(
          (_i_filter) => `${value.id}` === `${_i_filter['id']}`
        );

        return findValue ? true : false;
      }
    );

    this.filterService.register('isOrderId', (value, filter): boolean => {
      if (!filter || filter.length < 1) {
        return true;
      }

      const findValue = value.find((_i_value) =>
        `${_i_value}`.includes(filter)
      );
      return findValue ? true : false;
    });
  }

  clear(table: Table) {
    table.clear();
  }

  onRefresh() {
    this.getWithdrawOrders();
  }

  formatDate(strDate) {
    return moment(strDate).format('MM/DD/YYYY HH:mm:ss');
  }

  async getWithdrawOrders() {
    this.loading = true;
    const token = await this.authService.getToken().toPromise();
    const orders = <[]>await this.http
      .get(
        environment.apiUrl +
          environment.getWithdrawAllOrders +
          '?pageSize=10000&page=' +
          this.page,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }),
        }
      )
      .toPromise();
    this.loading = false;

    const first = this.first;
    this.first = 0;

    this.withdrawOrders = orders || [];

    setTimeout(() => {
      this.first = Math.max(Math.min(first, this.withdrawOrders.length - 1), 0);
    }, 50);

    let latestDate = '';
    let latestNum = 0;
    this.withdrawOrders.forEach((order, i) => {
      const orderDate = moment(order.date)
        .utcOffset('+08:00')
        .format('MM/DD/YYYY');
      if (i === 0) {
        latestDate = orderDate;
      }

      if (orderDate === latestDate) {
        latestNum++;
      }

      order.orderDate = moment(order.date).toDate();
      order.orderIds = [order.orderId, order.clientOrderId];
    });

    this.appNotificationService.onLoadedWithdrawOrder(
      this.withdrawOrders.length > 0
        ? {
            date: latestDate,
            nums: latestNum,
          }
        : null
    );

    return orders;
  }

  async getProviders() {
    const token = await this.authService.getToken().toPromise();
    const paymentProviders = <[]>await this.http
      .get(
        environment.apiUrl +
          environment.getPaymentProviders +
          '?pageSize=10000&page=' +
          this.page,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }),
        }
      )
      .toPromise();

    this.paymentProviders = paymentProviders || [];
  }

  async addManualOrder(order?) {
    const dialogRef = this.dialog.open(ManualWithdrawOrderComponent, {
      hasBackdrop: true,
      disableClose: true,
      autoFocus: false,
      data: { order },
    });

    const response = await dialogRef.afterClosed().toPromise();

    if (!response || !response.result) {
      return;
    }

    const data = response.data;

    this.table.filters['userId'] = [
      {
        matchMode: FilterMatchMode.STARTS_WITH,
        operator: 'and',
        value: `${data.userId}`,
      },
    ];

    this.table._filter();
    this.getWithdrawOrders();
  }

  async makeItSuccess(order) {
    this.confirmationService.confirm({
      message: `Are you sure that order(${order.orderId}) of user(${order.userId}) make it 'success'?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.doMakeItSuccess(order);
      },
      reject: (type) => {},
    });
  }

  async doMakeItSuccess(order) {
    const token = await this.authService.getToken().toPromise();

    this.loading = true;
    try {
      const data = await this.http
        .post(
          environment.apiUrl + environment.makeWithdrawSuccess,
          {
            orderId: order.orderId,
          },
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            }),
          }
        )
        .toPromise();
      if (!data) {
        this.messageService.add({
          severity: 'error',
          summary: 'failed',
          detail: 'Failed',
        });
        this.loading = false;
        return;
      }

      this.getWithdrawOrders();

      return;
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'error',
        detail: 'There is error in backend api',
      });
    }
    this.loading = false;
  }

  async copyBankInfoToClipboard(order) {
    // const bankInfo = {
    //   bankAccountName: order.bankAccountName,
    //   bankAccountNumber: order.bankAccountNumber,
    //   branch: order.branch,
    //   province: order.province,
    //   city: order.city,
    // };

    const str =
      `代付申请` +
      `\n收款人姓名: ${order.bankAccountName}` +
      `\n银行: ${order.bank.bankName} ${order.branch}` +
      `\n银行卡号: ${order.bankAccountNumber}` +
      `\n金额： ${order.amount}`;

    this.copyToClipboard(str);
  }

  copyToClipboard(str) {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}
