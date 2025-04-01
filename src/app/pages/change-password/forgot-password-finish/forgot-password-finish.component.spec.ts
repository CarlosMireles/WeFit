import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordFinishComponent } from './forgot-password-finish.component';

describe('ForgotPasswordFinishComponent', () => {
  let component: ForgotPasswordFinishComponent;
  let fixture: ComponentFixture<ForgotPasswordFinishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordFinishComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
