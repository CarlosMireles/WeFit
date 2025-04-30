import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEventAlertComponent } from './create-event-alert.component';

describe('CreateEventAlertComponent', () => {
  let component: CreateEventAlertComponent;
  let fixture: ComponentFixture<CreateEventAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEventAlertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEventAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
