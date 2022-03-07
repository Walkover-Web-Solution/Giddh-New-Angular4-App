// https://qz.io/wiki/2.0-raw-printing#escpos
import { Injectable } from '@angular/core';

@Injectable()
export class PrinterFormatService {

  public initPrinter = '\x1B' + '\x40';
  public centerText = '\x1B' + '\x61' + '\x31';
  public endCenterText = '\x0A';
  public fullCut = '\x1D' + '\x56' + '\x00';
  public lineBreak = '\x0A';
  public endPrinter = '\n\n\n\n\n\n';
  public boldOn = '\x1B' + '\x45' + '\x0D';
  public boldOff = '\x1B' + '\x45' + '\x0A';
  public largeOn = '\x1B' + '\x21' + '\x30';
  public largeOff = '\x1B' + '\x21' + '\x0A' + '\x1B' + '\x45' + '\x0A';
  public doubleFontSize = '\x1D' + '\x21' + '\x11';
  public standardFontSize = '\x1D' + '\x21' + '\x00';
  public leftAlign = '\x1B' + '\x61' + '\x30';
  public rightAlign = '\x1B' + '\x61' + '\x32';
  public smallFontSize = '\x1B' + '\x4D' + '\x31';
  public normalFontSize = '\x1B' + '\x4D' + '\x30';
  public pulseForCashDrawer = '\x10' + '\x14' + '\x01' + '\x00' + '\x05';

  public formatCenter(data) {
    let text = this.centerText + data + this.endCenterText;
    return text;
  }

  public formatBold(data) {
    let text = this.boldOn + data + this.boldOff;
    return text;
  }

  public formatLarge(data) {
    let text = this.largeOn + data + this.largeOff;
    return text;
  }

  public formatDouble(data) {
    let text = this.doubleFontSize + data + this.standardFontSize;
    return text;
  }

}
