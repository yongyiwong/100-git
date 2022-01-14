import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitAnimationBarComponent } from './profit-animation-bar.component';

describe('ProfitAnimationBarComponent', () => {
  let component: ProfitAnimationBarComponent;
  let fixture: ComponentFixture<ProfitAnimationBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfitAnimationBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfitAnimationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
