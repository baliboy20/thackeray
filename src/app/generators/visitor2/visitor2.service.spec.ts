import { TestBed, inject } from '@angular/core/testing';

import { Visitor2Service } from './visitor2.service';

describe('Visitor2Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Visitor2Service]
    });
  });

  it('should be created', inject([Visitor2Service], (service: Visitor2Service) => {
    expect(service).toBeTruthy();
  }));
});
