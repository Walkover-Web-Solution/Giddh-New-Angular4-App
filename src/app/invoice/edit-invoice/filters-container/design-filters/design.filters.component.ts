import {
  Component, Input, EventEmitter, Output, OnInit, OnChanges,
  SimpleChanges
} from '@angular/core';
import { Font } from 'ngx-font-picker';

@Component({
  selector: 'design-filters',
  templateUrl: 'design.filters.component.html'
})

export class DesignFiltersContainerComponent implements OnInit {

  public font: Font = new Font({
    family: 'Roboto',
    size: '14px',
    style: 'regular',
    styles: ['regular']
  });
  public ifTemplateSelected: boolean = false;
  public ifLogoSelected: boolean = false;
  public ifColorSelected: boolean = false;
  public ifFontSelected: boolean = false;
  public ifPrintSelected: boolean = false;
  public sampleJsonString: string;
  @Input() public design: boolean;
  private _presetFonts = ['Arial', 'Serif', 'Helvetica', 'Sans-Serif', 'Open Sans', 'Roboto Slab'];
  private sizeSelect: boolean = true;
  private styleSelect: boolean = true;
  private presetFonts = this._presetFonts;
  constructor() {
    console.log('design-filters-container constructor called');
  }

  public ngOnInit() {
    console.log('design-filters-container initialised');
  }

  public selectTemplate() {
    this.ifTemplateSelected = true;
    this.ifLogoSelected = false;
    this.ifColorSelected = false;
    this.ifPrintSelected = false;
    this.ifFontSelected = false;
  }

  public selectLogo() {
    this.ifLogoSelected = false;
    this.ifColorSelected = false;
    this.ifPrintSelected = false;
    this.ifFontSelected = false;
    this.ifTemplateSelected = false;
  }

  public selectColor() {
    this.ifColorSelected = true;
    this.ifLogoSelected = false;
    this.ifPrintSelected = false;
    this.ifFontSelected = false;
    this.ifTemplateSelected = false;
  }
  public selectFonts() {
    this.ifFontSelected = true;
    this.ifColorSelected = false;
    this.ifLogoSelected = false;
    this.ifPrintSelected = false;
    this.ifTemplateSelected = false;
  }

  public printSettings() {
    this.ifPrintSelected = true;
    this.ifFontSelected = false;
    this.ifColorSelected = false;
    this.ifLogoSelected = false;
    this.ifTemplateSelected = false;
  }

  private togglePresetFonts() {
    this.presetFonts = this.presetFonts.length ? [] : this._presetFonts;
  }

  private toggleExtraOptions() {
    this.sizeSelect = !this.sizeSelect;
    this.styleSelect = !this.styleSelect;
  }
}
