import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NbAuthService } from '@nebular/auth';
import { environment } from '../../../../../../environments/environment';
import * as numeral from 'numeral';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';

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
  selector: 'cms-manual-deposit-order',
  templateUrl: './manual.deposit.order.component.html',
  styleUrls: ['./manual.deposit.order.component.scss'],
})
export class ManualDepositOrderComponent implements OnInit {
  userId: null;
  userIdHelperMsg = '';
  userIdHelperMsgClass = 'p-error';

  paymentProviderChannel: PaymentProviderChannel;
  paymentProviderChannels = [];
  paymentProviderChannelHelperMsg = '';
  paymentProviderChannelHelperMsgClass = 'p-error';

  paymentProvider: PaymentProvider;
  paymentProviders = [];
  paymentProviderHelperMsg = '';
  paymentProviderHelperMsgClass = 'p-error';

  loading = false;
  loadingPaymentProviders = false;
  loadingPaymentProviderChannels = false;

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
    public dialogRef: MatDialogRef<ManualDepositOrderComponent>,
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

  onClose() {
    this.dialogRef.close({ result: false });
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

  onSelectPaymentProvider(event) {
    this.onChangePaymentProvider();
  }

  onChangePaymentProvider() {
    this.paymentProviderChannel = null;
    this.onChangePaymentProviderChannel();

    this.loadPaymentProviderChannels();

    this.validatePaymentProvider();
  }

  onSelectPaymentProviderChannel(event) {
    this.onChangePaymentProviderChannel();
  }

  onChangePaymentProviderChannel() {
    this.updateAmountHelperMsg();
    this.updateMinMaxAmount();
    this.validatePaymentProviderChannel();
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

  onSubmit(event) {
    if (!this.validate()) {
      return;
    }

    const { userId, paymentProvider, paymentProviderChannel, amount } = this;

    this.confirmationService.confirm({
      message:
        `Are you sure that ` +
        `${userId} :userId` +
        `,  ${paymentProvider.providerName}` +
        `,  ${paymentProviderChannel.channel.channelName}` +
        `,  ${amount} :amount?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.doManualDeposit();
      },
      reject: (type) => {},
    });
  }

  validate(): boolean {
    let isValid = true;

    if (!this.validateUserId() && isValid) {
      isValid = false;
    }

    if (!this.validatePaymentProvider() && isValid) {
      isValid = false;
    }

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

  validateUserId() {
    if (!this.userId) {
      this.userIdHelperMsg = 'UserId should not be empty';
      this.userIdHelperMsgClass = 'p-error';
      return false;
    }

    this.userIdHelperMsg = '';
    this.userIdHelperMsgClass = '';

    return true;
  }

  validatePaymentProvider() {
    if (!this.paymentProvider) {
      this.paymentProviderHelperMsg = 'PaymentProvider should be selected';
      this.paymentProviderHelperMsgClass = 'p-error';
      return false;
    }

    this.paymentProviderHelperMsg = '';
    this.paymentProviderHelperMsgClass = '';
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
      console.log('amount is not valid');
      return false;
    }

    this.amountHelperMsg = '';
    this.amountHelperMsgClass = '';
    return true;
  }

  onInputUserId(event) {
    this.userId = event.value;
    this.validateUserId();
  }

  onInputAmount(event) {
    this.amount = event.value;
    this.validateAmount();
  }

  async doManualDeposit() {
    const token = await this.authService.getToken().toPromise();
    this.loading = true;

    try {
      const data = <
        {
          result: boolean;
          error: {};
          errorCode: string;
          errorMessage: string;
          requestJson: string;
          responseJson: string;
          requestTime: string;
        }
      >await this.http
        .post(
          environment.apiUrl + environment.manualDeposit,
          {
            userId: numeral(this.userId).value(),
            paymentProviderId: numeral(this.paymentProvider.id).value(),
            paymentProviderChannelId: numeral(
              this.paymentProviderChannel.id
            ).value(),
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

      if (!data.result) {
        this.confirmationService.confirm({
          message:
            `errorCode: ${data.errorCode}, errorMessage: ${data.errorMessage}<br>` +
            `requestJson: ${data.requestJson}<br>` +
            `responseJson: ${data.responseJson}`,
          header: 'Failed',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {},
        });
        this.loading = false;
        return;
      }

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Manual Deposit is succeeded',
      });

      this.dialogRef.close({ result: true, data: { userId: this.userId } });
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
