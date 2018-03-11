import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoryDateSelectorComponent } from './memory-date-selector.component';

describe('MemoryDateSelectorComponent', () => {
  let component: MemoryDateSelectorComponent;
  let fixture: ComponentFixture<MemoryDateSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoryDateSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoryDateSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
