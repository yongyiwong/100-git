import { Component, AfterViewInit } from '@angular/core';

import { Cell, DefaultEditor, Editor } from 'ng2-smart-table';

@Component({
  templateUrl: './smart-table-date-picker.component.html',
})
export class SmartTableDatePickerComponent extends DefaultEditor implements AfterViewInit {

  constructor() {
    super();
  }

  ngAfterViewInit() {

  }
}
