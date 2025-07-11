import { Directive, ElementRef, Input, OnDestroy, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import Tribute from 'tributejs';

@Directive({
  selector: '[appTributeMention]'
})
export class TributeMentionDirective implements OnInit, OnDestroy {
  @Input('appTributeMention') config: any = {};
  @Input('appTributeMentionValues') values: any[] = [];
  @Output() mentioned = new EventEmitter<any>();
  private tribute!: Tribute<any>;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    this.initializeTribute();
  }

  private initializeTribute() {
    const mergedConfig = {
      ...this.config,
      values: this.values, // Combine the config with current values
      requireLeadingSpace: true,
      positionMenu: true,
      menuItemTemplate: (item) => `<div class="mention-item">${item.original.key}</div>`,
      selectTemplate: (item) => `${this.config.suggestionPrefix || ''}${item.original.value}${this.config.suggestionSuffix || ''}`
    };

    this.cleanUpTribute(); // Clean up any existing instance

    this.tribute = new Tribute(mergedConfig);
    this.tribute.attach(this.elementRef.nativeElement);

    this.elementRef.nativeElement.addEventListener('tribute-replaced', (event: any) => {
      this.mentioned.emit(event.detail.item.original);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes.config || changes.values) && (changes.values?.currentValue !== changes.values?.previousValue)) {
      this.initializeTribute();
    }
  }

  ngOnDestroy() {
    this.cleanUpTribute();
  }

  private cleanUpTribute() {
    if (this.tribute) {
      try {
        this.tribute.detach(this.elementRef.nativeElement);
      } catch (e) {
        console.warn('Error detaching tribute', e);
      }
    }
  }
}