import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavegadorMobileComponent } from './navegador-mobile.component';

describe('NavegadorMobileComponent', () => {
  let component: NavegadorMobileComponent;
  let fixture: ComponentFixture<NavegadorMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavegadorMobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavegadorMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
