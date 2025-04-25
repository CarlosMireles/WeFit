import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationQuestionComponent } from './confirmation-question.component';

describe('ConfirmationQuestionComponent', () => {
  let component: ConfirmationQuestionComponent;
  let fixture: ComponentFixture<ConfirmationQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
