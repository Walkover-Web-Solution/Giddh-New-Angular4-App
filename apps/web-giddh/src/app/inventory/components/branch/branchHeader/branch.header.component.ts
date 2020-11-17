import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../store';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

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
    templateUrl: './branch.header.component.html'
})

export class BranchHeaderComponent implements OnInit, OnDestroy {
    public branchAsideMenuState: string = 'out';
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private _store: Store<AppState>) {
        this._store.pipe(select(s => s.inventory.showBranchScreenSidebar), takeUntil(this.destroyed$)).subscribe(bool => {
            this.toggleBranchAsidePane();
        });
    }

    public ngOnInit() {
        
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

    /**
     * This will destroy all the memory used by this component
     *
     * @memberof BranchHeaderComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
