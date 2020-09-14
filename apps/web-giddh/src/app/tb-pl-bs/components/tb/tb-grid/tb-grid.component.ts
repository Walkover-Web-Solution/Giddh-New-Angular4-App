import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AccountDetails } from '../../../../models/api-models/tb-pl-bs';
import { Account, ChildGroup } from '../../../../models/api-models/Search';
import * as _ from '../../../../lodash-optimized';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'tb-grid',
    templateUrl: './tb-grid.component.html',
    styleUrls: [`./tb-grid.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TbGridComponent implements OnInit, AfterViewInit, OnChanges {

    public noData: boolean;
    public accountSearchControl: FormControl = new FormControl();
    @ViewChild('searchInputEl') public searchInputEl: ElementRef;
    public showClearSearch: boolean = false;
    @Input() public search: string = '';
    @Input() public from: string = '';
    @Input() public to: string = '';
    @Input() public searchInput: string = '';
    @Input() public padLeft: number = 30;
    @Input() public showLoader: boolean;
    @Input() public data$: AccountDetails;
    @Input() public expandAll: boolean;
    @Output() public searchChange = new EventEmitter<string>();

    constructor(private cd: ChangeDetectorRef, private zone: NgZone) {
        //
    }

    public ngOnInit() {
        this.accountSearchControl.valueChanges.pipe(
            debounceTime(700))
            .subscribe((newValue) => {
                this.searchInput = newValue;
                this.searchChange.emit(this.searchInput);

                if (newValue === '') {
                    this.showClearSearch = false;
                }
                this.cd.detectChanges();
            });
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.expandAll && !changes.expandAll.firstChange && changes.expandAll.currentValue !== changes.expandAll.previousValue) {
            //
            if (this.data$) {
                // this.cd.detach();
                this.zone.runOutsideAngular(() => {
                    this.toggleGroupVisibility(this.data$.groupDetails, changes.expandAll.currentValue);
                    if (this.data$) {
                        // always make first level visible ....
                        _.each(this.data$.groupDetails, (grp: ChildGroup) => {
                            if (grp.isIncludedInSearch) {
                                grp.isVisible = true;
                                _.each(grp.accounts, (acc: Account) => {
                                    if (acc.isIncludedInSearch) {
                                        acc.isVisible = false;
                                    }
                                });
                            }
                        });
                    }
                });

                // this.data$ = _.cloneDeep(this.data$);
            }
        }
    }

    public ngAfterViewInit() {
        //
    }

    public markForCheck() {
        this.cd.markForCheck();
    }

    public detectChanges() {
        this.cd.detectChanges();
    }

    public trackByFn(index, item: ChildGroup) {
        return item;
    }

    public toggleSearch() {
        this.showClearSearch = true;

        setTimeout(() => {
            this.searchInputEl.nativeElement.focus();
        }, 200);
    }

    public clickedOutside(event, el) {
        if (this.accountSearchControl.value !== null && this.accountSearchControl.value !== '') {
            return;
        }

        if (this.childOf(event.target, el)) {
            return;
        } else {
            this.showClearSearch = false;
        }
    }

    /* tslint:disable */
    public childOf(c, p) {
        while ((c = c.parentNode) && c !== p) {
        }
        return !!c;
    }

    /**
     * Toggles group visibility
     *
     * @param {Array<ChildGroup>} group Groups received
     * @param {boolean} isVisible Current visibility status
     * @memberof TbGridComponent
     */
    public toggleGroupVisibility(group: Array<ChildGroup>, isVisible: boolean): void {
        const stack = [...group];
        while (stack.length) {
            const currentGroup = stack.pop();
            if (currentGroup.isIncludedInSearch) {
                currentGroup.isCreated = true;
                currentGroup.isVisible = isVisible;
                for (let accountIndex = 0; accountIndex < currentGroup.accounts.length; accountIndex++) {
                    const account = currentGroup.accounts[accountIndex];
                    if (account.isIncludedInSearch) {
                        account.isCreated = true;
                        account.isVisible = isVisible;
                    }
                }
                if (currentGroup.childGroups && currentGroup.childGroups.length > 0) {
                    stack.push(...currentGroup.childGroups);
                }
            }
        }
    }
}
