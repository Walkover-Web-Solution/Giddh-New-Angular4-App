import { Component, OnInit } from '@angular/core';
import { PrintService, UsbDriver, WebPrintDriver } from 'ng-thermal-print';

@Component({
    selector: 'thermal-pdf',
    templateUrl: './thermal-pdf.component.html',
    styleUrls: [`./thermal-pdf.component.scss`]
})
export class ThermalComponent implements OnInit {
    public status: boolean = false;
    public usbPrintDriver: UsbDriver;
    public webPrintDriver: WebPrintDriver;
    public ip: string = '';

    constructor(private printService: PrintService) {
        this.usbPrintDriver = new UsbDriver();
        this.printService.isConnected.subscribe(result => {
            this.status = result;
            if (result) {
                console.log('Connected to printer!!!');
            } else {
                console.log('Not connected to printer.');
            }
        });
    }
    public  ngOnInit(): void {

    }

    public requestUsb() {
        this.usbPrintDriver.requestUsb().subscribe(result => {
            this.printService.setDriver(this.usbPrintDriver, 'ESC/POS');
        });
    }

    public connectToWebPrint() {
        this.webPrintDriver = new WebPrintDriver(this.ip);
        this.printService.setDriver(this.webPrintDriver, 'WebPRNT');
    }

    public print() {
        this.printService.init()
            .setBold(true)
            .writeLine('Hello World!')
            .setBold(false)
            .feed(4)
            .cut('full')
            .flush();
    }

}