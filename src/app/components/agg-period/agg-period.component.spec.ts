import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AggPeriodComponent } from './agg-period.component';

describe('AggPeriodComponent', () => {
  let component: AggPeriodComponent;
  let fixture: ComponentFixture<AggPeriodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AggPeriodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
