import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardProfitComponent } from './dashboard-profit.component';

describe('DashboardProfitComponent', () => {
  let component: DashboardProfitComponent;
  let fixture: ComponentFixture<DashboardProfitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardProfitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardProfitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
