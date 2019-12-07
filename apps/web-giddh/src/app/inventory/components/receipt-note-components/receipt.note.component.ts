import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InvViewService } from "../../inv.view.service";
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'receipt-note',  // <home></home>
    templateUrl: './receipt.note.component.html',
    styleUrls: ['./receipt.note.component.scss'],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
    ]
})

export class ReceiptNoteComponent {
    public asideMenuState: string = 'out';
    public selectedAction: string = 'Multiple Products';
    public sendersOptions = [{
        label: 'Shalinee', value: 'Shalinee'
    }, {
        label: 'Shalinee12', value: 'Shalinee12'
    }];

    public gstinOptions = [
        {label: 'GSTIN1', value: 'GSTIN1'},
        {label: 'GSTIN2', value: 'GSTIN1'}
    ];

    public selectRefDoc = [
        {label: 'Ref doc 1', vaue: 'Ref doc 1'},
        {label: 'Ref doc 2', vaue: 'Ref doc 2'}
    ];

    public recGstinOptions = [
        {label: '23KSJDOS48293K', value: '23KSJDOS48293K'},
        {label: '23KSJDOS48293S', value: '23KSJDOS48293S'}
    ];
    public selectRecivers = [
        {label: 'Shalinee01', value: 'Shalinee01'},
        {label: 'Shalinee02', value: 'Shalinee02'}
    ];

    public hideSenderReciverDetails = false;

    constructor(private _router: Router, private invViewService: InvViewService) {

    }

    public backToInv() {
        this.invViewService.setActiveView(null, null);
        this._router.navigate(['/pages/inventory']);
    }

    public toggleBodyClass() {
        if (this.asideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    public toggleAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }
}

