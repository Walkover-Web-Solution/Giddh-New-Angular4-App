import {Directive, ElementRef, Input, OnDestroy, OnInit, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import Tribute from 'tributejs';

@Directive({
  selector: '[appTributeMention]'
})
export class TributeMentionDirective implements OnInit, OnDestroy, OnChanges {

  /** Tribute.js configuration options.*/
  @Input('appTributeMention') tributeConfig: any = {};
  /** List of values to be shown in the mention dropdown.*/
  @Input('appTributeMentionValues') mentionList: any[] = [];
  /** Emits the selected item when a user picks a mention from the list.*/
  @Output() mentionSelected = new EventEmitter<any>();
  /** Holds the Tribute instance. */
  private tributeInstance!: Tribute<any>;

  constructor(private hostElement: ElementRef) { }

  /**
   * Lifecycle hook: called when the directive is initialized.
   * 
   * @returns {void}
   * @memberof TributeMentionDirective
   */
  public ngOnInit(): void {
    this.initializeTribute();
  }

  /**
   * Reinitializes Tribute when config or values change.
   * 
   * @returns {void}
   * @memberof TributeMentionDirective
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.mentionList &&
      changes.mentionList.currentValue !== changes.mentionList.previousValue
    ) {
      this.initializeTribute();
    }
    if (changes.tributeConfig) {
      this.initializeTribute();
    }
  }

  /**
   * Initializes the Tribute.js instance and attaches it to the host element.
   * 
   * @returns {void}
   * @memberof TributeMentionDirective
   */
  private initializeTribute(): void {
    const tributeOptions = {
      values: this.mentionList,
      requireLeadingSpace: true,
      positionMenu: true,
      ...this.tributeConfig,
      menuItemTemplate: (item: any) =>
        `<div class="mention-item">${item.original.key}</div>`,
      selectTemplate: (item: any) =>
       item?.original?.value ? `${this.tributeConfig.suggestionPrefix || ''}${item.original.value}${this.tributeConfig.suggestionSuffix || ''}` : '',
      noMatchTemplate: () => '',
    };
    this.destroyTribute(); // Clean up any previous instance

    this.tributeInstance = new Tribute(tributeOptions);
    this.tributeInstance.attach(this.hostElement.nativeElement);

    this.hostElement.nativeElement.addEventListener('tribute-replaced', (event: any) => {
      this.mentionSelected.emit(event?.detail?.item?.original ?? "");
    });
  }

  /**
   * Cleans up the Tribute.js instance when directive is destroyed or reinitialized.
   * 
   * @returns {void}
   * @memberof TributeMentionDirective
   */
  private destroyTribute(): void {
    if (this.tributeInstance) {
        this.tributeInstance.detach(this.hostElement.nativeElement);
    }
  }

  /**
   * Lifecycle hook: called when the directive is destroyed.
   * 
   * @returns {void}
   * @memberof TributeMentionDirective
   */
  public ngOnDestroy(): void {
    this.destroyTribute();
  }
}
