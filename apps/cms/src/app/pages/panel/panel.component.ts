import { Component, OnInit } from '@angular/core';
import { NbAuthService } from '@nebular/auth';

@Component({
  selector: 'cms-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit {
  constructor(private authService: NbAuthService) {}

  ngOnInit(): void {}
}
