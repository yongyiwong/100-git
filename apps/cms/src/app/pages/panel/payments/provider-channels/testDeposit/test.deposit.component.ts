import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
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
import * as moment from 'moment-timezone';
import { ProviderChannelsComponent } from '../provider.channels.component';

interface PaymentProvider {
  id: string;
  providerName: string;
  needsDepositPhoneNumber: boolean;
  needsDepositBankCode: boolean;
}

interface PaymentProviderChannel {
  id: string;
  providerChannelName: string;
  providerMinAmount: number;
  providerMaxAmount: number;
  channel: {
    channelName: string;
    fromPaymentSystem: {
      isBank: boolean;
    };
  };
  paymentProvider: PaymentProvider;
  testedAt: Date;
}

interface PaymentProviderBank {
  id: string;
  paymentProviderBankCode: number;
  paymentProviderBankName: number;
  bankId: number;
  bank: {
    id: number;
    bankName: string;
    bankCode: string;
  };
}

@Component({
  selector: 'cms-test-deposit',
  templateUrl: './test.deposit.component.html',
  styleUrls: ['./test.deposit.component.scss'],
})
export class TestDepositComponent implements OnInit, OnDestroy {
  // userId: string;
  // userIdHelperMsg = '';
  // userIdHelperMsgClass = 'p-error';
  static sharedUserId = '';
  static sharedUserName = '';
  static sharedPhoneNumber = '';
  static sharedPaymentProviderBank: PaymentProviderBank = null;

  paymentProviderChannel: PaymentProviderChannel;
  providerChannelComponent: ProviderChannelsComponent;
  //   paymentProviderChannels = [];
  //   paymentProviderChannelHelperMsg = '';
  //   paymentProviderChannelHelperMsgClass = 'p-error';

  //  paymentProvider: PaymentProvider;
  //   paymentProviders = [];
  //   paymentProviderHelperMsg = '';
  //   paymentProviderHelperMsgClass = 'p-error';

  paymentProviderBank: PaymentProviderBank;
  paymentProviderBanks = [];
  paymentProviderBankHelperMsg = '';
  paymentProviderBankHelperMsgClass = 'p-error';

  loading = false;
  //   loadingPaymentProviders = false;
  //   loadingPaymentProviderChannels = false;
  loadingPaymentProviderBanks = false;

  amount = null;
  amountHelperMsg = '';
  amountHelperMsgClass = '';
  minAmount = 0;
  maxAmount = null;

  userName: string;
  userNameHelperMsg = '';
  userNameHelperMsgClass = 'p-error';

  phoneNumber: string;
  phoneNumberHelperMsg = '';
  phoneNumberHelperMsgClass = 'p-error';

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private http: HttpClient,
    private authService: NbAuthService,
    public dialogRef: MatDialogRef<TestDepositComponent>,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.paymentProviderChannel = this.data.paymentProviderChannel;
    this.providerChannelComponent = this.data.providerChannelComponent;
    //this.userId = TestDepositComponent.sharedUserId || null;
    this.userName = TestDepositComponent.sharedUserName || null;
    this.phoneNumber = TestDepositComponent.sharedPhoneNumber || null;

