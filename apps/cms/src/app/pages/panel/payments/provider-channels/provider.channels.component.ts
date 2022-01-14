import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { NbAuthService, NbAuthToken } from '@nebular/auth';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { TestDepositComponent } from './testDeposit/test.deposit.component';
import * as moment from 'moment-timezone';
import { Table } from 'primeng/table';

@Component({
  selector: 'cms-provider-channels',
  templateUrl: './provider.channels.component.html',
  styleUrls: ['./provider.channels.component.scss'],
})
export class ProviderChannelsComponent implements OnInit {
  first = 0;
  page = 1;
  loading = false;

  cols: any[] = [
    {
      field: 'paymentProvider',
      header: 'Provider',
    },
    {
      field: 'channel',
      header: 'Channel',
    },
    {
      field: 'providerMinAmount',
      header: 'Min Amount',
    },
    {
      field: 'providerMaxAmount',
      header: 'Max Amount',
    },
    {
      field: 'isActive',
      header: 'isActive?',
    },
    {
      field: 'isAvailable',
      header: 'isAvailable?',
    },
    {
      field: 'testedAt',
      header: 'testedAt',
    },
  ];

  providerChannels = [];
  dirtyMaps: [];

  constructor(
    private http: HttpClient,
    private authService: NbAuthService,
    private dialog: MatDialog
  ) {
    this.dirtyMaps = [];
  }

  async ngOnInit(): Promise<void> {
    await this.getProviderChannels();
  }

  async getProviderChannels() {
    this.loading = true;
    const token = await this.authService.getToken().toPromise();
    const providerChannels = <[]>await this.http
      .get(
        environment.apiUrl +
          environment.getPaymentProviderChannels +
          //'?depositOrWithdrawable=1&pageSize=10000&page=' +
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
    this.providerChannels = providerChannels || [];

    setTimeout(() => {
      this.first = Math.max(
        Math.min(first, this.providerChannels.length - 1),
        0
      );
    }, 50);
  }

  formatDate(strDate) {
    if (!strDate) {
      return '';
    }
    return moment(strDate).format('MM/DD/YYYY HH:mm:ss');
  }

  onRefresh() {
    this.getProviderChannels();
  }

  clear(table: Table) {
    table.clear();
  }

  onChangeActive(providerChannel) {
    this.onDirty(providerChannel);
  }

  onEditComplete(event) {
    this.onDirty(event.data);
  }

  onDirty(providerChannel) {
    const { dirtyMaps } = this;

    if (!dirtyMaps) {
      return;
    }

    if (dirtyMaps[providerChannel['id']] !== undefined) {
      return;
    }

    (dirtyMaps as any)[providerChannel['id']] = providerChannel;
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
        providerMinAmount: item['providerMinAmount'],
        providerMaxAmount: item['providerMaxAmount'],
      };

      updatedItems.push(updatedItem);
    });

    const token = await this.authService.getToken().toPromise();

    this.loading = true;

    const data = <{ result: boolean }>await this.http
      .post(
        environment.apiUrl + environment.updatePaymentProviderChannels,
        {
          paymentProviderChannels: updatedItems,
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
      this.loading = false;
      return;
    }
    this.getProviderChannels();
  }

  testDeposit = async (providerChannel) => {
    const dialogRef = this.dialog.open(TestDepositComponent, {
      hasBackdrop: true,
      disableClose: true,
      autoFocus: false,
      data: {
        paymentProviderChannel: providerChannel,
        providerChannelComponent: this,
      },
    });

    const response = await dialogRef.afterClosed().toPromise();

    if (!response || !response.result) {
      return;
    }

    const data = response.data;
  };
}
