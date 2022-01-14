import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { environment } from '../../../../environments/environment';
import { NbAuthService, NbAuthToken } from '@nebular/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'cms-provider-banks',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent implements OnInit {
  @ViewChild('dt') table: Table;

  options: any[];
  dirtyMaps: [];

  first = 0;
  page = 1;
  loading = false;

  cols: any[] = [
    {
      field: 'optName',
      header: 'Name',
    },
    {
      field: 'optValue',
      header: 'Value',
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
    this.getOptionsGeneral();
  }

  onRefresh() {
    this.getOptionsGeneral();
  }

  onChangeActive(option) {
    this.onDirty(option);
  }

  onEditComplete(event) {
    this.onDirty(event.data);
  }

  onDirty(option) {
    const { dirtyMaps } = this;

    if (!dirtyMaps) {
      return;
    }

    if (dirtyMaps[option['optName']] !== undefined) {
      return;
    }

    (dirtyMaps as any)[option['optName']] = option;
  }

  async getOptionsGeneral() {
    this.loading = true;
    const token = await this.authService.getToken().toPromise();
    const options = <[]>await this.http
      .get(
        environment.apiUrl +
          environment.getOptionsGeneral +
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
    this.options = [];

    if (options) {
      Object.keys(options).forEach((key) =>
        this.options.push({
          optName: key,
          optValue: options[key],
          type: typeof options[key],
        })
      );
    }

    setTimeout(() => {
      this.first = Math.max(Math.min(first, this.options.length - 1), 0);
    }, 50);

    return options;
  }

  async onClickSave() {
    if (!this.dirtyMaps || !Object.keys(this.dirtyMaps).length) {
      return;
    }

    const updatedItems = [];

    for (const optName in this.dirtyMaps) {
      if (!this.dirtyMaps.hasOwnProperty(optName)) {
        continue;
      }
      const updatedItem = {
        optName,
        optValue: this.dirtyMaps[optName]['optValue'],
      };
      updatedItems.push(updatedItem);
    }

    const token = await this.authService.getToken().toPromise();

    this.loading = true;

    const data = <{ result: boolean }>await this.http
      .post(
        environment.apiUrl + environment.updateOptionsGeneral,
        {
          options: updatedItems,
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
    this.getOptionsGeneral();
  }
}
