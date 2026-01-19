import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

/**
 * Custom RxJS operators for form control operations
 * Eliminates duplication across 10+ components with form control subscriptions
 */

/**
 * Custom RxJS operator for form control search with debounce
 * Handles both search and clear scenarios
 * 
 * @template T
 * @param {number} [debounceMs=700] - Debounce time in milliseconds
 * @param {(value: T) => void} onSearch - Callback when search value is present
 * @param {() => void} [onClear] - Optional callback when value is cleared
 * @returns RxJS operator
 */
export function searchWithDebounce<T>(
    debounceMs: number = 700,
    onSearch: (value: T) => void,
    onClear?: () => void
) {
    return (source: Observable<T>) => source.pipe(
        debounceTime(debounceMs),
        distinctUntilChanged(),
        tap((value: T) => {
            const hasValue = value && (typeof value === 'string' ? value.trim() !== '' : true);
            
            if (hasValue) {
                onSearch(value);
            } else if (onClear) {
                onClear();
            }
        })
    );
}

/**
 * Custom RxJS operator for form control with validation check
 * 
 * @template T
 * @param {number} [debounceMs=700] - Debounce time in milliseconds
 * @param {(value: T) => boolean} validator - Validation function
 * @param {(value: T) => void} onValid - Callback when value is valid
 * @param {(value: T) => void} [onInvalid] - Optional callback when value is invalid
 * @returns RxJS operator
 */
export function searchWithValidation<T>(
    debounceMs: number = 700,
    validator: (value: T) => boolean,
    onValid: (value: T) => void,
    onInvalid?: (value: T) => void
) {
    return (source: Observable<T>) => source.pipe(
        debounceTime(debounceMs),
        distinctUntilChanged(),
        tap((value: T) => {
            if (validator(value)) {
                onValid(value);
            } else if (onInvalid) {
                onInvalid(value);
            }
        })
    );
}
