import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

import {VisitorService} from '../../generators/visitor/visitor.service';
import {MatDatepicker, MatDatepickerInput, MatDatepickerInputEvent} from '@angular/material';

@Component({
    selector: 'app-memory-date-selector',
    templateUrl: './memory-date-selector.component.html',
    styleUrls: ['./memory-date-selector.component.scss']
})
export class MemoryDateSelectorComponent implements OnInit {

    @Input() date1 ; // =new Date("03/12/2018");
    @Input() localStorageName: string = 'name_for_';
    @Output() dateChangedEvent: EventEmitter<any> = new EventEmitter();
@ViewChild('picker') datepicker: MatDatepickerInput<any>;
    constructor() {
    }

    ngOnInit() {
        this.fromStorage();
    }

    onDateChanged(event) {
        this.dateChangedEvent.emit(event.target.value);
        this.toStorage(event);
    }

    fromStorage() {
        const res = window.localStorage.getItem(this.localStorageName);
        if (res === 'undefined') {
            return;
        } else {
            const obj = res;
            this.date1 = new Date(obj);
            this.dateChangedEvent.emit(this.date1);
        }
    }

    toStorage(value) {
       // const itm = JSON.stringify(value);
       // console.log('TO STORAGE', value.value);
        window.localStorage.setItem(this.localStorageName, value.value);
    }


}
