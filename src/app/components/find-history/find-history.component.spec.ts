import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindHistoryComponent } from './find-history.component';

describe('FindHistoryComponent', () => {
  let component: FindHistoryComponent;
  let fixture: ComponentFixture<FindHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
