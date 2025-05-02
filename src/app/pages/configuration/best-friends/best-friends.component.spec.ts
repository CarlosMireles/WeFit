import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestFriendsComponent } from './best-friends.component';

describe('BestFriendsComponent', () => {
  let component: BestFriendsComponent;
  let fixture: ComponentFixture<BestFriendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BestFriendsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BestFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
