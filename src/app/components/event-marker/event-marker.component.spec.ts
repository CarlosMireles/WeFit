import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventMarkerComponent } from './event-marker.component';

describe('EventMarkerComponent', () => {
  let component: EventMarkerComponent;
  let fixture: ComponentFixture<EventMarkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventMarkerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
