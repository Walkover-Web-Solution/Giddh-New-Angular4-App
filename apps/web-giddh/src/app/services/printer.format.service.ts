// https://qz.io/wiki/2.0-raw-printing#escpos
import { Injectable } from '@angular/core';

@Injectable()
export class PrinterFormatService {
  /** This will use for init printer */
  public initPrinter = '\x1B' + '\x40';
  /** This will use for center text */
  public centerText = '\x1B' + '\x61' + '\x31';
  /** This will use for end center text */
  public endCenterText = '\x0A';
  /** This will use for full cut */
  public fullCut = '\x1D' + '\x56' + '\x00';
  /** This will use for  line break */
  public lineBreak = '\x0A';
  /** This will use for end printer */
  public endPrinter = '\n\n\n\n\n\n';
  /** This will use for bold */
  public boldOn = '\x1B' + '\x45' + '\x0D';
  /** This will use for bold off */
  public boldOff = '\x1B' + '\x45' + '\x0A';
  /** This will use for large on */
  public largeOn = '\x1B' + '\x21' + '\x30';
  /** This will use for large off */
  public largeOff = '\x1B' + '\x21' + '\x0A' + '\x1B' + '\x45' + '\x0A';
  /** This will use for double font size */
  public doubleFontSize = '\x1D' + '\x21' + '\x11';
  /** This will use for standard size */
  public standardFontSize = '\x1D' + '\x21' + '\x00';
  /** This will use for left align */
  public leftAlign = '\x1B' + '\x61' + '\x30';
  /** This will use for right align */
  public rightAlign = '\x1B' + '\x61' + '\x32';
  /** This will use for small font size */
  public smallFontSize = '\x1B' + '\x4D' + '\x31';
  /** This will use for normal font size */
  public normalFontSize = '\x1B' + '\x4D' + '\x30';
  /** This will use for pulse for cash driver */
  public pulseForCashDrawer = '\x10' + '\x14' + '\x01' + '\x00' + '\x05';

  /**
   * This will use for format center text
   *
   * @param {*} data
   * @return {*} 
   * @memberof PrinterFormatService
   */
  public formatCenter(data: any): any {
    let text = this.centerText + data + this.endCenterText;
    return text;
  }

  /**
   * This will use for format bold text
   *
   * @param {*} data
   * @return {*} 
   * @memberof PrinterFormatService
   */
  public formatBold(data: any): any {
    let text = this.boldOn + data + this.boldOff;
    return text;
  }

  /**
   * This will use for format large text
   *
   * @param {*} data
   * @return {*} 
   * @memberof PrinterFormatService
   */
  public formatLarge(data: any): any {
    let text = this.largeOn + data + this.largeOff;
    return text;
  }

  /**
   * This will use for format double text
   *
   * @param {*} data
   * @return {*} 
   * @memberof PrinterFormatService
   */
  public formatDouble(data: any): any {
    let text = this.doubleFontSize + data + this.standardFontSize;
    return text;
  }

}
