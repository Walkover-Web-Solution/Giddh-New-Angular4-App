import {Directive, ElementRef, Input, OnDestroy, OnInit, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import Tribute from 'tributejs';

/**
 * Handles Directive functionality
 */
@Directive({
  selector: '[appTributeMention]',
  exportAs: 'appTributeMention',
  standalone: false
})
/**
 * TributeMentionDirective class
 * Implements TributeMentionDirective functionality
 */
export class TributeMentionDirective implements OnInit, OnDestroy, OnChanges {

  /** Tribute.js configuration options.*/
  @Input('appTributeMention') tributeConfig: any = {};
  /** List of values to be shown in the mention dropdown.*/
  @Input('appTributeMentionValues') mentionList: any[] = [];
  /** Emits the selected item when a user picks a mention from the list.*/
  @Output() mentionSelected = new EventEmitter<any>();
  /** Holds the Tribute instance. */
  private tributeInstance!: Tribute<any>;

  /**
   * Creates an instance of class
   * Initializes component dependencies and sets up initial state
   */
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
    /**
     * Handles if functionality
     */
    if (
      changes.mentionList &&
      changes.mentionList.currentValue !== changes.mentionList.previousValue
    ) {
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
      requireLeadingSpace: false,
      positionMenu: true,
      ...this.tributeConfig,
      /**
       * Handles lookup functionality
       */
      lookup: (item: any) => item.label,
      /**
       * Handles menuItemTemplate functionality
       */
      menuItemTemplate: (item: any) =>
        `<div class="mention-item">${item.original.label}</div>`,
      /**
       * Handles selectTemplate functionality
       */
      selectTemplate: (item: any) =>{
        /**
         * Sets timeout value
         */
        setTimeout(() => {
            this.hostElement.nativeElement.value = this.hostElement.nativeElement.value.trim();
        }, 50);
       return item?.original?.value ? `${this.tributeConfig.suggestionPrefix || ''}${item.original.value}${this.tributeConfig.suggestionSuffix || ''}` : ''},
    };
    this.destroyTribute(); // Clean up any previous instance

    this.tributeInstance = new Tribute(tributeOptions);
    this.tributeInstance.attach(this.hostElement.nativeElement);

    this.hostElement.nativeElement.addEventListener('tribute-replaced', (event: any) => {
      this.mentionSelected.emit(event?.detail?.item?.original ?? "");
    });
    this.hostElement.nativeElement.addEventListener('keyup', (event: any) => {
      /**
       * Handles if functionality
       */
      if (this.hostElement.nativeElement.value.endsWith(this.tributeConfig.trigger)) {
        this.open(false);
      }
    });
  }

  /**
   * Cleans up the Tribute.js instance when directive is destroyed or reinitialized.
   *
   * @returns {void}
   * @memberof TributeMentionDirective
   */
  private destroyTribute(): void {
    /**
     * Handles if functionality
     */
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

  /**
   * Opens the tribute menu programmatically.
   *
   * @returns {void}
   * @memberof TributeMentionDirective
   */
  public open(openByFocus: boolean = true): void {
    /**
     * Handles if functionality
     */
    if (!this.tributeInstance) {
      return;
    }
    /**
     * Handles if functionality
     */
    if (!this.hostElement.nativeElement.value?.trim() && openByFocus) {
      this.hostElement.nativeElement.value = this.tributeConfig.trigger;
    }

    this.hostElement.nativeElement.dispatchEvent(new InputEvent('input', { bubbles: true }));

    /**
     * Sets timeout value
     */
    setTimeout(() => {
      this.hostElement.nativeElement.focus();
        const fileFormatPrefix = this.hostElement.nativeElement.value;
        /**
         * Handles if functionality
         */
        if (this.tributeInstance && fileFormatPrefix.lastIndexOf(this.tributeConfig.trigger) > fileFormatPrefix.lastIndexOf(this.tributeConfig.suggestionSuffix)) {
            this.tributeInstance['showMenuFor'](this.hostElement.nativeElement);
        }
    }, 50);
  }
}
