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
  withdrawMinAmount: number;
  withdrawMaxAmount: number;
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
  selector: 'cms-manual-withdraw-order',
  templateUrl: './manual.withdraw.order.component.html',
  styleUrls: ['./manual.withdraw.order.component.scss'],
})
export class ManualWithdrawOrderComponent implements OnInit {
  userId: null;
  userIdHelperMsg = '';
  userIdHelperMsgClass = 'p-error';

  orderId: null;
  orderIdHelperMsg = '';
  orderIdHelperMsgClass = 'p-error';

  bankAccountName: null;
  bankAccountNameHelperMsg = '';
  bankAccountNameHelperMsgClass = 'p-error';

  bankAccountNumber: null;
  bankAccountNumberHelperMsg = '';
  bankAccountNumberHelperMsgClass = 'p-error';

  branch: null;
  branchHelperMsg = '';
  branchHelperMsgClass = 'p-error';

  province: null;
  provinceHelperMsg = '';
  provinceHelperMsgClass = 'p-error';

  city: null;
  cityHelperMsg = '';
  cityHelperMsgClass = 'p-error';

  paymentProvider: PaymentProvider;
  paymentProviders = [];
  paymentProviderHelperMsg = '';
  paymentProviderHelperMsgClass = 'p-error';

  paymentProviderBank: PaymentProviderBank;
  paymentProviderBanks = [];
  paymentProviderBankHelperMsg = '';
  paymentProviderBankHelperMsgClass = 'p-error';

