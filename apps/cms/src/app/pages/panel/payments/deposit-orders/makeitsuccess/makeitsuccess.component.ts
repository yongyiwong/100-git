import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NbAuthService } from '@nebular/auth';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import * as numeral from 'numeral';
import { environment } from '../../../../../../environments/environment';
import { ConfirmationService, MessageService } from 'primeng/api';

interface PaymentProvider {
  id: string;
  providerName: string;
}

interface PaymentProviderChannel {
  id: string;
  providerMinAmount: number;
  providerMaxAmount: number;
  channel: {
    channelName: string;
  };
}

@Component({
  selector: 'cms-makeitsuccsss',
  templateUrl: './makeitsuccess.component.html',
  styleUrls: ['./makeitsuccess.component.scss'],
})
export class MakeItSuccessComponent implements OnInit {
  loading = false;
  loadingPaymentProviders = false;
  loadingPaymentProviderChannels = false;

  userId: null;
  userIdHelperMsg = '';
  userIdHelperMsgClass = 'p-error';

  paymentProvider: PaymentProvider;
  paymentProviders = [];
  paymentProviderHelperMsg = '';
  paymentProviderHelperMsgClass = 'p-error';

  paymentProviderChannel: PaymentProviderChannel;
  paymentProviderChannels = [];
  paymentProviderChannelHelperMsg = '';
  paymentProviderChannelHelperMsgClass = 'p-error';

  amount = null;
  amountHelperMsg = '';
  amountHelperMsgClass = '';
  minAmount = 0;
  maxAmount = null;

  order = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private http: HttpClient,
    private authService: NbAuthService,
    public dialogRef: MatDialogRef<MakeItSuccessComponent>,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  async ngOnInit(): Promise<void> {
    const { order } = this.data || {};
    this.order = order || null;

    await this.loadPaymentProviders();

    if (this.order) {
      this.userId = this.order['userId'];
      this.amount = this.order['amount'];
      this.paymentProvider = this.order['paymentProvider'];

      await this.loadPaymentProviderChannels();
      this.paymentProviderChannel = this.order['paymentProviderChannel'];

      this.onChangePaymentProviderChannel();
    }
  }

  async loadPaymentProviders() {
    const token = await this.authService.getToken().toPromise();

    this.loadingPaymentProviders = true;

    try {
      this.paymentProviders = <PaymentProvider[]>await this.http
        .get(environment.apiUrl + environment.getPaymentProviders, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }),
          params: {
            isDepositSupport: 'true',
          },
        })
        .toPromise();
    } catch (error) {}

    this.loadingPaymentProviders = false;
  }

  async loadPaymentProviderChannels() {
    if (!this.paymentProvider) {
      return;
    }

    const token = await this.authService.getToken().toPromise();

    this.loadingPaymentProviderChannels = true;

    try {
      this.paymentProviderChannels = <PaymentProvider[]>await this.http
        .get(environment.apiUrl + environment.getPaymentProviderChannels, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }),
          params: {
            paymentProviderId: this.paymentProvider.id,
            depositOrWithdrawable: '1',
          },
        })
        .toPromise();
    } catch (error) {}

    this.loadingPaymentProviderChannels = false;
  }

  validateAmount() {
    const amount = numeral(this.amount).value();
    const minAmount = numeral(this.minAmount).value();
    const maxAmount = numeral(this.maxAmount).value();

    if (
      !amount ||
      amount <= 0 ||
      (minAmount !== null && amount < minAmount) ||
      (maxAmount !== null && amount > maxAmount)
    ) {
      this.amountHelperMsg = 'Amount is not valid';
      this.amountHelperMsgClass = 'p-error';
      return false;
    }

    this.amountHelperMsg = '';
    this.amountHelperMsgClass = '';
    return true;
  }

  validatePaymentProviderChannel() {
    if (!this.paymentProviderChannel) {
      this.paymentProviderChannelHelperMsg = 'Channel should be selected';
      this.paymentProviderChannelHelperMsgClass = 'p-error';
      return false;
    }

    this.paymentProviderChannelHelperMsg = '';
    this.paymentProviderChannelHelperMsgClass = '';

    return true;
  }

  validate(): boolean {
    let isValid = true;

    if (!this.validatePaymentProviderChannel() && isValid) {
      isValid = false;
    }

    if (!this.validateAmount() && isValid) {
      isValid = false;
    }

    if (!isValid) {
      return false;
    }

    return true;
  }

  onChangePaymentProviderChannel() {
    this.updateAmountHelperMsg();
    this.updateMinMaxAmount();
    this.validatePaymentProviderChannel();
  }

  updateAmountHelperMsg() {
    this.amountHelperMsg = this.getAmountHelperMsg();
  }

  getAmountHelperMsg() {
    let msgAmountHelper = ``;

    if (!this.paymentProviderChannel) {
      return msgAmountHelper;
    }

    const {
      providerMinAmount,
      providerMaxAmount,
    } = this.paymentProviderChannel;

    msgAmountHelper = `minAmount: ${providerMinAmount}, maxAmount: ${providerMaxAmount}`;

    return msgAmountHelper;
  }

  updateMinMaxAmount() {
    if (!this.paymentProviderChannel) {
      this.minAmount = 0;
      this.maxAmount = null;
      return;
    }

    const {
      providerMinAmount,
      providerMaxAmount,
    } = this.paymentProviderChannel;

    this.minAmount = providerMinAmount;
    this.maxAmount = providerMaxAmount;
  }

  onInputAmount(event) {
    this.amount = event.value;
    this.validateAmount();
  }

  async onSubmit(event) {
    if (!this.validate()) {
      return;
    }

    const { order } = this;

    this.confirmationService.confirm({
      message: `Are you sure that order(${order.orderId}) of user(${order.userId}) make it 'success'?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.doMakeItSuccess();
      },
      reject: (type) => {},
    });
  }

  onClose() {
    this.dialogRef.close({ result: false });
  }

  async doMakeItSuccess() {
    const { order } = this;
    const token = await this.authService.getToken().toPromise();

    this.loading = true;
    try {
      const data = await this.http
        .post(
          environment.apiUrl + environment.makeDepositSuccess,
          {
            orderId: order.orderId,
            amount: `${this.amount}`,
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

      this.dialogRef.close({ result: true });
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
}
