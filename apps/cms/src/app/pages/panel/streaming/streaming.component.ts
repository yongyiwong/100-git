import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { SmartTableDatePickerComponent } from '../../../@theme/components/smart-table-date-picker.component';

import { NbAuthService, NbAuthToken } from '@nebular/auth';

@Component({
  selector: 'cms-streaming',
  templateUrl: './streaming.component.html',
  styleUrls: ['./streaming.component.scss'],
  entryComponents: [SmartTableDatePickerComponent],
})
export class StreamingComponent implements OnInit {
  settings = undefined;

  data = undefined;
  page = 1;
  spinner = true;

  constructor(private http: HttpClient, private authService: NbAuthService) {
    this.setColumns();
  }

  async ngOnInit() {
    this.spinner = false;
    await this.getAllStreams();
  }

  setColumns() {
    return (this.settings = {
      mode: 'inline',
      selectMode: 'single',
      actions: {
        add: false,
        delete: false,
        edit: true,
        columnTitle: 'Edit',
      },
      edit: {
        editButtonContent: '<i class="nb-edit" title="edit"></i>',
        saveButtonContent: '<i class="nb-checkmark" title="edit"></i>',
        cancelButtonContent: '<i class="nb-close" title="edit"></i>',
        confirmSave: true,
      },
      editor: {
        type: 'text',
      },
      columns: {
        correct: {
          title: 'Correct?',
          width: '4%',
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
          filter: {
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
        isKilled: {
          title: 'Inactive?',
          width: '4%',
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
          filter: {
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
        sportType: {
          title: 'Sport Type',
          type: 'String',
          editable: false,
          width: '6%',
        },
        bcTeamName1: {
          title: 'BC Team 1 Name',
          type: 'String',
          editable: false,
        },
        kSportTeamName1: {
          title: 'kSport Team 1 Name',
          type: 'String',
          editable: false,
        },
        bcTeamName2: {
          title: 'BC Team 2 Name',
          type: 'String',
          editable: false,
        },
        kSportTeamName2: {
          title: 'kSport Team 2 Name',
          type: 'String',
          editable: false,
        },
        bcEventTime: {
          title: 'BC Game Time',
          type: 'html',
          editor: { type: 'custom', component: SmartTableDatePickerComponent },
          editable: false,
        },
        kSportEventTime: {
          title: 'kSport Event Time',
          type: 'Date',
          valuePrepareFunction: (date) => {
            if (date) {
              return new DatePipe('en-GB').transform(date, 'dd/MM/yyyy hh:mm');
            }
            return null;
          },
          editable: false,
        },
        isManual: {
          title: 'Manual',
          type: 'String',
          editable: false,
          width: '4%',
        },
        bcEventId: {
          title: 'Bc GameId',
          type: 'String',
          editable: false,
        },
        kSportEventId: {
          title: 'kSport EventId',
          type: 'String',
          editable: false,
        },
        kSportStreamId: {
          title: 'kSport Stream ID',
          type: 'String',
          editable: false,
        },
      },
      pager: {
        display: true,
        perPage: 20,
      },
    });
  }

  async getAllStreams() {
    const token = await this.authService.getToken().toPromise();
    return this.http
      .get(
        environment.apiUrl +
          environment.getStream +
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
        this.data = response.items;
      });
  }

  async onConfirmEdit(editData) {
    this.spinner = true;
    const token = await this.authService.getToken().toPromise();

    await this.http
      .post(
        environment.apiUrl + environment.updateStream,
        {
          candidateEvents: [
            {
              bcEventId: editData.newData.bcEventId,
              kSportEventId: editData.newData.kSportEventId,
              correct: JSON.parse(editData.newData.correct),
              isKilled: JSON.parse(editData.newData.isKilled),
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
      .subscribe(async (data) => {
        await this.getAllStreams();
        this.spinner = false;
      });
  }
}
