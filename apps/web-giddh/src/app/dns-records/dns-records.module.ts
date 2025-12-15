import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DnsRecordsComponent } from './dns-records.component';
import { DnsRecordsRoutingModule } from './dns-records.routing.module';
import { RouterModule } from '@angular/router';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { MatTableModule } from '@angular/material/table';
import { ClipboardModule } from 'ngx-clipboard';
import { MatCardModule } from '@angular/material/card';
import { GiddhPageLoaderModule } from '../shared/giddh-page-loader/giddh-page-loader.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        DnsRecordsRoutingModule,
        TranslateDirectiveModule,
        MatTableModule,
        ClipboardModule,
        MatCardModule,
        GiddhPageLoaderModule
    ],
    declarations: [DnsRecordsComponent]
})
export class DnsRecordsModule { }
