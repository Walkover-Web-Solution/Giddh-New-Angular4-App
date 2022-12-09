import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-cdk-scroll',
  templateUrl: './cdk-scroll.component.html',
  styleUrls: ['./cdk-scroll.component.css']
})
export class CdkScrollComponent implements OnInit, OnDestroy {

  /** This will use for instance of cdk scrollable */
  @ViewChild(CdkScrollable) public scrollableWrapper: CdkScrollable | undefined;
  /** This will use for emit new page query */
  @Output() public fetchNextPage: EventEmitter<string> = new EventEmitter();
  /** This will hold for destory observable */
  private destroy$: Subject<any> = new Subject();

  constructor(private scroll: ScrollDispatcher) { }

  public ngOnInit(): void {
    this.scroll
      .scrolled()
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((res) => {
        if (
          res &&
          (res.getElementRef().nativeElement.id === 'scrollableWrapper'
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
