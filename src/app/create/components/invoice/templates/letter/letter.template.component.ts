import { Component, OnInit, EventEmitter, Output, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { VoucherClass } from '../../../../../models/api-models/Sales';
import { FormControl, Form } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'letter-template',
  templateUrl: './letter.template.component.html',
  styleUrls: [
    '../template.component.scss',
    './letter.template.component.scss'
  ],
  encapsulation: ViewEncapsulation.Native
})

export class LetterTemplateComponent implements OnInit, OnDestroy  {
  @Output() public closeAndDestroyComponent: EventEmitter<any> = new EventEmitter();
  public selectedFiles: any;
  public logoPath: any;
  public data: VoucherClass;
  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public name: string = 'August 09, 2017';
  public name1: string = 'GSTIN: 11AAAAAA000A1Z0';
  public name2: string = 'PAN: AAACW9768L';
  public base64Data: SafeResourceUrl = '';
  public planHtml: any;

  constructor(private _sanitizer: DomSanitizer) {
    console.log (`hello from LetterTemplateComponent`);
  }

  public readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (item: any) => {
        this.logoPath = item.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  public clearUploadedImg() {
    this.logoPath = null;
  }

  public ngOnInit() {
    this.data = new VoucherClass();
    this.initWithDummyData();
    console.log (this.data);
  }

  public ngOnDestroy() {
    //
  }

  public xml2string(node) {
    if (typeof(XMLSerializer) !== 'undefined') {
       let serializer = new XMLSerializer();
       return serializer.serializeToString(node);
    } else if (node.xml) {
       return node.xml;
    }
 }

  public stringToUtf16ByteArray(str) {
      let bytes = [];
    for (let i = 0; i < str.length; ++i) {
        let charCode = str.charCodeAt(i);
        // tslint:disable-next-line:no-bitwise
        bytes.push((charCode & 0xFF00) >>> 8);
        // tslint:disable-next-line:no-bitwise
        bytes.push(charCode & 0xFF);
    }
      return bytes;
  }

  public _arrayBufferToBase64( buffer ) {
    let binary = '';
    let bytes = new Uint8Array( buffer );
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }

  public emitTemplateData(data: any) {
    const a = this.xml2string(data);
    const stringToUtf16ByteArray = this.stringToUtf16ByteArray(a);
    const _arrayBufferToBase64 = this._arrayBufferToBase64(stringToUtf16ByteArray);
    this.base64Data = this._sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + _arrayBufferToBase64);
  }

  public doDestroy() {
    this.closeAndDestroyComponent.emit(true);
  }

  private initWithDummyData() {
    //
  }
}
