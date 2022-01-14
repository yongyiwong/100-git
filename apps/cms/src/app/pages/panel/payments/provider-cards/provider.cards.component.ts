import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NbAuthService, NbAuthToken } from '@nebular/auth';
import { AddProviderCardComponent } from './addCard/add.provider.card.component';
import {
  ConfirmationService,
  FilterMatchMode,
  FilterService,
  MessageService,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'cms-provider-cards',
  templateUrl: './provider.cards.component.html',
  styleUrls: ['./provider.cards.component.scss'],
})
export class ProviderCardsComponent implements OnInit {
  math = Math;
  
  first = 0;
  page = 1;
  loading = false;
  providerCards = [];
  selectedCards = [];
  paymentProviders = [];
  dirtyMaps: [];

  cols = [
    {
      field: 'paymentProviderId',
      header: 'Provider',
    },
    {
      field: 'bank',
      header: 'Bank',
    },
    {
      field: 'bankAccountName',
      header: 'BankAccountName',
    },
    {
      field: 'bankAccountNumber',
      header: 'BankAccountNumber',
    },
    {
      field: 'branch',
      header: 'Branch',
    },
    {
      field: 'province',
      header: 'Province',
    },
    {
      field: 'city',
      header: 'City',
    },
    {
      field: 'minAmount',
      header: 'min',
    },
    {
      field: 'maxAmount',
      header: 'max',
    },
    {
      field: 'maxDailyAmount',
      header: 'maxDaily',
    },
    {
      field: 'usedDay',
      header: 'usedToDay',
    },
    {
      field: 'remained',
      header: 'remained',
    },
    {
      field: 'active',
      header: 'Active?',
    },
  ];

  @ViewChild('dt') table: Table;

  constructor(
    private http: HttpClient,
    private authService: NbAuthService,
    private dialog: MatDialog,
    private filterService: FilterService,
    private confirmationService: ConfirmationService
  ) {
    this.dirtyMaps = [];
  }

  ngOnInit(): void {
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

    this.getProviderCards();
    this.getProviders();
  }

  async addProviderCard(providerCard?) {
    const dialogRef = this.dialog.open(AddProviderCardComponent, {
      hasBackdrop: true,
      disableClose: true,
      autoFocus: false,
      data: { providerCard },
    });

    const response = await dialogRef.afterClosed().toPromise();

    if (!response || !response.result) {
      return;
    }

    const data = response.data;

    const paymentProvider = this.paymentProviders.find(
      (item) => item.id === data.paymentProvider.id
    );

    this.table.filters['paymentProvider'] = [
      {
        matchMode: 'isPaymentProvider',
        operator: 'and',
        value: [paymentProvider],
      },
    ];

    this.table._filter();

    this.getProviderCards();
  }

  onDeleteProviderCard(providerCard) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${providerCard.bankAccountName}, ${providerCard.bankAccountNumber} ?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteProviderCards([providerCard]);
      },
    });
  }

  onDeleteSelectedCards() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected cards?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteProviderCards(this.selectedCards);
      },
    });
  }

  async deleteProviderCards(providerCards) {
    this.loading = true;

    const cards = [];
    providerCards.forEach((providerCard) =>
      cards.push({ id: providerCard.id })
    );

    const token = await this.authService.getToken().toPromise();
    const data = <
      {
        result: boolean;
        error: {};
        errorCode: string;
        errorMessage: string;
      }
    >await this.http
      .post(
        environment.apiUrl + environment.deletePaymentProviderCard,
        {
          cards,
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
          message: `${data.errorMessage || 'unknown'}`,
          header: 'Failed',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {},
          rejectVisible: false,
        });
      }, 150);

      this.loading = false;
      return;
    }

    this.getProviderCards();
  }

  async getProviderCards() {
    this.loading = true;
    const token = await this.authService.getToken().toPromise();
    const providerCards = <[]>await this.http
      .get(
        environment.apiUrl +
          environment.getPaymentProviderCards +
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

    this.dirtyMaps = [];
    this.providerCards = providerCards || [];
    this.selectedCards = [];

    setTimeout(() => {
      this.first = Math.max(Math.min(first, this.providerCards.length - 1), 0);
    }, 50);
  }

  async getProviders() {
    const token = await this.authService.getToken().toPromise();
    const paymentProviders = <[]>await this.http
      .get(
        environment.apiUrl +
          environment.getPaymentProviders +
          '?isOnlyCardSupport=1&pageSize=10000&page=' +
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

  onRefresh() {
    this.getProviderCards();
  }

  clear(table: Table) {
    table.clear();
  }
}
