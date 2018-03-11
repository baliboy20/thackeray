import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatSelect} from '@angular/material';
import {VisitorService} from '../generators/visitor/visitor.service';

@Component({
    selector: 'app-to-do',
    templateUrl: './to-do.component.html',
    styleUrls: ['./to-do.component.scss']
})
export class ToDoComponent implements OnInit {
    selected = 1;
    value: string = 'oxo';
    /**
     * @Input() applyFuncName = '';
     @Input() retrieveFuncName = '';
     @Input() public labelName: string = 'name';
     @Input() public settingTypeLabel: string = 'some name';
     @ViewChild(MatSelect) select: MatSelect;
     * @type {{key: string; label: string}[]}
     */
    persisted = {key: 's3', label: 'will3'};
    getPersisted() {
        return this.persisted;
    }
    values = [
        {key: 's1', label: 'will1'},
        {key: 's2', label: 'will2'},
        {key: 's3', label: 'will3'},
        {key: 's4', label: 'will31'},
        {key: 's5', label: 'will32'},
        {key: 's6', label: 'will33'}
    ];


    items: any[] = [
        {title: 'Group by', note: 'Ddd line detail aggs to group by algo.'},
        {title: 'Fixed Cost Settings', note: 'Should be able to set them dynamically'},
        {title: 'Add graphs', note: 'graphs showing cashflow'},
        {title: 'Bug in Daily', note: 'graphs showing cashflow'},
    ];

    constructor(private srv: VisitorService) {
        const a = this.values.indexOf(this.values[5]);
        console.log('INDEXOF TEST = ', a);
        console.log('zz', this.items.map(a => a.title));
    }


    ngOnInit() {
    }

    onClick() {
        this.selected = 3;

    }
}
