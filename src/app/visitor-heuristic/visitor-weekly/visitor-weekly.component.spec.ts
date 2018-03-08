import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorWeeklyComponent } from './visitor-weekly.component';

describe('VisitorWeeklyComponent', () => {
  let component: VisitorWeeklyComponent;
  let fixture: ComponentFixture<VisitorWeeklyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitorWeeklyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorWeeklyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
