import { Component, Input, Output, EventEmitter, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR, Validators, AbstractControl, ValidationErrors, NG_VALIDATORS, Validator } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import * as libphonenumber from 'google-libphonenumber';
import { Country, COUNTRIES_DATA } from './countries-data';
import { GeolocationService } from './geolocation.service';
import { LocaleService } from '../../services/locale.service';

/** 
 * Enhanced mobile number validator using Google's libphonenumber library
 * Provides industry-standard validation with comprehensive error detection
 */
export function mobileNumberValidator(country: Country | null) {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value || !country) {
            return null;
        }

        const inputValue = control.value.replace(/\s+/g, '');
        let phoneNumberString = inputValue;
        
        // Get PhoneNumberUtil instance
        const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
        
        try {
            let phoneNumber: any;
            
            // Parse the phone number
            if (phoneNumberString.startsWith('+')) {
                // Parse as international number
                phoneNumber = phoneUtil.parse(phoneNumberString, null);
            } else {
                // Parse as national number for the selected country
                phoneNumber = phoneUtil.parse(phoneNumberString, country.code);
            }
            
            // Get the country code from the parsed number
            const parsedCountryCode = phoneUtil.getRegionCodeForNumber(phoneNumber);
            
            // Check if the country matches the selected country
            if (parsedCountryCode !== country.code) {
                return { wrongCountry: true };
            }
            
            // Validate the phone number
            if (!phoneUtil.isValidNumber(phoneNumber)) {
                return { invalidNumber: true };
            }
            
            // Check if it's a mobile number
            const numberType = phoneUtil.getNumberType(phoneNumber);
            if (numberType !== libphonenumber.PhoneNumberType.MOBILE && 
                numberType !== libphonenumber.PhoneNumberType.FIXED_LINE_OR_MOBILE) {
                return { notMobile: true };
            }
            
            // Additional validation for specific edge cases
            const nationalNumber = phoneNumber.getNationalNumber().toString();
            
            // Check for obviously invalid patterns (all same digits, sequential, etc.)
            if (isObviouslyInvalid(nationalNumber)) {
                return { obviouslyInvalid: true };
            }
            
            // Check for possible numbers (less strict validation)
            if (!phoneUtil.isPossibleNumber(phoneNumber)) {
                return { impossibleNumber: true };
            }
            
            return null;
            
        } catch (error) {
            // If parsing fails, return parse error
            return { parseError: true };
        }
    };
}

/**
 * Checks for obviously invalid number patterns
 * 
 * @param {string} nationalNumber - The national number to check
 * @returns {boolean} True if the number is obviously invalid
 * @private
 */
function isObviouslyInvalid(nationalNumber: string): boolean {
    // Check for all same digits (e.g., 1111111111)
    if (/^(\d)\1+$/.test(nationalNumber)) {
        return true;
    }
    
    // Check for sequential digits (e.g., 1234567890)
    if (isSequential(nationalNumber)) {
        return true;
    }
    
    // Check for common test patterns
    const testPatterns = [
        /^0+/, // All zeros at start
        /^123456/, // Common test sequence
        /^999999/, // Common test pattern
    ];
    
    return testPatterns.some(pattern => pattern.test(nationalNumber));
}

/**
 * Checks if a number is sequential
 * 
 * @param {string} number - The number to check
 * @returns {boolean} True if sequential
 * @private
 */
function isSequential(number: string): boolean {
    for (let i = 0; i < number.length - 2; i++) {
        const digit1 = parseInt(number[i]);
        const digit2 = parseInt(number[i + 1]);
        const digit3 = parseInt(number[i + 2]);
        
        if (digit2 === digit1 + 1 && digit3 === digit2 + 1) {
            // Found at least 3 sequential digits
            if (i === 0 && number.length >= 6) {
                // If it starts with sequential and is long enough, likely invalid
                return true;
            }
        }
    }
    return false;
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
        },
        {
          provide: NG_VALIDATORS,
          useExisting: forwardRef(() => MobileNumberInputComponent), // Referencing your component
          multi: true // Essential for registering multiple validators
        }
    ],
    templateUrl: './mobile-number-input.component.html',
    styleUrls: ['./mobile-number-input.component.scss']
})
export class MobileNumberInputComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {
    /** Label for the mobile input field */
    @Input() public label: string;
    
