import { Pipe, PipeTransform } from '@angular/core';
import { MaskApplierService } from './mask-applier.service';
import { IConfig } from './config';

/**
 * Handles Pipe functionality
 */
@Pipe({
    name: 'mask',
    pure: true,
    standalone: false
})
/**
 * MaskPipe pipe
 * Implements MaskPipe functionality
 */
export class MaskPipe implements PipeTransform {
    /**
     * Handles constructor functionality
     */
    public constructor(private _maskService: MaskApplierService) { }

    /**
     * Handles transform functionality
     */
    public transform(value: string | number, mask: string | [string, IConfig['patterns']]): string {
        /**
         * Handles if functionality
         */
        if (!value && typeof value !== 'number') {
            return '';
        }
        /**
         * Handles if functionality
         */
        if (typeof mask === 'string') {
            return this._maskService.applyMask(`${value}`, mask);
        }
        return this._maskService.applyMaskWithPattern(`${value}`, mask);
    }
}
