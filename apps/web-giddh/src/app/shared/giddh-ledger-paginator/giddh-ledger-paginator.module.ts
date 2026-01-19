import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { GiddhLedgerPaginatorComponent } from './giddh-ledger-paginator.component';

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonToggleModule
    ],
    exports: [
        GiddhLedgerPaginatorComponent
    ],
    declarations: [GiddhLedgerPaginatorComponent]
})
/**
 * GiddhLedgerPaginatorModule module
 * Implements GiddhLedgerPaginatorModule functionality
 */
export class GiddhLedgerPaginatorModule { }
