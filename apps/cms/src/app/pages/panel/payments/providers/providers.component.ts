import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { NbAuthService, NbAuthToken } from '@nebular/auth';

@Component({
  selector: 'cms-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss'],
})
export class ProvidersComponent implements OnInit {
  settings = {
    actions: {
      add: false,
      delete: false,
      edit: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit" title="edit"></i>',
      saveButtonContent: '<i class="nb-checkmark" title="edit"></i>',
      cancelButtonContent: '<i class="nb-close" title="edit"></i>',
      confirmSave: true,
      columnTitle: 'Edit',
    },
    editor: {
      type: 'text',
    },
    columns: {
      id: {
        title: 'ProviderID',
        type: 'number',
        editable: false,
      },
      providerName: {
        title: 'ProviderName',
        type: 'string',
        editable: false,
      },
      isDepositSupport: {
        title: 'DepositSupport?',
        type: 'boolean',
        editable: true,
        editor: {
          type: 'list',
          config: {
            selectText: 'Select...',
            list: [
              { value: 'true', title: 'true' },
              { value: 'false', title: 'false' },
            ],
          },
        },
      },
      isWithdrawalSupport: {
        title: 'WithdrawalSupport?',
        type: 'boolean',
        editable: true,
        editor: {
          type: 'list',
          config: {
            selectText: 'Select...',
            list: [
              { value: 'true', title: 'true' },
              { value: 'false', title: 'false' },
            ],
          },
        },
      },
    },
  };
  spinner = true;
  page = 1;
  providersData = [];

  constructor(private http: HttpClient, private authService: NbAuthService) {}

  async ngOnInit(): Promise<void> {
    await this.getProviders();
    this.spinner = false;
  }

  async getProviders() {
    const token = await this.authService.getToken().toPromise();
    return this.http
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
      .subscribe((response: any) => {
        this.providersData = response;
      });
  }

  async onConfirmEdit(event) {
    this.spinner = true;

    const token = await this.authService.getToken().toPromise();
    await this.http
      .post(
        environment.apiUrl + environment.updatePaymentProviders,
        {
          paymentProviders: [
            {
              id: event.newData.id,
              isDepositSupport: JSON.parse(event.newData.isDepositSupport),
              isWithdrawalSupport: JSON.parse(
                event.newData.isWithdrawalSupport
              ),
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
      .subscribe((data: { result: boolean }) => {
        this.spinner = false;
        if (!data.result) {
          event.confirm.resolve();
          return;
        }
        this.getProviders();
      });
  }
}
