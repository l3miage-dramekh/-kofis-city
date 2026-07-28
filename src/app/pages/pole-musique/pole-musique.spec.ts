import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoleMusique } from './pole-musique';

describe('PoleMusique', () => {
  let component: PoleMusique;
  let fixture: ComponentFixture<PoleMusique>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoleMusique],
    }).compileComponents();

    fixture = TestBed.createComponent(PoleMusique);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
