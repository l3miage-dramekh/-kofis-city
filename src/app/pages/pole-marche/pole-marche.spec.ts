import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoleMarche } from './pole-marche';

describe('PoleMarche', () => {
  let component: PoleMarche;
  let fixture: ComponentFixture<PoleMarche>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoleMarche],
    }).compileComponents();

    fixture = TestBed.createComponent(PoleMarche);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
