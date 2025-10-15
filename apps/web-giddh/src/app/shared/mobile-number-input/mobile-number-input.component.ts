import { Component, Input, Output, EventEmitter, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { GeolocationService } from './geolocation.service';
import { Country, COUNTRIES_DATA } from './countries-data';

/** Custom validator for mobile number based on selected country */
export function mobileNumberValidator(country: Country | null) {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value || !country) {
            return null;
        }

        let phoneNumber = control.value.replace(/\s+/g, '');
        
        // Handle various dial code scenarios
        if (phoneNumber.startsWith('+')) {
            // Case 1: Number with + dial code - remove any dial code
            if (phoneNumber.startsWith(country.dialCode)) {
                phoneNumber = phoneNumber.substring(country.dialCode.length);
            } else {
                // Check if it starts with any other country's dial code and extract number
                const dialCodeMatch = phoneNumber.match(/^\+\d{1,4}/);
                if (dialCodeMatch) {
                    phoneNumber = phoneNumber.substring(dialCodeMatch[0].length);
                }
            }
        } else {
            // Case 2: Number without + but with dial code digits
            const dialCodeWithoutPlus = country.dialCode.substring(1); // Remove + from dial code
            
            // Only remove dial code if the number is longer than expected mobile number length
            // This prevents removing valid mobile number digits that happen to start with dial code
            if (phoneNumber.startsWith(dialCodeWithoutPlus) && 
                phoneNumber.length > country.maxLength) {
                phoneNumber = phoneNumber.substring(dialCodeWithoutPlus.length);
            }
        }
        
        if (phoneNumber.length < country.minLength || phoneNumber.length > country.maxLength) {
            return { invalidLength: true };
        }

        if (!country.pattern.test(phoneNumber)) {
            return { invalidPattern: true };
        }

        return null;
    };
}

