import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {VisitorService} from '../../generators/visitor/visitor.service';
import {MatOption, MatSelect} from '@angular/material';

@Component({
    selector: 'app-scenario-selector',
    templateUrl: './scenario-selector.component.html',
    styleUrls: ['./scenario-selector.component.scss']
})
export class ScenarioSelectorComponent implements OnInit {

    @Input() applyFuncName = '';
    @Input() retrieveFuncName = '';
    @Input() public labelName: string = 'name';
    @Input() public settingTypeLabel: string = 'some name';
    @ViewChild(MatSelect) select: MatSelect;
    selected = -1;

    ngOnInit(): void {

        this.scenes = this.service[this.retrieveFuncName].call(this);
        console.log("SCENES", this.scenes);
        this.fromStorage();
    }

    scenes: { name: string, description: string }[];

    constructor(private service: VisitorService) {

    }

    selectionChanged($event) {
        const idx = $event.value;
        console.log('SELECCTION CHANGED EVENT',idx);
        this.service[this.applyFuncName].call(this, this.scenes[idx]);
        this.toStorage(this.scenes[idx]);

    }

    fromStorage() {
        if(this.retrieveFuncName === 'undefined') {
            console.log('retrieve func name is undefined');
            return;
        }
        const res = window.localStorage.getItem(this.retrieveFuncName);
        if (res === 'undefined') {
            return;
        } else {
            console.log('ZZZZww RETRIEVED FROM: ',  res);
            const obj = JSON.parse(res);
            const ff: number = this.scenes.findIndex(a => a[this.labelName] === obj[this.labelName] ) ;
            console.log("ZZZZpp parsed sesseion cookes is", ff)
            this.selected = ff;
        }
    }

    toStorage(value) {
        const itm = JSON.stringify(value);
        window.localStorage.setItem(this.retrieveFuncName, itm);
    }


}
