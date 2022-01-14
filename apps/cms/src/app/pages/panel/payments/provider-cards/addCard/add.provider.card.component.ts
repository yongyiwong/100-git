import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NbAuthService } from '@nebular/auth';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';
import { environment } from '../../../../../../environments/environment';
import * as numeral from 'numeral';

interface PaymentProvider {
  id: string;
  providerName: string;
}

interface Bank {
  id: string;
  bankCode: number;
  bankName: number;
}

interface PaymentProviderCard {
  id: number;
  paymentProvider: PaymentProvider;
  bank: Bank;
  bankAccountName: string;
  bankAccountNumber: string;
  branch: string;
  province: string;
  city: string;
  maxDailyAmount: number;
  minAmount: number;
  maxAmount: number;
  active: boolean;
}

@Component({
  selector: 'cms-add-provider-card',
  templateUrl: './add.provider.card.component.html',
  styleUrls: ['./add.provider.card.component.scss'],
})
export class AddProviderCardComponent implements OnInit, OnDestroy {
  static sharedPaymentProvider: PaymentProvider = null;
  static sharedBank: Bank = null;

  loading = false;
  paymentProviderCard: PaymentProviderCard = null;

  loadingPaymentProviders = false;
  paymentProvider: PaymentProvider;
  paymentProviders = [];
  paymentProviderHelperMsg = '';
  paymentProviderHelperMsgClass = 'p-error';

  loadingBanks = false;
  bank: Bank;
  banks = [];
  bankHelperMsg = '';
  bankHelperMsgClass = 'p-error';

  bankAccountName = null;
  bankAccountNameHelperMsg = '';
  bankAccountNameHelperMsgClass = 'p-error';

  bankAccountNumber = null;
  bankAccountNumberHelperMsg = '';
  bankAccountNumberHelperMsgClass = 'p-error';

  province = null;
  provinceHelperMsg = '';
  provinceHelperMsgClass = 'p-error';

  city = null;
  cityHelperMsg = '';
  cityHelperMsgClass = 'p-error';

  branch = null;
  branchHelperMsg = '';
  branchHelperMsgClass = 'p-error';

  maxDailyAmount = null;
  maxDailyAmountHelperMsg = '';
  maxDailyAmountHelperMsgClass = 'p-error';

  minAmount = null;
  minAmountHelperMsg = '';
  minAmountHelperMsgClass = 'p-error';

  maxAmount = null;
  maxAmountHelperMsg = '';
  maxAmountHelperMsgClass = 'p-error';

  active = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private http: HttpClient,
    private authService: NbAuthService,
    public dialogRef: MatDialogRef<AddProviderCardComponent>,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    const { providerCard } = this.data;

