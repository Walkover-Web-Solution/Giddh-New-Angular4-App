import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/fromEvent';

enum Key {
  Backspace = 8,
  Tab = 9,
  Enter = 13,
  Shift = 16,
  Escape = 27,
  ArrowLeft = 37,
  ArrowRight = 39,
  ArrowUp = 38,
  ArrowDown = 40
}

/*
 using an external template:
 <input [typeaheadTpl]="itemTpl" >

  <ng-template #itemTpl let-result>
    <strong>MY {{ result.result }}</strong>
  </ng-template>
*/
@Component({
  selector: '[ngxTypeahead]',
  styles: [`
    .typeahead-backdrop {
      bottom: 0;
      left: 0;
      position: fixed;
      right: 0;
      top: 0;
    }
  `],
  template: `
    <ng-template #suggestionsTplRef>
      <section class="list-group results" *ngIf="showSuggestions">
        <div class="typeahead-backdrop" (click)="hideSuggestions()"></div>
        <button type="button" class="list-group-item"
                *ngFor="let result of results; let i = index;"
                [class.active]="markIsActive(i, result)"
                (click)="handleSelectSuggestion(result)">
          <span *ngIf="!taItemTpl"><i class="fa fa-search"></i> {{ result }}</span>
          <ng-template
            [ngTemplateOutlet]="taItemTpl"
            [ngOutletContext]="{ $implicit: {result: result, index: i} }"
          ></ng-template>
        </button>
      </section>
    </ng-template>
  `
})
export class NgxTypeAheadComponent implements OnInit, OnDestroy {
  @Input() public taItemTpl: TemplateRef<any>;
  @Input() public taUrl: string = '';
  @Input() public sourceData: any[] = [];
  @Input() public taParams = {};
  @Input() public taQueryParam = 'q';
  @Input() public taCallbackParamValue = 'JSONP_CALLBACK';

  @Output() public taSelected = new EventEmitter<string>();

  public showSuggestions = false;
  public results: string[];

  @ViewChild('suggestionsTplRef') public suggestionsTplRef;

  private suggestionIndex = 0;
  private subscriptions: Subscription[];
  private activeResult: string;

  constructor(private element: ElementRef,
              private viewContainer: ViewContainerRef,
              private cdr: ChangeDetectorRef) {
  }

  @HostListener('keydown', ['$event'])
  public handleEsc(event: KeyboardEvent) {
    if (event.keyCode === Key.Escape) {
      this.hideSuggestions();
      event.preventDefault();
    }
  }

  public ngOnInit() {
    const onkeyDown$ = this.onElementKeyDown();
    this.listenAndSuggest();
    this.subscriptions = [
      this.filterEnterEvent(onkeyDown$),
      this.navigateWithArrows(onkeyDown$)
    ];
    this.renderTemplate();
  }

  public ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.length = 0;
  }

  public renderTemplate() {
    this.viewContainer.createEmbeddedView(this.suggestionsTplRef);
    this.cdr.markForCheck();
  }

  public onElementKeyDown() {
    return Observable.fromEvent(this.element.nativeElement, 'keydown').share();
  }

  public filterEnterEvent(elementObs: Observable<{}>) {
    return elementObs
      .filter((e: KeyboardEvent) => e.keyCode === Key.Enter)
      .subscribe((event: Event) => {
        event.preventDefault();
        this.handleSelectSuggestion(this.activeResult);
      });
  }

  public listenAndSuggest() {
    let searchEvent = Observable.fromEvent(this.element.nativeElement, 'keyup')
      .filter(this.validateKeyCode)
      .map((e: any) => e.target.value)
      .filter((query: string) => query.length > 0)
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((q: string) => {
        this.results = this.suggest(q);
        this.showSuggestions = true;
        this.suggestionIndex = 0;
        this.cdr.markForCheck();
      });
    return searchEvent;
  }

  public navigateWithArrows(elementObs: Observable<{}>) {
    return elementObs
      .filter((e: any) => e.keyCode === Key.ArrowDown || e.keyCode === Key.ArrowUp)
      .map((e: any) => e.keyCode)
      .subscribe((keyCode: number) => {
        const step = keyCode === Key.ArrowDown ? 1 : -1;
        const topLimit = 9;
        const bottomLimit = 0;
        this.suggestionIndex += step;
        if (this.suggestionIndex === topLimit + 1) {
          this.suggestionIndex = bottomLimit;
        }
        if (this.suggestionIndex === bottomLimit - 1) {
          this.suggestionIndex = topLimit;
        }
        this.showSuggestions = true;
        this.cdr.markForCheck();
      });
  }

  public suggest(query: string) {
    return this.sourceData.filter(s => {
      return s.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
    });
    // const url = this.taUrl;
    // const searchConfig: URLSearchParams = new URLSearchParams();
    // const searchParams = Object.assign({}, {
    //   callback: this.taCallbackParamValue,
    //   [this.taQueryParam]: query
    // }, this.taParams);
    // const params = Object.keys(searchParams);
    // if (params.length) {
    //   params.forEach((param: string) => searchConfig.set(param, searchParams[param]));
    // }
    // const options: RequestOptionsArgs = {
    //   search: searchConfig
    // };
    // return this.jsonp.get(url, options)
    //   .map((response) => response.json()[1])
    //   .map((results) => results.map((result: string) => result[0]));
  }

  public markIsActive(index: number, result: string) {
    const isActive = index === this.suggestionIndex;
    if (isActive) {
      this.activeResult = result;
    }
    return isActive;
  }

  public handleSelectSuggestion(suggestion: string) {
    this.hideSuggestions();
    this.taSelected.emit(suggestion);
  }

  public validateKeyCode(event: KeyboardEvent) {
    return event.keyCode !== Key.Tab
      && event.keyCode !== Key.Shift
      && event.keyCode !== Key.ArrowLeft
      && event.keyCode !== Key.ArrowUp
      && event.keyCode !== Key.ArrowRight
      && event.keyCode !== Key.ArrowDown;
  }

  public hideSuggestions() {
    this.showSuggestions = false;
  }

  public hasItemTemplate() {
    return this.taItemTpl !== undefined;
  }
}
