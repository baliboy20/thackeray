import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {VisitorService} from '../generators/visitor/visitor.service';

@Component({
  selector: 'app-whatif',
  templateUrl: './whatif.component.html',
  styleUrls: ['./whatif.component.scss']
})
export class WhatifComponent implements OnInit {

  @ViewChild('sidenav') snav: MatSidenav;
  private sidenavOpen = false;
  constructor(private  service: VisitorService) { }

  ngOnInit() {
    this.service.getForecast(null, null, null, null);

  }

  toggle() {
    console.log('clicked', this.snav);

    this.snav.mode = 'side';
      this.snav.toggle();
  }
}
