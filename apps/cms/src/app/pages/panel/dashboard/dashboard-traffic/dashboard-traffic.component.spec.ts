import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTrafficComponent } from './dashboard-traffic.component';

describe('DashboardTrafficComponent', () => {
  let component: DashboardTrafficComponent;
  let fixture: ComponentFixture<DashboardTrafficComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardTrafficComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTrafficComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
