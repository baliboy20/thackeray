import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.scss']
})
export class ToDoComponent implements OnInit {

  items = [
      {title: 'Group by', note: 'Ddd line detail aggs to group by algo.'},
      {title: 'Fixed Cost Settings', note: 'Should be able to set them dynamically'},
      {title: 'Add graphs', note: 'graphs showing cashflow'},
      {title: 'Bug in Daily', note: 'graphs showing cashflow'},
      ];
  constructor() { }

  ngOnInit() {
  }

}
