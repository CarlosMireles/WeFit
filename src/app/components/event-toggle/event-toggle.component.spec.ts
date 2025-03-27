import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventToggleComponent } from './event-toggle.component';

describe('EventToggleComponent', () => {
  let component: EventToggleComponent;
  let fixture: ComponentFixture<EventToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventToggleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
