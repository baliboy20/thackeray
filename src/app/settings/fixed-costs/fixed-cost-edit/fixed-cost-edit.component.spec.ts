import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedCostEditComponent } from './fixed-cost-edit.component';

describe('FixedCostEditComponent', () => {
  let component: FixedCostEditComponent;
  let fixture: ComponentFixture<FixedCostEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedCostEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedCostEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
