import {Component, Input, OnInit, Output} from '@angular/core';
import {EventEmitter} from 'selenium-webdriver';
import {VisitorService} from '../../generators/visitor/visitor.service';

@Component({
  selector: 'app-memory-date-selector',
  templateUrl: './memory-date-selector.component.html',
  styleUrls: ['./memory-date-selector.component.scss']
})
export class MemoryDateSelectorComponent implements OnInit {

  @Input() date: string;
  @Input() localStorageName: string ='name_for_';
  @Output() dateChangedEvent: EventEmitter = new EventEmitter();

  constructor( ) { }

  ngOnInit() {
  }

    onDateChanged(event) {
    this.dateChangedEvent.emit(event);
    this.toStorage(event)
    }

    fromStorage() {

        const res = window.localStorage.getItem(this.localStorageName);
        if (res === 'undefined') {
            return;
        } else {
            const obj = JSON.parse(res);
             this.date = obj;
        }
    }

    toStorage(value) {
        const itm = JSON.stringify(value);
        window.localStorage.setItem(this.localStorageName, itm);
    }


}
