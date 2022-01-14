import { Component, OnInit } from '@angular/core';
import {from, Observable} from "rxjs";
import {filter, map, toArray} from "rxjs/operators";

@Component({
  selector: 'cms-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  constructor() {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const observable: Observable<number> = from(numbers);
    const sub = observable.pipe(map(n => n * 3),
      filter(n => n % 2 === 0),
      toArray()).subscribe(e => {
      console.log(e);
    })
  }

  ngOnInit(): void {
  }

}
