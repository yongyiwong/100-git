import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ActivationEnd, Router} from "@angular/router";
import {filter, map} from "rxjs/operators";
import {OHB_LEADS_TABLE_SETTINGS, OHB_LEADS_TABLE_DATA} from './leads';
import {OHB_PLAYERS_TABLE_SETTINGS, OHB_PLAYERS_TABLE_DATA} from './players';
import { Ng2SmartTableComponent } from 'ng2-smart-table';

@Component({
  selector: 'workspace-players-or-leads',
  templateUrl: './players-or-leads.component.html',
  styleUrls: ['./players-or-leads.component.scss']
})
export class PlayersOrLeadsComponent implements OnInit, AfterViewInit{
  tableType: any;
  tableSettings: any;
  tableData: any;
  @ViewChild('table')
  smartTable: Ng2SmartTableComponent;
  constructor(private actRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.tableType = this.actRoute.snapshot.paramMap.get('playersOrLeads');

    this.router.events.pipe(
      filter((event) => event instanceof ActivationEnd), map((event: any) => event.snapshot.params))
      .subscribe((event) => {
        if (event.playersOrLeads && event.playersOrLeads !== '') {
          this.tableType = event.playersOrLeads;
          this. initializeTableSettings();
        }
      });
    this.initializeTableSettings();
  }

  ngAfterViewInit(): void {
    this.smartTable.edit.subscribe(data => {
      console.log('edit', data);
      this.router.navigate([`panel/users/${this.tableType}/${data.data.playerId}`])
    })
  }

  initializeTableSettings() {

    const _settings = this.tableType === 'leads' ? OHB_LEADS_TABLE_SETTINGS : OHB_PLAYERS_TABLE_SETTINGS
    const _data = this.tableType === 'leads' ? OHB_LEADS_TABLE_DATA : OHB_PLAYERS_TABLE_DATA
    this.tableSettings = {
      mode: 'external',
      selectMode: 'multi',
      actions: {
        add: false,
        delete: false,
        columnTitle: 'Edit'
      },
      edit: {
        editButtonContent: '<i class="nb-edit" title="edit"></i>'
      },
      columns: _settings
    }
    this.tableData = _data;
    console.log(this.tableSettings)
  }

  test(e){
    console.log(e);
  }

}
