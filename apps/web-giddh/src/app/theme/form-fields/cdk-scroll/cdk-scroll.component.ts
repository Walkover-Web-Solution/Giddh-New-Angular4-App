import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-cdk-scroll',
    templateUrl: './cdk-scroll.component.html',
    styleUrls: ['./cdk-scroll.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class CdkScrollComponent implements OnInit, OnDestroy {

    /** This will use for instance of cdk scrollable */
    @ViewChild(CdkScrollable) public scrollableWrapper: CdkScrollable | undefined;
    /** True if we need to scroll element by id */
    @Input() public scrollableElementId: '';
    /** This will use for emit new page query */
    @Output() public fetchNextPage: EventEmitter<string> = new EventEmitter();
    /** This will hold for destory observable */
    private destroy$: Subject<any> = new Subject();

    constructor(private scroll: ScrollDispatcher) { }

    /**
     * This hook will use for on initialization
     *
     * @memberof CdkScrollComponent
     */
    public ngOnInit(): void {
        this.scroll
            .scrolled()
            .pipe(debounceTime(500), takeUntil(this.destroy$))
            .subscribe((res) => {
                if (
                    res &&
                    (res.getElementRef().nativeElement.id === 'scrollableWrapper' ||
                        res.getElementRef().nativeElement.id === this.scrollableElementId
                    ) &&
                    res.measureScrollOffset('bottom') <= 30
                ) {
                    this.fetchNextPage.emit(res.getElementRef().nativeElement.id);
                }
            });
    }
    /**
     * This hook will use for on destroy component
     *
     * @memberof CdkScrollComponent
     */
    public ngOnDestroy(): void {
        if (this.destroy$) {
            this.destroy$.next(true);
            this.destroy$.complete();
        }
    }
}
