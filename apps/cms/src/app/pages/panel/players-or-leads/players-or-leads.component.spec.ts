import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersOrLeadsComponent } from './players-or-leads.component';

describe('PlayersOrLeadsComponent', () => {
  let component: PlayersOrLeadsComponent;
  let fixture: ComponentFixture<PlayersOrLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayersOrLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersOrLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