@Component({
    selector: 'mobile-number-input',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatIconModule,
        HttpClientModule
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MobileNumberInputComponent),
            multi: true
        }
    ],
    templateUrl: './mobile-number-input.component.html',
    styleUrls: ['./mobile-number-input.component.scss']
})
export class MobileNumberInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
    /** Label for the mobile input field */
    @Input() public label: string = 'Mobile Number';
    
    /** Whether the field is required */
    @Input() public required: boolean = false;
    
    /** Whether the field is disabled */
    @Input() public disabled: boolean = false;
    
    /** Default country code */
    @Input() public defaultCountry: string = '+91';
    
    /** Placeholder text for the mobile input field */
    @Input() public placeholder: string;
    
    /** Unique identifier for the component instance */
    @Input() public id: string;
    
    /** Name attribute for the component instance */
    @Input() public name: string;
    
    /** Whether to use image flags instead of emoji flags */
    @Input() public useImageFlags: boolean = false;
    
    /** Event emitted when country changes */
    @Output() public countryChanged = new EventEmitter<Country>();
    
    /** Event emitted when mobile number changes */
    @Output() public mobileChanged = new EventEmitter<string>();

    /** Form controls */
    public countryControl = new FormControl<Country | null>(null);
    public mobileControl = new FormControl<string>('');

    /** Currently selected country */
    public selectedCountry: Country | null = null;

    /** Subject for component destruction */
    private destroyed$ = new Subject<void>();

    /** ControlValueAccessor callbacks */
    private onChange = (value: string) => {};
    private onTouched = () => {};

    /** List of all supported countries with their data */
    public countries: Country[] = COUNTRIES_DATA;

    /**
     * Creates an instance of MobileNumberInputComponent
     * 
     * @param {GeolocationService} geolocationService - Service for IP-based country detection
     * @memberof MobileNumberInputComponent
     */
    constructor(private geolocationService: GeolocationService) {}

    /**
     * Component initialization
     *
     * @memberof MobileNumberInputComponent
     */
    public ngOnInit(): void {
        this.detectUserCountry();
        this.setupFormControls();
        // this.countries = this.countries.sort((a, b) => a.dialCode.localeCompare(b.dialCode));
    }

    /**
     * Component cleanup
     *
     * @memberof MobileNumberInputComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    /**
     * Detects user's country based on IP address and sets as default
     *
     * @private
     * @memberof MobileNumberInputComponent
     */
    private detectUserCountry(): void {
        this.geolocationService.getUserLocation()
            .pipe(takeUntil(this.destroyed$))
            .subscribe(location => {
                if (location && location.countryCode) {
                    const dialCode = this.geolocationService.mapCountryCodeToDialCode(location.countryCode);
                    if (dialCode) {
                        const detectedCountry = this.countries.find(country => country.dialCode === dialCode);
                        if (detectedCountry) {
                            this.selectedCountry = detectedCountry;
                            this.countryControl.setValue(detectedCountry, { emitEvent: false });
                            this.updateValidators();
                            console.log(`Auto-detected country: ${detectedCountry.name} (${detectedCountry.dialCode})`);
                            return;
                        }
                    }
                }
                // Fallback to default country if detection fails
                this.initializeDefaultCountry();
            });
    }

    /**
     * Initializes the default country selection
     *
     * @private
     * @memberof MobileNumberInputComponent
     */
    private initializeDefaultCountry(): void {
        const defaultCountry = this.countries.find(country => country.dialCode === this.defaultCountry);
        if (defaultCountry) {
            this.selectedCountry = defaultCountry;
            this.countryControl.setValue(defaultCountry);
        }
    }

    /**
     * Sets up form controls and their validators
     *
     * @private
     * @memberof MobileNumberInputComponent
     */
    private setupFormControls(): void {
        if (this.required) {
            this.mobileControl.setValidators([Validators.required]);
        }

        this.mobileControl.valueChanges
            .pipe(distinctUntilChanged(), takeUntil(this.destroyed$))
            .subscribe(value => {
                this.updateValidators();
                this.mobileChanged.emit(value || '');
                this.onChange(this.getFullPhoneNumber());
            });

        this.countryControl.valueChanges
            .pipe(distinctUntilChanged(), takeUntil(this.destroyed$))
            .subscribe(country => {
                if (country) {
                    this.selectedCountry = country;
                    this.updateValidators();
                    this.countryChanged.emit(country);
                    this.onChange(this.getFullPhoneNumber());
                }
            });
    }

    /**
     * Updates validators based on selected country
     *
     * @private
     * @memberof MobileNumberInputComponent
     */
    private updateValidators(): void {
        const validators = [];
        
        if (this.required) {
            validators.push(Validators.required);
        }
        
        if (this.selectedCountry) {
            validators.push(mobileNumberValidator(this.selectedCountry));
        }

        this.mobileControl.setValidators(validators);
        this.mobileControl.updateValueAndValidity({ emitEvent: false });
        
        // Trigger validation display
        if (this.mobileControl.value) {
            this.mobileControl.markAsTouched();
        }
    }

    /**
     * Handles country selection change
     * 
     * @param {Country} country - Selected country
     * @memberof MobileNumberInputComponent
     */
    public onCountryChange(country: Country): void {
        const previousCountry = this.selectedCountry;
        this.selectedCountry = country;
        this.updateValidators();
        
        // Handle mobile number when country changes
        if (this.mobileControl.value) {
            const currentValue = this.mobileControl.value.replace(/\s+/g, '');
            let mobileNumber = currentValue;
            
            // Extract pure mobile number from current input
            if (previousCountry) {
                // Remove previous country's dial code if present
                if (currentValue.startsWith('+')) {
                    if (currentValue.startsWith(previousCountry.dialCode)) {
                        mobileNumber = currentValue.substring(previousCountry.dialCode.length);
                    } else {
                        // Check for any dial code pattern and extract number
                        const dialCodeMatch = currentValue.match(/^\+\d{1,4}/);
                        if (dialCodeMatch) {
                            mobileNumber = currentValue.substring(dialCodeMatch[0].length);
                        }
                    }
                } else {
                    // Remove dial code without + if present
                    const previousDialCodeWithoutPlus = previousCountry.dialCode.substring(1);
                    if (currentValue.startsWith(previousDialCodeWithoutPlus)) {
                        mobileNumber = currentValue.substring(previousDialCodeWithoutPlus.length);
                    }
                }
            }
            
            // Set the pure mobile number (without any dial code)
            this.mobileControl.setValue(mobileNumber, { emitEvent: false });
        }
        
        this.countryChanged.emit(country);
    }

    /**
     * Handles keypress events to restrict input to numbers and plus sign only
     * 
     * @param {KeyboardEvent} event - Keyboard event
     * @memberof MobileNumberInputComponent
     */
    public onKeyPress(event: KeyboardEvent): void {
        const char = event.key;
        const target = event.target as HTMLInputElement;
        const currentValue = target.value;
        const cursorPosition = target.selectionStart || 0;
        
        // Allow numbers (0-9)
        if (/[0-9]/.test(char)) {
            return;
        }
        
        // Allow plus sign at the beginning (position 0) or if cursor is at position 0
        if (char === '+') {
            if (cursorPosition === 0) {
                // If there's already a + at the beginning, prevent duplicate
                if (currentValue.startsWith('+')) {
                    event.preventDefault();
                    return;
                }
                return; // Allow + at the beginning
            } else {
                event.preventDefault(); // Prevent + anywhere else
                return;
            }
        }
        
        // Allow backspace, delete, arrow keys, tab, etc.
        if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(char)) {
            return;
        }
        
        // Prevent spaces, parentheses, and other characters during typing
        // These will be handled during paste operations
        if ([' ', '(', ')', '-', '.'].includes(char)) {
            event.preventDefault();
            return;
        }
        
        // Prevent all other characters (letters, symbols)
        event.preventDefault();
    }

    /**
     * Handles mobile number input changes
     * 
     * @param {Event} event - Input event
     * @memberof MobileNumberInputComponent
     */
    public onMobileInput(event: Event): void {
        const target = event.target as HTMLInputElement;
        let value = target.value;
        
        // Sanitize input: remove all non-numeric characters except + at the beginning
        value = this.sanitizeInput(value);
        
        // Update the input field with sanitized value if it changed
        if (target.value !== value) {
            target.value = value;
        }
        
        // Handle different input scenarios
        this.handleInputScenarios(value, target);
        
        // Update form control with the final value from the input field
        const finalValue = target.value;
        if (this.mobileControl.value !== finalValue) {
            this.mobileControl.setValue(finalValue, { emitEvent: false });
        }
        
        this.onChange(this.getFullPhoneNumber());
        this.onTouched();
    }

    /**
     * Handles different mobile number input scenarios
     * 
     * @param {string} value - Input value
     * @param {HTMLInputElement} target - Input element
     * @private
     * @memberof MobileNumberInputComponent
     */
    private handleInputScenarios(value: string, target: HTMLInputElement): void {
        if (value.startsWith('+')) {
            // Scenario 1: Number with + dial code
            this.handleDialCodeInput(value, target);
        } else if (this.selectedCountry) {
            // Scenario 2: Check if number contains dial code without +
            const dialCodeWithoutPlus = this.selectedCountry.dialCode.substring(1);
            
            // Only remove dial code if we have enough digits to be confident it's a duplicate
            // For India (+91), wait for at least 4 digits total (91 + 2 more digits)
            // For other countries, wait for dial code + at least 2 more digits
            let minDigitsRequired = dialCodeWithoutPlus.length + 2;
            
            // Special case for India: user typing 919111525164 should wait until 9191 (4 digits)
            if (this.selectedCountry.code === 'IN') {
                minDigitsRequired = Math.max(4, dialCodeWithoutPlus.length + 2);
            }
            
            if (value.startsWith(dialCodeWithoutPlus) && 
                value.length >= minDigitsRequired &&
                value.length > this.selectedCountry.maxLength) {
                // Extract mobile number part (everything after dial code)
                const mobileNumber = value.substring(dialCodeWithoutPlus.length);
                
                // Additional validation: ensure the remaining number looks like a valid mobile number
                // (starts with valid mobile number patterns for the country)
                if (this.isValidMobileNumberStart(mobileNumber)) {
                    this.mobileControl.setValue(mobileNumber, { emitEvent: false });
                    target.value = mobileNumber;
                    
                    // Set cursor position to end of input
                    setTimeout(() => {
                        target.setSelectionRange(mobileNumber.length, mobileNumber.length);
                    }, 0);
                }
            }
        }
    }

    /**
     * Validates if a mobile number starts with valid digits for the selected country
     * 
     * @param {string} mobileNumber - Mobile number to validate
     * @returns {boolean} True if the number starts with valid digits
     * @private
     * @memberof MobileNumberInputComponent
     */
    private isValidMobileNumberStart(mobileNumber: string): boolean {
        if (!this.selectedCountry || !mobileNumber) {
            return false;
        }
        
        // For India (+91), valid mobile numbers start with 6, 7, 8, or 9
        if (this.selectedCountry.code === 'IN') {
            return /^[6-9]/.test(mobileNumber);
        }
        
        // For US/Canada (+1), valid mobile numbers start with 2-9 (area code)
        if (this.selectedCountry.code === 'US' || this.selectedCountry.code === 'CA') {
            return /^[2-9]/.test(mobileNumber);
        }
        
        // For other countries, use a more generic validation
        // Most mobile numbers don't start with 0 or 1
        return /^[2-9]/.test(mobileNumber);
    }

    /**
     * Handles input with dial code (starting with +)
     * 
     * @param {string} value - Input value with dial code
     * @param {HTMLInputElement} target - Input element
     * @private
     * @memberof MobileNumberInputComponent
     */
    private handleDialCodeInput(value: string, target: HTMLInputElement): void {
        // Only process if we have enough characters for a meaningful dial code
        if (value.length < 2) {
            return;
        }
        
        // Auto-detect country from dial code
        this.autoDetectCountry(value);
        
        if (this.selectedCountry && value.startsWith(this.selectedCountry.dialCode)) {
            // For NANP (+1), wait for area code before extracting mobile number
            if (this.selectedCountry.dialCode === '+1' && value.length < 5) {
                // Don't extract yet, wait for area code (need at least +1XXX)
                return;
            }
            
            // Only extract mobile number if we have the complete dial code and sufficient digits
            if (value.length > this.selectedCountry.dialCode.length) {
                const mobileNumber = value.substring(this.selectedCountry.dialCode.length);
                
                // Prevent infinite loop by checking if the value is different
                if (target.value !== mobileNumber) {
                    this.mobileControl.setValue(mobileNumber, { emitEvent: false });
                    target.value = mobileNumber;
                    
                    // Set cursor position to end of input
                    setTimeout(() => {
                        target.setSelectionRange(mobileNumber.length, mobileNumber.length);
                    }, 0);
                }
            }
        }
    }

    /**
     * Sanitizes input to allow only numbers and plus sign at the beginning
     * 
     * @param {string} value - Input value to sanitize
     * @returns {string} Sanitized value
     * @private
     * @memberof MobileNumberInputComponent
     */
    private sanitizeInput(value: string): string {
        if (!value) return '';
        
        // If starts with +, keep the + and remove all non-numeric characters after it
        // This handles formats like: +55 (11) 98765-4321, +82 10-1234-5678
        if (value.startsWith('+')) {
            return '+' + value.substring(1).replace(/[^0-9]/g, '');
        }
        
        // Otherwise, remove all non-numeric characters
        // This handles formats like: (11) 98765-4321, 10-1234-5678, 11 98765-4321
        return value.replace(/[^0-9]/g, '');
    }

    /**
     * Gets the appropriate flag for display (emoji or image)
     * 
     * @param {Country} country - Country object
     * @returns {string} Flag emoji or image path
     * @memberof MobileNumberInputComponent
     */
    public getFlagDisplay(country: Country): string {
        if (this.useImageFlags && country.flagImage) {
            return country.flagImage;
        }
        return country.flag;
    }

    /**
     * Checks if the flag should be displayed as an image
     * 
     * @param {Country} country - Country object
     * @returns {boolean} True if flag should be displayed as image
     * @memberof MobileNumberInputComponent
     */
    public isImageFlag(country: Country): boolean {
        return this.useImageFlags && Boolean(country.flagImage);
    }

    /**
     * Auto-detects country based on dial code and area code for NANP
     * 
     * @param {string} value - Phone number with dial code
     * @private
     * @memberof MobileNumberInputComponent
     */
    private autoDetectCountry(value: string): void {
        // Only attempt detection if we have at least 2 characters (+X)
        if (value.length < 2) {
            return;
        }
        
        // Special handling for NANP (+1) - detect US vs Canada by area code
        if (value.startsWith('+1')) {
            if (value.length >= 5) { // Need at least +1XX for area code detection
                const detectedCountry = this.detectNANPCountry(value);
                if (detectedCountry && this.selectedCountry?.code !== detectedCountry.code) {
                    this.selectedCountry = detectedCountry;
                    this.countryControl.setValue(detectedCountry, { emitEvent: false });
                    
                    // Only extract mobile number if we have sufficient digits for area code detection
                    if (value.length >= 5) {
                        const mobileNumber = value.substring(detectedCountry.dialCode.length);
                        this.mobileControl.setValue(mobileNumber, { emitEvent: false });
                    }
                    
                    this.updateValidators();
                    this.countryChanged.emit(detectedCountry);
                    
                    console.log(`Auto-detected NANP country: ${detectedCountry.name} (${detectedCountry.dialCode}) from input: ${value}`);
                }
            } else if (value.length >= 2) {
                // Just detect US as default for +1 without extracting mobile number yet
                const usCountry = this.countries.find(c => c.code === 'US');
                if (usCountry && this.selectedCountry?.code !== usCountry.code) {
                    this.selectedCountry = usCountry;
                    this.countryControl.setValue(usCountry, { emitEvent: false });
                    this.updateValidators();
                    this.countryChanged.emit(usCountry);
                    console.log(`Pre-selected US for +1, waiting for area code...`);
                }
            }
            return;
        }
        
        // Sort countries by dial code length (longest first) to match more specific codes first
        const sortedCountries = [...this.countries].sort((a, b) => b.dialCode.length - a.dialCode.length);
        
        for (const country of sortedCountries) {
            if (value.startsWith(country.dialCode) && value.length >= country.dialCode.length) {
                if (this.selectedCountry?.dialCode !== country.dialCode) {
                    this.selectedCountry = country;
                    this.countryControl.setValue(country, { emitEvent: false });
                    
                    // Extract mobile number without dial code
                    const mobileNumber = value.substring(country.dialCode.length);
                    this.mobileControl.setValue(mobileNumber, { emitEvent: false });
                    
                    this.updateValidators();
                    this.countryChanged.emit(country);
                    
                    console.log(`Auto-detected country: ${country.name} (${country.dialCode}) from input: ${value}`);
                }
                break;
            }
        }
    }

    /**
     * Detects US vs Canada for NANP numbers based on area code
     * 
     * @param {string} value - Phone number starting with +1
     * @returns {Country | null} Detected country or null
     * @private
     * @memberof MobileNumberInputComponent
     */
    private detectNANPCountry(value: string): Country | null {
        // Extract area code (first 3 digits after +1)
        const numberPart = value.substring(2); // Remove +1
        const areaCode = numberPart.substring(0, 3);
        
        if (areaCode.length !== 3) {
            // Default to US if area code is incomplete
            return this.countries.find(c => c.code === 'US') || null;
        }
        
        // Canadian area codes
        const canadianAreaCodes = [
            // Alberta
            '403', '587', '825',
            // British Columbia
            '236', '250', '604', '672', '778',
            // Manitoba
            '204', '431',
            // New Brunswick
            '506',
            // Newfoundland and Labrador
            '709',
            // Northwest Territories
            '867',
            // Nova Scotia
            '782', '902',
            // Nunavut
            '867',
            // Ontario
            '226', '249', '289', '343', '365', '416', '437', '519', '548', '613', '647', '705', '807', '905',
            // Prince Edward Island
            '902',
            // Quebec
            '354', '367', '418', '438', '450', '514', '579', '581', '819', '873',
            // Saskatchewan
            '306', '639',
            // Yukon
            '867'
        ];
        
        if (canadianAreaCodes.includes(areaCode)) {
            return this.countries.find(c => c.code === 'CA') || null;
        } else {
            return this.countries.find(c => c.code === 'US') || null;
        }
    }

    /**
     * Gets the complete phone number with country code
     *
     * @returns {string} Complete phone number
     * @memberof MobileNumberInputComponent
     */
    public getFullPhoneNumber(): string {
        if (!this.selectedCountry || !this.mobileControl.value) {
            return '';
        }
        
        let mobileNumber = this.mobileControl.value.replace(/\s+/g, '');
        
        // Check if mobile number already contains the dial code
        if (mobileNumber.startsWith(this.selectedCountry.dialCode)) {
            return mobileNumber;
        }
        
        // Check if mobile number starts with dial code without +
        const dialCodeWithoutPlus = this.selectedCountry.dialCode.substring(1);
        if (mobileNumber.startsWith(dialCodeWithoutPlus)) {
            return this.selectedCountry.dialCode + mobileNumber.substring(dialCodeWithoutPlus.length);
        }
        
        // Otherwise, just prepend the dial code
        return this.selectedCountry.dialCode + mobileNumber;
    }

    // ControlValueAccessor implementation

    /**
     * Writes a value to the component (ControlValueAccessor)
     * 
     * @param {string} value - Value to write
     * @memberof MobileNumberInputComponent
     */
    public writeValue(value: string): void {
        if (value) {
            // Handle different input formats
            if (value.startsWith('+')) {
                // International format with +
                this.handleInternationalNumber(value);
            } else if (this.isLikelyInternationalNumber(value)) {
                // Likely international number without + (from API)
                this.handleInternationalNumber('+' + value);
            } else {
                // Assume it's just the mobile number without country code
                this.mobileControl.setValue(value, { emitEvent: false });
            }
        } else {
            this.mobileControl.setValue('', { emitEvent: false });
        }
    }

    /**
     * Checks if a number (without +) is likely an international number
     * 
     * @param {string} value - Number to check
     * @returns {boolean} True if likely international
     * @private
     * @memberof MobileNumberInputComponent
     */
    private isLikelyInternationalNumber(value: string): boolean {
        // Must be numeric and longer than typical mobile numbers (>10 digits)
        if (!/^\d+$/.test(value) || value.length <= 10) {
            return false;
        }
        
        // Check if it starts with common country codes
        const commonCountryCodes = [
            '1',    // NANP (US/Canada) - 11 digits total
            '44',   // UK - 12-13 digits total
            '49',   // Germany - 11-12 digits total
            '33',   // France - 11-12 digits total
            '39',   // Italy - 11-12 digits total
            '91',   // India - 12-13 digits total
            '86',   // China - 13 digits total
            '81',   // Japan - 11-12 digits total
            '82',   // South Korea - 11-12 digits total
            '55',   // Brazil - 13 digits total
            '7',    // Russia/Kazakhstan - 11 digits total
            '61',   // Australia - 11 digits total
            '27',   // South Africa - 11 digits total
        ];
        
        return commonCountryCodes.some(code => value.startsWith(code));
    }

    /**
     * Handles international number format (with +)
     * 
     * @param {string} value - International number with +
     * @private
     * @memberof MobileNumberInputComponent
     */
    private handleInternationalNumber(value: string): void {
        // Use existing auto-detection logic
        this.autoDetectCountry(value);
        
        if (this.selectedCountry && value.startsWith(this.selectedCountry.dialCode)) {
            // Extract mobile number part
            const mobileNumber = value.substring(this.selectedCountry.dialCode.length);
            this.mobileControl.setValue(mobileNumber, { emitEvent: false });
        } else {
            // If no country detected, just set the value as is
            this.mobileControl.setValue(value, { emitEvent: false });
        }
    }

    /**
     * Registers onChange callback
     *
     * @param {Function} fn - Callback function
     * @memberof MobileNumberInputComponent
     */
    public registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    /**
     * Registers onTouched callback
     *
     * @param {Function} fn - Callback function
     * @memberof MobileNumberInputComponent
     */
    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    /**
     * Sets disabled state
     *
     * @param {boolean} isDisabled - Whether component is disabled
     * @memberof MobileNumberInputComponent
     */
    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        if (isDisabled) {
            this.countryControl.disable();
            this.mobileControl.disable();
        } else {
            this.countryControl.enable();
            this.mobileControl.enable();
        }
    }
}