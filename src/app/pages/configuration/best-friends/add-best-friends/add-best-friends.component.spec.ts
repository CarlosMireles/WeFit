import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBestFriendsComponent } from './add-best-friends.component';

describe('AddBestFriendsComponent', () => {
  let component: AddBestFriendsComponent;
  let fixture: ComponentFixture<AddBestFriendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBestFriendsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBestFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
