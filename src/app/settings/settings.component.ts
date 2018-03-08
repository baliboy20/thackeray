import {Component, ElementRef, Inject, OnInit, QueryList, Renderer2, TemplateRef, ViewChild, ViewChildren} from '@angular/core';
import {FixedCosts, FixedCostsImpl, VisitorService} from '../generators/visitor/visitor.service';
import {MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS, MatDialog, MatDialogRef} from '@angular/material';
import {SettingEditComponent} from './setting-edit/setting-edit.component';
import {ScrollStrategy} from '@angular/cdk/overlay';
import {ConfirmDeleteDialogComponent} from '../components/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
    selector: 'app-Fixed-costs',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],

})
export class SettingsComponent implements OnInit {


    @ViewChildren('over') set childs(values: QueryList<any>) {

        const cb = ((e) => {
            const targ: HTMLHtmlElement = e.target as HTMLHtmlElement;
            this.rnd.addClass(targ, 'over');
        });
        const cb1 = ((e) => {
            const targ: HTMLHtmlElement = e.target as HTMLHtmlElement;
            this.rnd.removeClass(targ, 'over');
        });
        values.forEach((a: ElementRef) => {
            // console.log('ele', a)
            a.nativeElement.addEventListener('mouseover', cb);
            a.nativeElement.addEventListener('mouseout', cb1);
        });
    }

    constructor(private service: VisitorService, private rnd: Renderer2,
                public pop: MatDialog) {
    }

    assumptions: any[];
    newAssumptions: FixedCostsImpl[];
    private showRowToolbar = false;

    addSettings() {
        const fc = new FixedCostsImpl();
        fc.configName = '==> [New Record] <===';
        fc.description = '';
        return fc;
    }

    ngOnInit() {
        this.assumptions = this.service.retrieveAssumptions();
    }

    openDialog(value?: any) {

        const data = value ? {mode: 'EDIT_REC', cfg: value} :
            {mode: 'NEW_REC', cfg: this.addSettings()};
        const dialogRef = this.pop.open(SettingEditComponent, {
            data: data,
            height: '850px',
            disableClose: true,
            hasBackdrop: true
        });
        dialogRef.afterClosed()
            .subscribe((a) => {
                console.log('edit statie', a);
                if (a === undefined) {
                    return;
                } else if (a.mode === 'NEW_REC') {
                    this.assumptions.push(a.data);
                }
                this.service.persistAssumptions(this.assumptions);
            });
    }

    onConfigClicked(event) {
        this.openDialog(event);

    }

    showCached() {
        const fc: FixedCosts = this.service.getCurrentAssumptions();
        this.openDialog(fc);
    }

    removeItem(value: FixedCosts) {
        const cfg = {height: '200px', width: '400px', data: {name: value.configName}};
        const ref = this.pop.open(ConfirmDeleteDialogComponent, cfg);
        ref.afterClosed()
            .subscribe(a => {
                if (a === undefined) {
                    return;
                } else {
                    const idx = this.assumptions.indexOf(value);
                    this.assumptions.splice(idx, 1);
                }
            });
        this.service.persistAssumptions(this.assumptions);
    }

    refreshClicked() {
        this.assumptions = this.service.retrieveAssumptions();
    }


}
