import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveEventAlertComponent } from './leave-event-alert.component';

describe('LeaveEventAlertComponent', () => {
  let component: LeaveEventAlertComponent;
  let fixture: ComponentFixture<LeaveEventAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveEventAlertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveEventAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
