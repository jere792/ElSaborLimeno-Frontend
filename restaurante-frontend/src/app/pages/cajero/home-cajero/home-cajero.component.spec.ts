import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCajeroComponent } from './home.component';

describe('HomeCajeroComponent', () => {
  let component: HomeCajeroComponent;
  let fixture: ComponentFixture<HomeCajeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeCajeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeCajeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
