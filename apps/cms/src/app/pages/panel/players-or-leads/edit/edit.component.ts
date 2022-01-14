import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'workspace-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  id: any;

  constructor(private actRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.id = this.actRoute.snapshot.paramMap.get('id');
  }

}