    this.updateMinMaxAmount();
    this.updateAmountHelperMsg();
    this.amount = this.minAmount || 0;
  }

  async ngOnInit(): Promise<void> {
    await this.loadPaymentProviderBanks();
    this.paymentProviderBank = TestDepositComponent.sharedPaymentProviderBank;
  }

  ngOnDestroy(): void {
    //TestDepositComponent.sharedUserId = this.userId;
    TestDepositComponent.sharedUserName = this.userName;
    TestDepositComponent.sharedPhoneNumber = this.phoneNumber;
    TestDepositComponent.sharedPaymentProviderBank = this.paymentProviderBank;
  }

  onClose() {
    this.dialogRef.close({ result: false });
  }

  async loadPaymentProviderBanks() {
    const token = await this.authService.getToken().toPromise();

    this.loadingPaymentProviderBanks = true;

    try {
      this.paymentProviderBanks = <PaymentProvider[]>await this.http
        .get(environment.apiUrl + environment.getPaymentProviderBanks, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }),
          params: {
            paymentProviderId: this.paymentProviderChannel.paymentProvider.id,
          },
        })
        .toPromise();
    } catch (error) {}

    this.loadingPaymentProviderBanks = false;
  }

  onSelectPaymentProviderBank(event) {
    this.onChangePaymentProviderBank();
  }

  onChangePaymentProviderBank() {
    this.validatePaymentProviderBank();
  }

  onInputUserId(event) {
    //this.userId = event.value;
    //this.validateUserId();
  }

  onInputAmount(event) {
    this.amount = event.value;
    this.validateAmount();
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

    const {
      //userId,
      /* paymentProvider, */ paymentProviderChannel,
      amount,
    } = this;

    if (paymentProviderChannel.testedAt) {
      const diffMins = moment().diff(
        moment(paymentProviderChannel.testedAt),
        'minutes'
      );

      if (diffMins < 30) {
        this.confirmationService.confirm({
          message: `There is a previous test of this channel in past 30 mins. Anyway will you try ?`,
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.preTestDeposit();
          },
        });
        return;
      }
    }

    this.preTestDeposit();
  }

  preTestDeposit() {
    const { paymentProviderChannel, amount } = this;

    setTimeout(() => {
      this.confirmationService.confirm({
        message:
          `Are you sure that ` +
          //`${userId} [userId]` +
          `,  ${paymentProviderChannel.paymentProvider.providerName}` +
          `,  ${paymentProviderChannel.channel.channelName}` +
          `,  ${amount} [amount]?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.doTestDeposit();
        },
        reject: (type) => {},
      });
    }, 250);
  }

  validate(): boolean {
    let isValid = true;

    // if (!this.validateUserId() && isValid) {
    //   isValid = false;
    // }

    if (!this.validateAmount() && isValid) {
      isValid = false;
    }

    if (!this.validatePhoneNumber() && isValid) {
      isValid = false;
    }

    if (!this.validatePaymentProviderBank() && isValid) {
      isValid = false;
    }

    if (!isValid) {
      return false;
    }

    return true;
  }

  // validateUserId() {
  //   if (!this.userId) {
  //     this.userIdHelperMsg = 'UserId should not be empty';
  //     this.userIdHelperMsgClass = 'p-error';
  //     return false;
  //   }

  //   this.userIdHelperMsg = '';
  //   this.userIdHelperMsgClass = '';

  //   return true;
  // }

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

  validatePhoneNumber() {
    const needsDepositPhoneNumber = this.paymentProviderChannel.paymentProvider
      .needsDepositPhoneNumber;

    if (needsDepositPhoneNumber && !this.phoneNumber) {
      this.phoneNumberHelperMsg = 'PhoneNumber should not be empty';
      this.phoneNumberHelperMsgClass = 'p-error';

      return false;
    }

    this.phoneNumberHelperMsg = '';
    this.phoneNumberHelperMsgClass = '';

    return true;
  }

  validatePaymentProviderBank() {
    const needsDepositBankCode = this.paymentProviderChannel.paymentProvider
      .needsDepositBankCode;

    if (
      needsDepositBankCode &&
      this.paymentProviderChannel.channel.fromPaymentSystem.isBank &&
      !this.paymentProviderBank
    ) {
      this.paymentProviderBankHelperMsg = 'Bank should be selected';
      this.paymentProviderBankHelperMsgClass = 'p-error';
      return false;
    }

    this.paymentProviderBankHelperMsg = '';
    this.paymentProviderBankHelperMsgClass = '';

    return true;
  }

  async doTestDeposit() {
    const token = await this.authService.getToken().toPromise();
    this.loading = true;

    try {
      const data = <
        {
          result: boolean;
          url: string;
          error: {};
          errorCode: string;
          errorMessage: string;
          requestJson: string;
          responseJson: string;
          requestTime: string;
        }
      >await this.http
        .post(
          environment.apiUrl + environment.testDeposit,
          {
            //userId: numeral(this.userId).value(),
            paymentProviderChannelId: numeral(
              this.paymentProviderChannel.id
            ).value(),
            amount: `${this.amount}`,
            userName: this.userName || '',
            phoneNumber: this.phoneNumber || '',
            bankId: this.paymentProviderBank
              ? this.paymentProviderBank.bankId
              : null,
          },
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            }),
          }
        )
        .toPromise();

      this.providerChannelComponent.getProviderChannels();

      if (!data.result) {
        setTimeout(() => {
          this.confirmationService.confirm({
            message: `errorCode: ${data.errorCode || -1}, errorMessage: ${
              data.errorMessage || 'unknown'
            }<br>`,
            /* `errorCode: ${data.errorCode || -1}, errorMessage: ${
                data.errorMessage || 'unknown'
              }<br>` +
              `requestJson: ${data.requestJson || ''}<br>` +
              `responseJson: ${data.responseJson || ''}` */ header:
              'Failed',
            icon: 'pi pi-exclamation-triangle',
            rejectVisible: false,
            accept: () => {
              this.dialogRef.close({
                result: false,
                data: {
                  /* userId: this.userId */
                  paymentProviderChannel: this.paymentProviderChannel,
                },
              });
            },
          });
        }, 150);

        this.loading = false;

        return;
      }

      const url = data.url;

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Manual Deposit is succeeded',
      });

      window.open(url, '_blank');

      this.dialogRef.close({
        result: true,
        data: {
          /* userId: this.userId */
        },
      });
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
