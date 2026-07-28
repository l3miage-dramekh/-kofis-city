import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoleEducation } from './pole-education';

describe('PoleEducation', () => {
  let component: PoleEducation;
  let fixture: ComponentFixture<PoleEducation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoleEducation],
    }).compileComponents();

    fixture = TestBed.createComponent(PoleEducation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
