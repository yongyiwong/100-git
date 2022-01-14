import {Component, OnInit} from '@angular/core';
import {TRAFFIC_LIST_DUMMY_MONTHLY, TRAFFIC_LIST_DUMMY_WEEKLY, TRAFFIC_LIST_DUMMY_YEARLY} from './traffic-list'

@Component({
  selector: 'cms-dashboard-traffic',
  templateUrl: './dashboard-traffic.component.html',
  styleUrls: ['./dashboard-traffic.component.scss']
})
export class DashboardTrafficComponent implements OnInit {

  periodType = [
    {
      period: 'week',
      dataSet: TRAFFIC_LIST_DUMMY_WEEKLY
    },
    {
      period: 'month',
      dataSet: TRAFFIC_LIST_DUMMY_MONTHLY
    },
    {
      period: 'year',
      dataSet: TRAFFIC_LIST_DUMMY_YEARLY
    }
  ];
  period = this.periodType[0];

  constructor() {
  }

  ngOnInit(): void {
  }

  changePeriodAndGetData(event) {
    console.log(event)
    this.period = event;
  }

  trackByDate(_, item) {
    return item.date;
  }
}