  loading = false;
  loadingPaymentProviders = false;
  loadingPaymentProviderBanks = false;

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
    public dialogRef: MatDialogRef<ManualWithdrawOrderComponent>,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  async ngOnInit(): Promise<void> {
    const { order } = this.data || {};
    this.order = order || null;

    await this.loadPaymentProviders();

    if (this.order) {
      this.userId = this.order.userId;
      this.orderId = this.order.clientOrderId;
      this.amount = this.order.amount;

      this.paymentProvider = this.paymentProviders.find(
        (pp) => pp.id === this.order['paymentProvider']['id']
      );
      await this.loadPaymentProviderBanks();

      this.paymentProviderBank = this.order['paymentProviderBank'];
      this.onChangePaymentProviderBank();
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
            isWithdrawalSupport: 'true',
          },
        })
        .toPromise();
    } catch (error) {}

    this.loadingPaymentProviders = false;
  }

  async loadPaymentProviderBanks() {
    if (!this.paymentProvider) {
      return;
    }

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
            paymentProviderId: this.paymentProvider.id,
          },
        })
        .toPromise();
    } catch (error) {}

    this.loadingPaymentProviderBanks = false;
  }

  onSubmit(event) {
    if (!this.validate()) {
      return;
    }

    const {
      userId,
      orderId,
      paymentProvider,
      paymentProviderBank,
      amount,
      /* bankAccountName,
      bankAccountNumber,
      branch,
      province,
      city, */
    } = this;

    this.confirmationService.confirm({
      message:
        `Are you sure that ` +
        `${userId} [userId]` +
        `, ${orderId} [orderId]` +
        `,  ${paymentProvider.providerName}` +
        `,  ${paymentProviderBank.paymentProviderBankName}(${paymentProviderBank.paymentProviderBankCode})` +
        // `, "${bankAccountName}", ${bankAccountNumber} ${branch}` +
        // `, ${province} ${city}` +
        `,  ${amount} [amount]?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.doManualWithdraw();
      },
      reject: (type) => {},
    });
  }

  onInputUserId(event) {
    this.userId = event.value;
    this.validateUserId();
  }

  onInputOrderId(event) {
    this.orderId = event.value;
    this.validateOrderId();
  }

  onInputBankAccountName(event) {
    //this.bankAccountName = event.value;
    this.validateBankAccountName();
  }

  onInputBankAccountNumber(event) {
    //this.bankAccountNumber = event.value;
    this.validateBankAccountNumber();
  }

  onInputAmount(event) {
    this.amount = event.value;
    this.validateAmount();
  }

  onInputProvince(event) {
    //this.province = event.value;
    this.validateProvince();
  }

  onInputCity(event) {
    //this.city = event.value;
    this.validateCity();
  }

  onInputBranch(event) {
    //this.province = event.value;
    this.validateBranch();
  }

  onSelectPaymentProvider(event) {
    this.onChangePaymentProvider();
  }

  onChangePaymentProvider() {
    this.paymentProviderBank = null;
    this.onChangePaymentProviderBank();

    this.loadPaymentProviderBanks();

    this.validatePaymentProvider();
  }

  onSelectPaymentProviderBank(event) {
    this.onChangePaymentProviderBank();
  }

  onChangePaymentProviderBank() {
    this.updateAmountHelperMsg();
    this.updateMinMaxAmount();
    this.validatePaymentProviderBank();
  }

  updateMinMaxAmount() {
    if (!this.paymentProvider || !this.paymentProviderBank) {
      this.minAmount = 0;
      this.maxAmount = null;
      return;
    }

    const { withdrawMinAmount, withdrawMaxAmount } = this.paymentProvider;

    this.minAmount = withdrawMinAmount;
    this.maxAmount = withdrawMaxAmount;
  }

  updateAmountHelperMsg() {
    this.amountHelperMsg = this.getAmountHelperMsg();
  }

  getAmountHelperMsg() {
    let msgAmountHelper = ``;

    if (!this.paymentProvider || !this.paymentProviderBank) {
      return msgAmountHelper;
    }

    const { withdrawMinAmount, withdrawMaxAmount } = this.paymentProvider;

    msgAmountHelper = `minAmount: ${withdrawMinAmount}, maxAmount: ${withdrawMaxAmount}`;

    return msgAmountHelper;
  }

  validate(): boolean {
    let isValid = true;

    if (!this.validateUserId() && isValid) {
      isValid = false;
    }

    if (!this.validateOrderId() && isValid) {
      isValid = false;
    }

    if (!this.validatePaymentProvider() && isValid) {
      isValid = false;
    }

    if (!this.validatePaymentProviderBank() && isValid) {
      isValid = false;
    }

    if (!this.validateAmount() && isValid) {
      isValid = false;
    }

    // if (!this.validateBankAccountName() && isValid) {
    //   isValid = false;
    // }

    // if (!this.validateBankAccountNumber() && isValid) {
    //   isValid = false;
    // }

    // if (!this.validateProvince() && isValid) {
    //   isValid = false;
    // }

    // if (!this.validateCity() && isValid) {
    //   isValid = false;
    // }

    // if (!this.validateBranch() && isValid) {
    //   isValid = false;
    // }

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

  validateOrderId() {
    if (!this.orderId) {
      this.orderIdHelperMsg = 'OrderId should not be empty';
      this.orderIdHelperMsgClass = 'p-error';
      return false;
    }

    this.orderIdHelperMsg = '';
    this.orderIdHelperMsgClass = '';

    return true;
  }

  validateBankAccountName() {
    if (!this.bankAccountName) {
      this.bankAccountNameHelperMsg = 'Bank Account Name should not be empty';
      this.bankAccountNameHelperMsgClass = 'p-error';
      return false;
    }

    this.bankAccountNameHelperMsg = '';
    this.bankAccountNameHelperMsgClass = '';

    return true;
  }

  validateBankAccountNumber() {
    if (!this.bankAccountNumber) {
      this.bankAccountNumberHelperMsg = 'Bank Account Name should not be empty';
      this.bankAccountNumberHelperMsgClass = 'p-error';
      return false;
    }

    this.bankAccountNumberHelperMsg = '';
    this.bankAccountNumberHelperMsgClass = '';

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

  validatePaymentProviderBank() {
    if (!this.paymentProviderBank) {
      this.paymentProviderBankHelperMsg = 'Bank should be selected';
      this.paymentProviderBankHelperMsgClass = 'p-error';
      return false;
    }

    this.paymentProviderBankHelperMsg = '';
    this.paymentProviderBankHelperMsgClass = '';

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
      this.amountHelperMsg = this.getAmountHelperMsg() || 'Amount is not valid';
      this.amountHelperMsgClass = 'p-error';
      return false;
    }

    this.amountHelperMsg = '';
    this.amountHelperMsgClass = '';
    return true;
  }

  validateProvince() {
    if (!this.province) {
      this.provinceHelperMsg = 'Province should not be empty';
      this.provinceHelperMsgClass = 'p-error';
      return false;
    }

    this.provinceHelperMsg = '';
    this.provinceHelperMsgClass = '';

    return true;
  }

  validateCity() {
    if (!this.city) {
      this.cityHelperMsg = 'Province should not be empty';
      this.cityHelperMsgClass = 'p-error';
      return false;
    }

    this.cityHelperMsg = '';
    this.cityHelperMsgClass = '';

    return true;
  }

  validateBranch() {
    return true;
  }

  async doManualWithdraw() {
    const token = await this.authService.getToken().toPromise();
    this.loading = true;

    const { paymentProvider, paymentProviderBank } = this;
    const { bankId } = paymentProviderBank;
    const { id: paymentProviderId } = paymentProvider;
    const {
      userId,
      clientOrderId,
      amount,
      bankAccountName,
      bankAccountNumber,
      province,
      city,
      branch,
      currency,
    } = this.order;

    const userName = this.order.userName || null;
    const phoneNumber = this.order.phoneNumber || null;
    const countryCallingCode = this.order.countryCallingCode || null;

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
          environment.apiUrl + environment.manualWithdraw,
          {
            userId: numeral(userId).value(),
            orderId: `${clientOrderId}`,
            amount: `${amount}`,
            bankAccountName,
            bankAccountNumber,
            province,
            city,
            branch,
            currency,
            userName,
            countryCallingCode,
            phoneNumber,
            bankId,
            paymentProviderId,
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
        setTimeout(() => {
          this.confirmationService.confirm({
            message: `Manual withdraw is failed`,
            header: 'Failed',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {},
          });
        }, 250);
        this.loading = false;
        return;
      }

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Manual Withdraw is succeeded',
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
