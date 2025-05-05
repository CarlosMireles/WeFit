import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTemplateImageNameComponent } from './user-template-image-name.component';

describe('UserTemplateImageNameComponent', () => {
  let component: UserTemplateImageNameComponent;
  let fixture: ComponentFixture<UserTemplateImageNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTemplateImageNameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTemplateImageNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