    /** Locale data for translations */
    public localeData: any = {};
    
    /** Common locale data for translations */
    public commonLocaleData: any = {};
    
    /** Whether the field is required */
    @Input() public required: boolean = false;
    
    /** Whether the field is disabled */
    @Input() public disabled: boolean = false;
    
    /** Default fallback country code (India) */
    private readonly DEFAULT_COUNTRY_CODE: string = '+91';
    
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

    /** Flag to track if country was set programmatically via writeValue */
    private countrySetProgrammatically: boolean = false;

    /** Flag to track if user has manually selected a country */
    private userHasManuallySelectedCountry: boolean = false;

    /** ControlValueAccessor callbacks */
    private onChange = (value: string) => {};
    private onTouched = () => {};

    /** List of all supported countries with their data */
    public countries: Country[] = COUNTRIES_DATA;

    /**
     * Creates an instance of MobileNumberInputComponent
     * 
     * @param {GeolocationService} geolocationService - Service for IP-based country detection
     * @param {LocaleService} localeService - Service for handling translations
     * @memberof MobileNumberInputComponent
     */
    constructor(
        private geolocationService: GeolocationService,
        private localeService: LocaleService
    ) {}

    /**
     * Component initialization
     *
     * @memberof MobileNumberInputComponent
     */
    public ngOnInit(): void {
        this.loadTranslations();
        this.setupFormControls();
    }
    
