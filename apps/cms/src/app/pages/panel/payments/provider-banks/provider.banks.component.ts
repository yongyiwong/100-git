import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { environment } from '../../../../../environments/environment';
import { NbAuthService, NbAuthToken } from '@nebular/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'cms-provider-banks',
  templateUrl: './provider.banks.component.html',
  styleUrls: ['./provider.banks.component.scss'],
})
export class ProviderBanksComponent implements OnInit {
  @ViewChild('dt') table: Table;

  providerBanks: [];
  dirtyMaps: [];

  first = 0;
  page = 1;
  loading = false;

  cols: any[] = [
    {
      field: 'paymentProvider',
      header: 'Provider',
    },
    {
      field: 'paymentProviderBankName',
      header: 'Bank Name',
    },
    {
      field: 'paymentProviderBankCode',
      header: 'Bank Code',
    },
    {
      field: 'isActive',
      header: 'isActive?',
    },
    {
      field: 'isAvailable',
      header: 'isAvailable?',
    },
  ];

  constructor(
    private http: HttpClient,
    private authService: NbAuthService,
    private messageService: MessageService
  ) {
    this.dirtyMaps = [];
  }

  ngOnInit(): void {
    this.getProviderBanks();
  }

  async getProviderBanks() {
    this.loading = true;
    const token = await this.authService.getToken().toPromise();
    const providerBanks = <[]>await this.http
      .get(
        environment.apiUrl +
          environment.getPaymentProviderBanks +
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
    this.providerBanks = providerBanks || [];

    setTimeout(() => {
      this.first = Math.max(Math.min(first, this.providerBanks.length - 1), 0);
    }, 50);

    //this.providerBanks.forEach((order) => {});

    return providerBanks;
  }

  onRefresh() {
    //this.first = 0;
    this.getProviderBanks();
  }

  onChangeActive(providerBank) {
    this.onDirty(providerBank);
  }

  onDirty(providerBank) {
    const { dirtyMaps } = this;

    if (!dirtyMaps) {
      return;
    }

    if (dirtyMaps[providerBank['id']] !== undefined) {
      return;
    }

    (dirtyMaps as any)[providerBank['id']] = providerBank;
  }

  async onClickSave() {
    if (!this.dirtyMaps || !this.dirtyMaps.length) {
      return;
    }

    const updatedItems = [];

    this.dirtyMaps.forEach((item) => {
      const updatedItem = {
        id: item['id'],
        isActive: item['isActive'],
      };

      updatedItems.push(updatedItem);
    });

    const token = await this.authService.getToken().toPromise();

    this.loading = true;

    await this.http
      .post(
        environment.apiUrl + environment.updatePaymentProviderBanks,
        {
          paymentProviderBanks: updatedItems,
        },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }),
        }
      )
      .subscribe({
        next: (data: { result: boolean }) => {
          if (!data.result) {
            this.loading = false;
            return;
          }
          this.getProviderBanks();
        },
        error: (err) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'error',
            detail: 'There is error in backend api',
          });
        },
        complete: () => {},
      });
  }
}
