import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { NbAuthService, NbAuthToken } from '@nebular/auth';
import * as moment from 'moment-timezone';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ManualDepositOrderComponent } from './manual/manual.deposit.order.component';
import { Table } from 'primeng/table';
import {
  ConfirmationService,
  FilterMatchMode,
  FilterService,
  MessageService,
} from 'primeng/api';
import { MakeItSuccessComponent } from './makeitsuccess/makeitsuccess.component';
import { AppNotificationService } from 'apps/cms/src/app/app.notification.service';

@Component({
  selector: 'cms-deposit-orders',
  templateUrl: './deposit.orders.component.html',
  styleUrls: ['./deposit.orders.component.scss'],
})
export class DepositOrdersComponent implements OnInit, AfterViewInit {
  first = 0;
  page = 1;
  loading = false;
  depositOrders = [];
  paymentProviders = [];
  statuses = [
    { name: 'new' },
    { name: 'readyToPay' },
    { name: 'pending' },
    { name: 'failed' },
    { name: 'success' },
  ];
  channels = [];
  cols: any[];

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

  async ngOnInit(): Promise<void> {
    await this.getDepositOrders();

    this.cols = [
      {
        field: 'userId',
        header: 'UserID',
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
        field: 'paymentProviderChannelId',
        header: 'Channel',
      },
      {
        field: 'providerOrderId',
        header: 'Provider OrderID',
      },
      {
        field: 'userName',
        header: 'userName',
      },
      {
        field: 'last4Digit',
        header: 'last4Digit',
      },
    ];

    this.getProviders();
    this.getChannels();

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

    this.filterService.register(
      'isPaymentProviderChannel',
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
  }

  formatDate(strDate) {
    return moment(strDate).format('MM/DD/YYYY HH:mm:ss');
  }

  ngAfterViewInit() {}

  async getDepositOrders() {
    this.loading = true;
    const token = await this.authService.getToken().toPromise();
    const orders = <[]>await this.http
      .get(
        environment.apiUrl +
          environment.getDepositAllOrders +
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

    this.depositOrders = orders || [];

    setTimeout(() => {
      this.first = Math.max(Math.min(first, this.depositOrders.length - 1), 0);
    }, 50);

    let latestDate = '';
    let latestNum = 0;
    this.depositOrders.forEach((order, i) => {
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
    });

    this.appNotificationService.onLoadedDepositOrder(
      this.depositOrders.length > 0
        ? {
            date: latestDate,
            nums: latestNum,
          }
        : null
    );
    return orders;
  }

  async addManualOrder(order?) {
    const dialogRef = this.dialog.open(ManualDepositOrderComponent, {
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

    this.getDepositOrders();
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

  async getChannels() {
    const token = await this.authService.getToken().toPromise();
    const channels = <[]>await this.http
      .get(
        environment.apiUrl +
          environment.getChannels +
          '?pageSize=10000&page=' +
          this.page,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }),
          params: { depositOrWithdrawable: '1' },
        }
      )
      .toPromise();

    this.channels = channels || [];
  }

  clear(table: Table) {
    table.clear();
  }

  onRefresh() {
    this.getDepositOrders();
  }

  makeItSuccess = async (order) => {
    const dialogRef = this.dialog.open(MakeItSuccessComponent, {
      hasBackdrop: true,
      disableClose: true,
      autoFocus: false,
      data: { order },
    });

    const response = await dialogRef.afterClosed().toPromise();

    if (!response || !response.result) {
      return;
    }

    await this.getDepositOrders();

    // const token = await this.authService.getToken().toPromise();
    // this.confirmationService.confirm({
    //   message: `Are you sure that order(${order.orderId}) of user(${order.userId}) make it 'success'?`,
    //   header: 'Confirmation',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: async () => {
    //     this.loading = true;
    //     try {
    //       const data = await this.http
    //         .post(
    //           environment.apiUrl + environment.makeDepositSusccess,
    //           {
    //             orderId: order.orderId,
    //           },
    //           {
    //             headers: new HttpHeaders({
    //               'Content-Type': 'application/json',
    //               Authorization: `Bearer ${token}`,
    //             }),
    //           }
    //         )
    //         .toPromise();
    //       if (!data) {
    //         this.messageService.add({
    //           severity: 'error',
    //           summary: 'failed',
    //           detail: 'Failed',
    //         });
    //         this.loading = false;
    //         return;
    //       }
    //       await this.getDepositOrders();
    //       return;
    //     } catch (error) {
    //       this.messageService.add({
    //         severity: 'error',
    //         summary: 'error',
    //         detail: 'There is error in backend api',
    //       });
    //     }
    //     this.loading = false;
    //   },
    //   reject: (type) => {},
    // });
  };

  async copyBankInfoToClipboard(order) {
    // const bankInfo = {
    //   bankAccountName: order.bankAccountName,
    //   bankAccountNumber: order.bankAccountNumber,
    //   branch: order.branch,
    //   province: order.province,
    //   city: order.city,
    // };

    const str =
      `代收查询` +
      `\n付款人姓名: ${order.userName}` +
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