    if (providerCard) {
      this.paymentProviderCard = providerCard;
    }
  }

  async ngOnInit(): Promise<void> {
    const { paymentProviderCard } = this;
    this.paymentProviderCard = paymentProviderCard || null;

    if (this.paymentProviderCard) {
      const {
        bankAccountName,
        bankAccountNumber,
        branch,
        province,
        city,
        maxDailyAmount,
        active,
        minAmount,
        maxAmount,
      } = this.paymentProviderCard;

      this.bankAccountName = bankAccountName;
      this.bankAccountNumber = bankAccountNumber;
      this.branch = branch;
      this.province = province;
      this.city = city;
      this.maxDailyAmount = maxDailyAmount;
      this.minAmount = minAmount;
      this.maxAmount = maxAmount;
      this.active = active;
    }

    await this.loadPaymentProviders();
    this.paymentProvider = this.paymentProviderCard
      ? this.paymentProviderCard.paymentProvider
      : AddProviderCardComponent.sharedPaymentProvider;

    await this.loadBanks();
    this.bank = this.paymentProviderCard
      ? this.paymentProviderCard.bank
      : AddProviderCardComponent.sharedBank;
  }

  ngOnDestroy(): void {
    AddProviderCardComponent.sharedPaymentProvider = this.paymentProvider;
    AddProviderCardComponent.sharedBank = this.bank;
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
            isOnlyCardSupport: 'true',
          },
        })
        .toPromise();
    } catch (error) {}

    this.loadingPaymentProviders = false;
  }

  async loadBanks() {
    const token = await this.authService.getToken().toPromise();

    this.loadingBanks = true;

    try {
      this.banks = <Bank[]>await this.http
        .get(environment.apiUrl + environment.getBanks, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }),
          params: {},
        })
        .toPromise();
    } catch (error) {}

    this.loadingBanks = false;
  }

  onSelectPaymentProvider(event) {
    this.onChangePaymentProvider();
  }

  onChangePaymentProvider() {
    this.validatePaymentProvider();
  }

  onSelectBank(event) {
    this.onChangeBank();
  }

  onChangeBank() {
    this.validateBank();
  }

  onInputBankAccountName(event) {
    //this.bankAccountName = event.value;
    this.validateBankAccountName();
  }

  onInputBankAccountNumber(event) {
    //this.bankAccountNumber = event.value;
    this.validateBankAccountNumber();
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

  onInputMinAmount(event) {
    this.minAmount = event.value;
    this.validateMinAmount();
  }

  onInputMaxAmount(event) {
    this.maxAmount = event.value;
    this.validateMaxAmount();
  }

  validate(): boolean {
    let isValid = true;

    if (!this.validatePaymentProvider() && isValid) {
      isValid = false;
    }

    if (!this.validateBank() && isValid) {
      isValid = false;
    }

    if (!this.validateBankAccountName() && isValid) {
      isValid = false;
    }

    if (!this.validateBankAccountNumber() && isValid) {
      isValid = false;
    }

    if (!this.validateProvince() && isValid) {
      isValid = false;
    }

    if (!this.validateCity() && isValid) {
      isValid = false;
    }

    if (!this.validateMinAmount() && isValid) {
      isValid = false;
    }

    if (!this.validateMaxAmount() && isValid) {
      isValid = false;
    }

    if (!isValid) {
      return false;
    }

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

  validateBank() {
    if (!this.bank) {
      this.bankHelperMsg = 'Bank should be selected';
      this.bankHelperMsgClass = 'p-error';
      return false;
    }

    this.bankHelperMsg = '';
    this.bankHelperMsgClass = '';

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

  validateMinAmount() {
    if (!this.minAmount) {
      this.minAmountHelperMsg = 'MinAmount should not be empty';
      this.minAmountHelperMsgClass = 'p-error';
      return false;
    }

    this.minAmountHelperMsg = '';
    this.minAmountHelperMsgClass = '';

    return true;
  }

  validateMaxAmount() {
    if (!this.maxAmount) {
      this.maxAmountHelperMsg = 'Max Amount should not be empty';
      this.maxAmountHelperMsgClass = 'p-error';
      return false;
    }

    this.maxAmountHelperMsg = '';
    this.maxAmountHelperMsgClass = '';

    return true;
  }

  validateBranch() {
    return true;
  }

  async onSubmit(event) {
    if (!this.validate()) {
      return;
    }

    const { id: paymentProviderId } = this.paymentProvider;
    const { id: bankId } = this.bank;
    const id = this.paymentProviderCard ? this.paymentProviderCard.id : null;
    const {
      bankAccountName,
      bankAccountNumber,
      branch,
      province,
      city,
      maxDailyAmount,
      active,
      minAmount,
      maxAmount,
    } = this;

    const token = await this.authService.getToken().toPromise();
    this.loading = true;

    try {
      const data = <
        {
          result: boolean;
          error: {};
          errorCode: string;
          errorMessage: string;
        }
      >await this.http
        .post(
          environment.apiUrl + environment.createPaymentProviderCard,
          {
            paymentProviderCards: [
              {
                id,
                paymentProviderId: numeral(paymentProviderId).value(),
                bankId: numeral(bankId).value(),
                bankAccountName,
                bankAccountNumber,
                branch,
                province,
                city,
                maxDailyAmount: numeral(maxDailyAmount).value(),
                minAmount: numeral(minAmount).value(),
                maxAmount: numeral(maxAmount).value(),
                active,
              },
            ],
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
          message: `errorCode: ${data.errorCode}, errorMessage: ${data.errorMessage}`,
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

      this.dialogRef.close({
        result: true,
        data: { paymentProvider: this.paymentProvider },
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
