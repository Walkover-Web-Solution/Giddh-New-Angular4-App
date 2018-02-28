import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LedgerService } from '../../../services/ledger.service';
import { saveAs } from 'file-saver';
import { PermissionDataService } from 'app/permissions/permission-data.service';
import { ToasterService } from '../../services/toaster.service';
import { some } from '../../lodash-optimized';
import { ExportLedgerRequest, MailLedgerRequest } from '../../models/api-models/Ledger';
import { validateEmail } from '../../shared/helpers/helperFunctions';

@Component({
  selector: 'export-daybook',
  templateUrl: './export-daybook.component.html'
})
export class ExportDaybookComponent implements OnInit {

  @Output() public closeExportDaybookModal: EventEmitter<object> = new EventEmitter();

  public emailTypeSelected: string = '';
  public emailTypeMini: string = '';
  public emailTypeDetail: string;
  public emailData: string = '';
  public fileType: string = 'pdf';
  public order: string = 'asc';

  constructor(private _permissionDataService: PermissionDataService) {
    //
  }

  public ngOnInit() {
    this._permissionDataService.getData.forEach(f => {
      if (f.name === 'LEDGER') {
        let isAdmin = some(f.permissions, (prm) => prm.code === 'UPDT');
        this.emailTypeSelected = isAdmin ? 'admin-detailed' : 'view-detailed';
        this.emailTypeMini = isAdmin ? 'admin-condensed' : 'view-condensed';
        this.emailTypeDetail = isAdmin ? 'admin-detailed' : 'view-detailed';
      }
    });
  }

  public exportLedger() {
    this.closeExportDaybookModal.emit({ type: this.emailTypeSelected,  fileType: this.fileType, order: this.order });
  }

}
