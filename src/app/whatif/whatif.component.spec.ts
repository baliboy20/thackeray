import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatifComponent } from './whatif.component';

describe('WhatifComponent', () => {
  let component: WhatifComponent;
  let fixture: ComponentFixture<WhatifComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatifComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
