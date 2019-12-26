import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
    selector: 'sample-template',
    templateUrl: './sample.template.component.html'
})

export class SampleTemplateComponent implements OnInit, OnDestroy {
    @Output() public closeAndDestroyComponent: EventEmitter<any> = new EventEmitter();

    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor() {
    }

    public ngOnInit() {
        //
    }

    public ngOnDestroy() {
        //
    }

    public doDestroy() {
        this.closeAndDestroyComponent.emit(true);
    }
}
