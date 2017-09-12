import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ISection } from '../../../../../models/api-models/Invoice';

@Component({
  selector: 'invoice-template-modal',
  templateUrl: './template-modal.component.html',
  styleUrls: ['./template-modal.component.css']
})

export class InvoiceTemplateModalComponent {
  @Input() public templateId: string;
  @Input() public templateSections: ISection[];
  @Output() public downloadOrSendMailEvent: EventEmitter<object> = new EventEmitter();
}
