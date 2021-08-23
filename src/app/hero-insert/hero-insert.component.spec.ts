import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroInsertComponent } from './hero-insert.component';

describe('HeroInsertComponent', () => {
  let component: HeroInsertComponent;
  let fixture: ComponentFixture<HeroInsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeroInsertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
