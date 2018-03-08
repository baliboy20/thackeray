import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VistorMonthlyComponent } from './vistor-monthly.component';

describe('VistorCfgComponent', () => {
  let component: VistorMonthlyComponent;
  let fixture: ComponentFixture<VistorMonthlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VistorMonthlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VistorMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
