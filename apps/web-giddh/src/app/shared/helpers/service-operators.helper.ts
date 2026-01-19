import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponse } from '../../models/api-models/BaseResponse';

/**
 * Custom RxJS operators for service response handling
 * Eliminates duplication across 8+ service methods with response mapping
 */

/**
 * Maps service response and attaches request metadata
 * 
 * @template T - Response body type
 * @template R - Request type
 * @param {R} request - Original request object
 * @param {Partial<BaseResponse<T, R>>} [additionalData] - Additional data to attach
 * @returns RxJS operator
 */
export function mapServiceResponse<T, R>(
    request: R,
    additionalData?: Partial<BaseResponse<T, R>>
) {
    return (source: Observable<BaseResponse<T, R>>) => source.pipe(
        map((res: BaseResponse<T, R>) => {
            const data = res;
            data.request = request;
            if (additionalData) {
                Object.assign(data, additionalData);
            }
            return data;
        })
    );
}

/**
 * Maps service response with query string
 * Common pattern for voucher/proforma services
 * 
 * @template T - Response body type
 * @template R - Request type
 * @param {R} request - Original request object
 * @param {string} queryString - Query string to attach (e.g., voucherType)
 * @returns RxJS operator
 */
export function mapServiceResponseWithQuery<T, R>(
    request: R,
    queryString: string
) {
    return mapServiceResponse<T, R>(request, { queryString } as any);
}

/**
 * Maps service response and extracts specific property
 * 
 * @template T - Response body type
 * @template R - Request type
 * @template K - Property key type
 * @param {R} request - Original request object
 * @param {K} propertyKey - Property key to extract
 * @returns RxJS operator
 */
export function mapServiceResponseProperty<T, R, K extends keyof BaseResponse<T, R>>(
    request: R,
    propertyKey: K
) {
    return (source: Observable<BaseResponse<T, R>>) => source.pipe(
        map((res: BaseResponse<T, R>) => {
            const data = res;
            data.request = request;
            return data[propertyKey];
        })
    );
}
