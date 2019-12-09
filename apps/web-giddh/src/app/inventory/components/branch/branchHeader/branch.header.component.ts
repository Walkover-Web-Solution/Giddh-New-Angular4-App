import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'branch-header',
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
    ],
    template: `
    <div class="aside-overlay" *ngIf="branchAsideMenuState === 'in'"></div>
    <branch-destination *ngIf="branchAsideMenuState === 'in'" [class]="branchAsideMenuState"
                        [@slideInOut]="branchAsideMenuState"></branch-destination>
  `
})
export class BranchHeaderComponent implements OnInit, OnDestroy {
    public branchAsideMenuState: string = 'out';

    constructor(private _store: Store<AppState>) {
        this._store.select(s => s.inventory.showBranchScreenSidebar).subscribe(bool => {
            this.toggleBranchAsidePane();
        });
    }

    public ngOnInit() {
        //
    }

    public toggleBodyClass() {
        if (this.branchAsideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    public toggleBranchAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.branchAsideMenuState = this.branchAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    public ngOnDestroy() {
        //
    }
}
