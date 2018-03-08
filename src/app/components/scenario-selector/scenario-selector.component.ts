import {Component, Input, OnInit} from '@angular/core';
import {VisitorService} from '../../generators/visitor/visitor.service';

@Component({
    selector: 'app-scenario-selector',
    templateUrl: './scenario-selector.component.html',
    styleUrls: ['./scenario-selector.component.scss']
})
export class ScenarioSelectorComponent implements OnInit {

    @Input() applyFuncName = '';
    @Input() retrieveFuncName = '';
    @Input() public labelName: string = 'name';

    ngOnInit(): void {

        this.scenes  = this.service[this.retrieveFuncName].call(this);
         console.log("JJJJJJJ",this.service[this.retrieveFuncName].apply(this));
        // this.scenes = func.call(this);
    }

    scenes: { name: string, description: string }[];

    constructor(private service: VisitorService) {

    }

    selectionChanged($event) {
        console.log('selectionChanged', $event.value);
        this.service[this.applyFuncName].call(this, $event.value);
    }


}
