import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VistorCfgComponent } from './vistor-cfg.component';

describe('VistorCfgComponent', () => {
  let component: VistorCfgComponent;
  let fixture: ComponentFixture<VistorCfgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VistorCfgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VistorCfgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
