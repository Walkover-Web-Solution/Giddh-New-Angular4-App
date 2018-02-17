import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LaddaModule } from 'angular2-ladda';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { CreateInvoiceComponent } from './components/invoice/invoice.component';
import { CreateRoutingModule } from './create.routing.module';
import { CreateInvoiceTemplateComponent } from './components/invoice/templates/template.component';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { LetterTemplateComponent } from './components/invoice/templates/letter/letter.template.component';
import { CreateInvoiceHeaderComponent } from './components/header/create.header.component';
import { CreateInvoiceStepsComponent } from './components/nav/create.steps.component';
import { ContenteditableDirective } from 'ng-contenteditable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CreateRoutingModule,
    ModalModule,
    LaddaModule,
    ShSelectModule,
    ElementViewChildModule
  ],
  declarations: [
    CreateInvoiceComponent,
    CreateInvoiceTemplateComponent,
    CreateInvoiceStepsComponent,
    CreateInvoiceHeaderComponent,
    LetterTemplateComponent,
    ContenteditableDirective
  ],
  entryComponents: [
    LetterTemplateComponent
  ]
})
export class CreateModule { }