    /**
     * Debug method to clear geolocation cache
     * 
     * @public
     * @memberof MobileNumberInputComponent
     */
    public clearGeolocationCache(): void {
        this.geolocationService.clearCache();
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
     * Loads translation data for the component
     *
     * @private
     * @memberof MobileNumberInputComponent
     */
    private loadTranslations(): void {
        this.localeService.getLocale('mobile-number-input', this.localeService.language || 'en')
            .pipe(takeUntil(this.destroyed$))
            .subscribe(response => {
                if (response) {
                    this.localeData = response;
                    this.setDefaultLabel();
                }
            });
        
        // Load common locale data
        this.commonLocaleData = this.localeService.commonLocale;
    }

     /**
     * Validator implementation for ControlValueAccessor
     * Validates the mobile number using Google's libphonenumber
     * 
     * @param {AbstractControl} control - Form control to validate
     * @returns {ValidationErrors | null} Validation errors or null if valid
     * @memberof MobileNumberInputComponent
     */
    public validate(control: AbstractControl): ValidationErrors | null {
        // If no value and required, return required error
        if (!control.value) {
            return this.required ? { required: true } : null;
        }

        // If no country selected, can't validate
        if (!this.selectedCountry) {
            return { noCountrySelected: true };
        }

        try {
            const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
            const fullNumber = this.getFullPhoneNumber();
            
            // Parse the phone number
            const phoneNumber = phoneUtil.parse(fullNumber, this.selectedCountry.code);
            
            // Check if the number is valid
            if (!phoneUtil.isValidNumber(phoneNumber)) {
                return { invalidNumber: true };
            }
            
            // Check if it's a mobile number
            const numberType = phoneUtil.getNumberType(phoneNumber);
            if (numberType !== libphonenumber.PhoneNumberType.MOBILE && 
                numberType !== libphonenumber.PhoneNumberType.FIXED_LINE_OR_MOBILE) {
                return { notMobile: true };
            }
            
            // Check if number belongs to the selected country
            const numberRegion = phoneUtil.getRegionCodeForNumber(phoneNumber);
            if (numberRegion !== this.selectedCountry.code) {
                return { wrongCountry: true };
            }
            
            return null; // Valid number
            
        } catch (error) {
            // If parsing fails, it's an invalid number format
            return { parseError: true };
        }
    }

    /**
     * Sets default label if not provided via Input
     *
     * @private
     * @memberof MobileNumberInputComponent
     */
    private setDefaultLabel(): void {
        if (!this.label && this.localeData?.mobile_number) {
            this.label = this.localeData.mobile_number;
        }
    }

    /**
     * Gets translated error message with interpolation
     *
     * @param {string} key - Translation key
     * @param {any} params - Parameters for interpolation
     * @returns {string} Translated message
     * @memberof MobileNumberInputComponent
     */
    public getTranslatedMessage(key: string, params?: any): string {
        let message = this.localeData?.[key] || key;
        
        if (params) {
            Object.keys(params).forEach(param => {
                message = message.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
            });
        }
        
        return message;
    }

    /**
     * Detects user's country for writeValue method (cache-first approach)
     *
     * @private
     * @memberof MobileNumberInputComponent
     */
    private detectUserCountryForWriteValue(): void {
        // Don't override if user has manually selected a country
        if (this.countrySetProgrammatically || this.userHasManuallySelectedCountry) {
            return;
        }
        this.performCountryDetection();
    }

    /**
     * Performs the actual country detection logic (cache-first approach)
     * Only executes when mobile number field is empty
     *
     * @private
     * @memberof MobileNumberInputComponent
     */
    private performCountryDetection(): void {
        this.geolocationService.getCountryData()
            .pipe(takeUntil(this.destroyed$))
            .subscribe(location => {
                // Only perform country detection if:
                // 1. Mobile number field is empty
                // 2. User hasn't manually selected a country
                if (location && location.countryCode && !this.mobileControl.value && !this.userHasManuallySelectedCountry) {
                    // Use the new geolocation service method that handles all duplicate cases
                    const detectedCountry = this.geolocationService.mapCountryCodeToCountry(location.countryCode);
                    
                    if (detectedCountry) {
                        this.selectedCountry = detectedCountry;
                        this.countryControl.setValue(detectedCountry, { emitEvent: false });
                        this.updateValidators();
                        return;
                    }
                }
            });
    }

    /**
     * Initializes the default country selection to India (+91)
     *
     * @private
     * @memberof MobileNumberInputComponent
     */
    private initializeDefaultCountry(): void {
        const defaultCountry = this.countries.find(country => country.dialCode === this.DEFAULT_COUNTRY_CODE);
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
                    
                    // Track manual user selections to prevent auto-detection override
                    if (!this.countrySetProgrammatically) {
                        // This is a manual user selection via dropdown
                        this.userHasManuallySelectedCountry = true;
                    }
                    
                    // Reset programmatic flag after change is processed
                    this.countrySetProgrammatically = false;
                    
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
        
        // Mark as manual user selection to prevent auto-detection override
        this.userHasManuallySelectedCountry = true;
        this.countrySetProgrammatically = false;
        
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
                value.length > 15) { // Use reasonable max length for international numbers
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
        
        // Sort countries by dial code length (longest first) to match more specific codes first
        // This ensures +1340 (US Virgin Islands) is matched before +1 (US)
        const sortedCountries = [...this.countries].sort((a, b) => b.dialCode.length - a.dialCode.length);
        
        // First, try to find an exact match with longer dial codes
        for (const country of sortedCountries) {
            if (value.startsWith(country.dialCode) && value.length >= country.dialCode.length) {
                // For longer dial codes (like +1340), we need exact match
                if (country.dialCode.length > 2) {
                    // Only select if we have the complete dial code
                    if (value.length >= country.dialCode.length) {
                        if (this.selectedCountry?.dialCode !== country.dialCode) {
                            this.selectedCountry = country;
                            this.countryControl.setValue(country, { emitEvent: false });
                            this.countrySetProgrammatically = true;
                            
                            // Extract mobile number without dial code
                            const mobileNumber = value.substring(country.dialCode.length);
                            this.mobileControl.setValue(mobileNumber, { emitEvent: false });
                            
                            this.updateValidators();
                            this.countryChanged.emit(country);
                        }
                        return; // Found exact match, stop here
                    }
                }
            }
        }
        
        // If no longer dial code matched, handle shorter ones (like +1 for NANP)
        // Special handling for NANP (+1) - detect US vs Canada by area code
        if (value.startsWith('+1')) {
            // Check if this could be a longer dial code (like +1340)
            // Don't auto-select +1 if the user might be typing a longer code
            const potentialLongerCodes = sortedCountries.filter(c => 
                c.dialCode.startsWith('+1') && c.dialCode.length > 2
            );
            
            // Check if the current input could match any longer dial codes
            const couldBeLongerCode = potentialLongerCodes.some(c => 
                c.dialCode.startsWith(value) || value.startsWith(c.dialCode.substring(0, value.length))
            );
            
            if (couldBeLongerCode && value.length < 6) {
                // Don't auto-select yet, user might be typing a longer dial code
                return;
            }
            
            if (value.length >= 5) { // Need at least +1XX for area code detection
                const detectedCountry = this.detectNANPCountry(value);
                if (detectedCountry && this.selectedCountry?.code !== detectedCountry.code) {
                    this.selectedCountry = detectedCountry;
                    this.countryControl.setValue(detectedCountry, { emitEvent: false });
                    this.countrySetProgrammatically = true;
                    
                    // Only extract mobile number if we have sufficient digits for area code detection
                    if (value.length >= 5) {
                        const mobileNumber = value.substring(detectedCountry.dialCode.length);
                        this.mobileControl.setValue(mobileNumber, { emitEvent: false });
                    }
                    
                    this.updateValidators();
                    this.countryChanged.emit(detectedCountry);
                }
            } else if (value.length >= 6) {
                // Only default to US if we're sure it's not a longer dial code
                const usCountry = this.countries.find(c => c.code === 'US');
                if (usCountry && this.selectedCountry?.code !== usCountry.code) {
                    this.selectedCountry = usCountry;
                    this.countryControl.setValue(usCountry, { emitEvent: false });
                    this.countrySetProgrammatically = true;
                    this.updateValidators();
                    this.countryChanged.emit(usCountry);
                }
            }
            return;
        }
        
        // Special handling for +7 (Russia/Kazakhstan) - prioritize Russia as requested
        if (value.startsWith('+7')) {
            // Always default to Russia first for +7 (user preference)
            const russiaCountry = this.countries.find(c => c.code === 'RU');
            
            if (value.length >= 5) { // Need at least +7XX for area code detection
                const detectedCountry = this.detectRussiaKazakhstanCountry(value);
                if (detectedCountry && this.selectedCountry?.code !== detectedCountry.code) {
                    this.selectedCountry = detectedCountry;
                    this.countryControl.setValue(detectedCountry, { emitEvent: false });
                    this.countrySetProgrammatically = true;
                    
                    // Extract mobile number without dial code
                    const mobileNumber = value.substring(detectedCountry.dialCode.length);
                    this.mobileControl.setValue(mobileNumber, { emitEvent: false });
                    
                    this.updateValidators();
                    this.countryChanged.emit(detectedCountry);
                }
            } else if (value.length >= 2 && russiaCountry) {
                // Immediately default to Russia for +7 (user preference for priority)
                if (this.selectedCountry?.code !== russiaCountry.code) {
                    this.selectedCountry = russiaCountry;
                    this.countryControl.setValue(russiaCountry, { emitEvent: false });
                    this.countrySetProgrammatically = true;
                    this.updateValidators();
                    this.countryChanged.emit(russiaCountry);
                }
            }
            return;
        }
        
        // Special handling for +44 (UK and territories) - prioritize UK
        if (value.startsWith('+44')) {
            const ukCountry = this.countries.find(c => c.code === 'GB');
            if (ukCountry && this.selectedCountry?.code !== ukCountry.code) {
                this.selectedCountry = ukCountry;
                this.countryControl.setValue(ukCountry, { emitEvent: false });
                this.countrySetProgrammatically = true;
                
                // Extract mobile number without dial code
                const mobileNumber = value.substring(ukCountry.dialCode.length);
                this.mobileControl.setValue(mobileNumber, { emitEvent: false });
                
                this.updateValidators();
                this.countryChanged.emit(ukCountry);
            }
            return;
        }
        
        // Special handling for +39 (Italy and Vatican) - prioritize Italy
        if (value.startsWith('+39')) {
            const italyCountry = this.countries.find(c => c.code === 'IT');
            if (italyCountry && this.selectedCountry?.code !== italyCountry.code) {
                this.selectedCountry = italyCountry;
                this.countryControl.setValue(italyCountry, { emitEvent: false });
                this.countrySetProgrammatically = true;
                
                // Extract mobile number without dial code
                const mobileNumber = value.substring(italyCountry.dialCode.length);
                this.mobileControl.setValue(mobileNumber, { emitEvent: false });
                
                this.updateValidators();
                this.countryChanged.emit(italyCountry);
            }
            return;
        }
        
        // Special handling for +47 (Norway and Svalbard) - prioritize Norway
        if (value.startsWith('+47')) {
            const norwayCountry = this.countries.find(c => c.code === 'NO');
            if (norwayCountry && this.selectedCountry?.code !== norwayCountry.code) {
                this.selectedCountry = norwayCountry;
                this.countryControl.setValue(norwayCountry, { emitEvent: false });
                this.countrySetProgrammatically = true;
                
                // Extract mobile number without dial code
                const mobileNumber = value.substring(norwayCountry.dialCode.length);
                this.mobileControl.setValue(mobileNumber, { emitEvent: false });
                
                this.updateValidators();
                this.countryChanged.emit(norwayCountry);
            }
            return;
        }
        
        // Special handling for +64 (New Zealand and territories) - prioritize New Zealand
        if (value.startsWith('+64')) {
            const nzCountry = this.countries.find(c => c.code === 'NZ');
            if (nzCountry && this.selectedCountry?.code !== nzCountry.code) {
                this.selectedCountry = nzCountry;
                this.countryControl.setValue(nzCountry, { emitEvent: false });
                this.countrySetProgrammatically = true;
                
                // Extract mobile number without dial code
                const mobileNumber = value.substring(nzCountry.dialCode.length);
                this.mobileControl.setValue(mobileNumber, { emitEvent: false });
                
                this.updateValidators();
                this.countryChanged.emit(nzCountry);
            }
            return;
        }
        
        // Special handling for +212 (Morocco and Western Sahara) - prioritize Morocco
        if (value.startsWith('+212')) {
            const moroccoCountry = this.countries.find(c => c.code === 'MA');
            if (moroccoCountry && this.selectedCountry?.code !== moroccoCountry.code) {
                this.selectedCountry = moroccoCountry;
                this.countryControl.setValue(moroccoCountry, { emitEvent: false });
                this.countrySetProgrammatically = true;
                
                // Extract mobile number without dial code
                const mobileNumber = value.substring(moroccoCountry.dialCode.length);
                this.mobileControl.setValue(mobileNumber, { emitEvent: false });
                
                this.updateValidators();
                this.countryChanged.emit(moroccoCountry);
            }
            return;
        }
        
        // Special handling for +262 (Reunion and Mayotte) - prioritize Reunion
        if (value.startsWith('+262')) {
            const reunionCountry = this.countries.find(c => c.code === 'RE');
            if (reunionCountry && this.selectedCountry?.code !== reunionCountry.code) {
                this.selectedCountry = reunionCountry;
                this.countryControl.setValue(reunionCountry, { emitEvent: false });
                this.countrySetProgrammatically = true;
                
                // Extract mobile number without dial code
                const mobileNumber = value.substring(reunionCountry.dialCode.length);
                this.mobileControl.setValue(mobileNumber, { emitEvent: false });
                
                this.updateValidators();
                this.countryChanged.emit(reunionCountry);
            }
            return;
        }
        
        // Handle other dial codes (non-duplicate cases)
        for (const country of sortedCountries) {
            if (value.startsWith(country.dialCode) && value.length >= country.dialCode.length) {
                if (this.selectedCountry?.dialCode !== country.dialCode) {
                    this.selectedCountry = country;
                    this.countryControl.setValue(country, { emitEvent: false });
                    this.countrySetProgrammatically = true;
                    
                    // Extract mobile number without dial code
                    const mobileNumber = value.substring(country.dialCode.length);
                    this.mobileControl.setValue(mobileNumber, { emitEvent: false });
                    
                    this.updateValidators();
                    this.countryChanged.emit(country);
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
     * Detects Russia vs Kazakhstan for +7 numbers based on area code
     * 
     * @param {string} value - Phone number starting with +7
     * @returns {Country | null} Detected country or null
     * @private
     * @memberof MobileNumberInputComponent
     */
    private detectRussiaKazakhstanCountry(value: string): Country | null {
        // Extract area code (first 3 digits after +7)
        const numberPart = value.substring(2); // Remove +7
        const areaCode = numberPart.substring(0, 3);
        
        if (areaCode.length !== 3) {
            // Default to Russia if area code is incomplete (more common)
            return this.countries.find(c => c.code === 'RU') || null;
        }
        
        // Kazakhstan area codes (6xx and 7xx ranges as per ITU agreement)
        const kazakhstanAreaCodes = [
            // 6xx range for Kazakhstan
            '600', '601', '602', '603', '604', '605', '606', '607', '608', '609',
            '610', '611', '612', '613', '614', '615', '616', '617', '618', '619',
            '620', '621', '622', '623', '624', '625', '626', '627', '628', '629',
            '630', '631', '632', '633', '634', '635', '636', '637', '638', '639',
            '640', '641', '642', '643', '644', '645', '646', '647', '648', '649',
            '650', '651', '652', '653', '654', '655', '656', '657', '658', '659',
            '660', '661', '662', '663', '664', '665', '666', '667', '668', '669',
            '670', '671', '672', '673', '674', '675', '676', '677', '678', '679',
            '680', '681', '682', '683', '684', '685', '686', '687', '688', '689',
            '690', '691', '692', '693', '694', '695', '696', '697', '698', '699',
            // 7xx range for Kazakhstan
            '700', '701', '702', '703', '704', '705', '706', '707', '708', '709',
            '710', '711', '712', '713', '714', '715', '716', '717', '718', '719',
            '720', '721', '722', '723', '724', '725', '726', '727', '728', '729',
            '730', '731', '732', '733', '734', '735', '736', '737', '738', '739',
            '740', '741', '742', '743', '744', '745', '746', '747', '748', '749',
            '750', '751', '752', '753', '754', '755', '756', '757', '758', '759',
            '760', '761', '762', '763', '764', '765', '766', '767', '768', '769',
            '770', '771', '772', '773', '774', '775', '776', '777', '778', '779',
            '780', '781', '782', '783', '784', '785', '786', '787', '788', '789',
            '790', '791', '792', '793', '794', '795', '796', '797', '798', '799'
        ];
        
        if (kazakhstanAreaCodes.includes(areaCode)) {
            return this.countries.find(c => c.code === 'KZ') || null;
        } else {
            // All other area codes belong to Russia
            return this.countries.find(c => c.code === 'RU') || null;
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
        
        // Check if mobile number already contains the dial code with +
        if (mobileNumber.startsWith(this.selectedCountry.dialCode)) {
            return mobileNumber;
        }
        
        // Check if mobile number starts with dial code without + AND is longer than expected
        // This prevents treating valid mobile numbers that happen to start with dial code digits
        // as having duplicate dial codes
        const dialCodeWithoutPlus = this.selectedCountry.dialCode.substring(1);
        if (mobileNumber.startsWith(dialCodeWithoutPlus) && 
            mobileNumber.length > 15) { // Use reasonable max length for international numbers
            // Only remove dial code if the number is longer than expected (indicating duplicate)
            return this.selectedCountry.dialCode + mobileNumber.substring(dialCodeWithoutPlus.length);
        }
        
        // Otherwise, just prepend the dial code (normal case)
        return this.selectedCountry.dialCode + mobileNumber;
    }

    // ControlValueAccessor implementation

    /**
     * Registers a callback function to call when the value changes (ControlValueAccessor)
     * 
     * @param {(value: string) => void} fn - Callback function
     * @memberof MobileNumberInputComponent
     */
    public registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    /**
     * Registers a callback function to call when the component is touched (ControlValueAccessor)
     * 
     * @param {() => void} fn - Callback function
     * @memberof MobileNumberInputComponent
     */
    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    /**
     * Sets the disabled state of the component (ControlValueAccessor)
     * 
     * @param {boolean} isDisabled - Whether the component should be disabled
     * @memberof MobileNumberInputComponent
     */
    public setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.mobileControl.disable({ emitEvent: false });
            this.countryControl.disable({ emitEvent: false });
        } else {
            this.mobileControl.enable({ emitEvent: false });
            this.countryControl.enable({ emitEvent: false });
        }
    }

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
                // Don't set programmatic flag for local numbers
            }
        } else {
            this.mobileControl.setValue('', { emitEvent: false });
            // Reset the programmatic flag when value is cleared
            this.countrySetProgrammatically = false;
            // Try to detect country from cache first, then fallback to default
            this.detectUserCountryForWriteValue();
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
        
        // Check if it starts with any valid country codes using optimized method
        const commonCountryCodes = this.getSortedDialCodes(true);
        
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
        
        // Check if country was detected and update accordingly
        if (this.selectedCountry && value.startsWith(this.selectedCountry.dialCode)) {
            // Mark that country was set programmatically
            this.countrySetProgrammatically = true;
            
            // Extract mobile number part
            const mobileNumber = value.substring(this.selectedCountry.dialCode.length);
            this.mobileControl.setValue(mobileNumber, { emitEvent: false });
        } else {
            // Try to find matching country manually if auto-detection failed
            const detectedCountry = this.findCountryByDialCode(value);
            if (detectedCountry) {
                this.selectedCountry = detectedCountry;
                this.countryControl.setValue(detectedCountry, { emitEvent: false });
                this.updateValidators();
                this.countryChanged.emit(detectedCountry);
                
                // Mark that country was set programmatically
                this.countrySetProgrammatically = true;
                
                // Extract mobile number part
                const mobileNumber = value.substring(detectedCountry.dialCode.length);
                this.mobileControl.setValue(mobileNumber, { emitEvent: false });
            } else {
                // If no country detected, just set the value as is
                this.mobileControl.setValue(value, { emitEvent: false });
            }
        }
    }

    /**
     * Gets dial codes sorted by length (longest first) for better matching
     * 
     * @param {boolean} removePrefix - Whether to remove '+' prefix from dial codes
     * @returns {string[]} Sorted dial codes
     * @private
     * @memberof MobileNumberInputComponent
     */
    private getSortedDialCodes(removePrefix: boolean = false): string[] {
        return COUNTRIES_DATA
            .map(country => removePrefix ? country.dialCode.replace('+', '') : country.dialCode)
            .sort((a, b) => b.length - a.length);
    }

    /**
     * Finds a country by matching dial code from the beginning of a phone number
     * 
     * @param {string} phoneNumber - Phone number starting with +
     * @returns {Country | null} Matching country or null
     * @private
     * @memberof MobileNumberInputComponent
     */
    private findCountryByDialCode(phoneNumber: string): Country | null {
        if (!phoneNumber.startsWith('+')) {
            return null;
        }
        
        // Use optimized sorted dial codes for matching
        const sortedDialCodes = this.getSortedDialCodes();
        
        for (const dialCode of sortedDialCodes) {
            if (phoneNumber.startsWith(dialCode)) {
                return this.countries.find(country => country.dialCode === dialCode) || null;
            }
        }
        
        return null;
    }


    /**
     * Gets formatted phone number using libphonenumber
     *
     * @param {PhoneNumberFormat} format - Format type (INTERNATIONAL, NATIONAL, E164, etc.)
     * @returns {string} Formatted phone number
     * @memberof MobileNumberInputComponent
     */
    public getFormattedPhoneNumber(format: any = libphonenumber.PhoneNumberFormat.INTERNATIONAL): string {
        if (!this.selectedCountry || !this.mobileControl.value) {
            return '';
        }

        const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
        
        try {
            const phoneNumber = phoneUtil.parse(this.mobileControl.value, this.selectedCountry.code);
            
            if (phoneUtil.isValidNumber(phoneNumber)) {
                return phoneUtil.format(phoneNumber, format);
            }
        } catch (error) {
            // If parsing fails, return the original value
        }
        
        return this.mobileControl.value;
    }

    /**
     * Gets E164 format of the phone number (e.g., +447700900123)
     *
     * @returns {string} E164 formatted phone number
     * @memberof MobileNumberInputComponent
     */
    public getE164PhoneNumber(): string {
        return this.getFormattedPhoneNumber(libphonenumber.PhoneNumberFormat.E164);
    }

    /**
     * Gets national format of the phone number (e.g., 07700 900123)
     *
     * @returns {string} National formatted phone number
     * @memberof MobileNumberInputComponent
     */
    public getNationalPhoneNumber(): string {
        return this.getFormattedPhoneNumber(libphonenumber.PhoneNumberFormat.NATIONAL);
    }

    /**
     * Gets international format of the phone number (e.g., +44 7700 900123)
     *
     * @returns {string} International formatted phone number
     * @memberof MobileNumberInputComponent
     */
    public getInternationalPhoneNumber(): string {
        return this.getFormattedPhoneNumber(libphonenumber.PhoneNumberFormat.INTERNATIONAL);
    }

    /**
     * Validates if the current phone number is valid using libphonenumber
     *
     * @returns {boolean} True if the phone number is valid
     * @memberof MobileNumberInputComponent
     */
    public isPhoneNumberValid(): boolean {
        if (!this.selectedCountry || !this.mobileControl.value) {
            return false;
        }

        const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
        
        try {
            const phoneNumber = phoneUtil.parse(this.mobileControl.value, this.selectedCountry.code);
            return phoneUtil.isValidNumber(phoneNumber);
        } catch (error) {
            return false;
        }
    }

    /**
     * Gets the phone number type (MOBILE, FIXED_LINE, etc.)
     *
     * @returns {PhoneNumberType | null} Phone number type or null if invalid
     * @memberof MobileNumberInputComponent
     */
    public getPhoneNumberType(): any | null {
        if (!this.selectedCountry || !this.mobileControl.value) {
            return null;
        }

        const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
        
        try {
            const phoneNumber = phoneUtil.parse(this.mobileControl.value, this.selectedCountry.code);
            return phoneUtil.getNumberType(phoneNumber);
        } catch (error) {
            return null;
        }
    }

    /**
     * Auto-formats the input as user types (optional feature)
     *
     * @param {boolean} enable - Whether to enable auto-formatting
     * @memberof MobileNumberInputComponent
     */
    public enableAutoFormatting(enable: boolean = true): void {
        if (enable) {
            this.mobileControl.valueChanges.pipe(
                takeUntil(this.destroyed$),
                distinctUntilChanged()
            ).subscribe(value => {
                if (value && this.selectedCountry) {
                    const formatted = this.getNationalPhoneNumber();
                    if (formatted !== value) {
                        this.mobileControl.setValue(formatted, { emitEvent: false });
                    }
                }
            });
        }
    }
}