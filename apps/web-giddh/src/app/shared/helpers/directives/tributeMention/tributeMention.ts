import {Directive, ElementRef, Input, OnDestroy, OnInit, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import Tribute from 'tributejs';
import { endsWith } from '../../../../lodash-optimized';

@Directive({
    selector: '[appTributeMention]',
  standalone: false,
    exportAs: 'appTributeMention'
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
      lookup: (item: any) => item.label,
      menuItemTemplate: (item: any) =>
        `<div class="mention-item">${item.original.label}</div>`,
      selectTemplate: (item: any) =>{
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
    if (!this.tributeInstance) {
      return;
    }
    if (!this.hostElement.nativeElement.value?.trim() && openByFocus) {
      this.hostElement.nativeElement.value = this.tributeConfig.trigger;
    }

    this.hostElement.nativeElement.dispatchEvent(new InputEvent('input', { bubbles: true }));

    setTimeout(() => {
      this.hostElement.nativeElement.focus();
        const fileFormatPrefix = this.hostElement.nativeElement.value;
        if (this.tributeInstance && fileFormatPrefix.lastIndexOf(this.tributeConfig.trigger) > fileFormatPrefix.lastIndexOf(this.tributeConfig.suggestionSuffix)) {
            this.tributeInstance['showMenuFor'](this.hostElement.nativeElement);
        }
    }, 50);
  }
}
