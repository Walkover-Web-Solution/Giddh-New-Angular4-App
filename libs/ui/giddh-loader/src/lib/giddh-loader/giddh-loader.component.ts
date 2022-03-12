import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { GiddhLoaderType } from '../models/giddh-loader.vm';

@Component({
    selector: 'giddh-loader',
    templateUrl: './giddh-loader.component.html',
    styleUrls: ['./giddh-loader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GiddhLoaderComponent {
    @Input() public loaderType: GiddhLoaderType = GiddhLoaderType.IndefiniteCircularLoader;
    @Input() public cssClass = "";

    public loaderTypes = GiddhLoaderType;
}
