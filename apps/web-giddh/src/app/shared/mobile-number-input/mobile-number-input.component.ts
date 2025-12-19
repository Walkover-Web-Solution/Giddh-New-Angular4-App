import { Component, Input, Output, EventEmitter, forwardRef, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR, Validators, AbstractControl, ValidationErrors, NG_VALIDATORS, Validator } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule, MatSelect } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import * as libphonenumber from 'google-libphonenumber';
import { Country, COUNTRIES_DATA } from './countries-data';
import { GeolocationService } from './geolocation.service';
import { LocaleService } from '../../services/locale.service';
import { A11yModule } from '@angular/cdk/a11y';
import { KeyboardNavigationModule } from '../helpers/directives/enter-next/keyboard-navigation.module';

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
        let phoneNumberString = country.dialCode + inputValue;
        
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
        HttpClientModule,
        A11yModule,
        KeyboardNavigationModule
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
    /** ViewChild reference to mobile input element */
    @ViewChild('mobileInput', { static: false }) public mobileInput: ElementRef<HTMLInputElement>;
    
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
    
    /** Reference to the country dropdown MatSelect */
    @ViewChild('countrySelect', { static: false }) private countrySelect: MatSelect;
    
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
        
        // Focus the mobile input after country change
        this.focusMobileInput();
    }
    
    /**
     * Focuses the mobile input element
     * 
     * @memberof MobileNumberInputComponent
     */
    private focusMobileInput(): void {
        if (this.mobileInput?.nativeElement) {
            setTimeout(() => {
                this.mobileInput.nativeElement.focus();
            }, 100);
        }
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
     * Handles focus event on mobile number input field
     * Closes the country dropdown if it's open
     * 
     * @memberof MobileNumberInputComponent
     */
    public onMobileFocus(): void {
        if (this.countrySelect && this.countrySelect.panelOpen) {
            this.countrySelect.close();
        }
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
     * Auto-detects country based on dial code and area code using comprehensive mapping
     * This method handles all duplicate dial code cases systematically
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
        
        // First, try comprehensive area code detection for duplicate dial codes
        const detectedCountry = this.detectCountryByAreaCode(value);
        
        if (detectedCountry) {
            // Found a country using area code detection
            if (this.selectedCountry?.code !== detectedCountry.code) {
                this.selectedCountry = detectedCountry;
                this.countryControl.setValue(detectedCountry, { emitEvent: false });
                this.countrySetProgrammatically = true;
                
                // Extract mobile number without dial code
                const mobileNumber = value.substring(detectedCountry.dialCode.length);
                this.mobileControl.setValue(mobileNumber, { emitEvent: false });
                
                this.updateValidators();
                this.countryChanged.emit(detectedCountry);
            }
            return;
        }
        
        // If area code detection didn't work, fall back to standard dial code matching
        // Sort countries by dial code length (longest first) to match more specific codes first
        const sortedCountries = [...this.countries].sort((a, b) => b.dialCode.length - a.dialCode.length);
        
        // Handle longer dial codes first (like +1340, +1684, etc.)
        for (const country of sortedCountries) {
            if (value.startsWith(country.dialCode) && value.length >= country.dialCode.length) {
                // For longer dial codes (4+ characters), require exact match
                if (country.dialCode.length > 3) {
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
        
        // Handle shorter dial codes (2-3 characters) with caution for potential longer codes
        for (const country of sortedCountries) {
            if (value.startsWith(country.dialCode) && value.length >= country.dialCode.length) {
                // Check if this could be part of a longer dial code
                const potentialLongerCodes = sortedCountries.filter(c => 
                    c.dialCode.startsWith(country.dialCode) && c.dialCode.length > country.dialCode.length
                );
                
                // If there are potential longer codes and input is short, wait for more input
                if (potentialLongerCodes.length > 0 && value.length < 6) {
                    const couldBeLongerCode = potentialLongerCodes.some(c => 
                        value.startsWith(c.dialCode.substring(0, Math.min(value.length, c.dialCode.length)))
                    );
                    
                    if (couldBeLongerCode) {
                        continue; // Don't select yet, might be a longer code
                    }
                }
                
                // Safe to select this country
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
                return;
            }
        }
    }

    /**
     * Comprehensive area code mapping for all countries with duplicate dial codes
     * Based on ITU-T recommendations and official telecommunications data
     * Updated with complete verification table from official sources
     * 
     * @private
     * @memberof MobileNumberInputComponent
     */
    private readonly AREA_CODE_MAPPINGS: { [dialCode: string]: { [areaCode: string]: string } } = {
        // +1 NANP (North American Numbering Plan)
        '+1': {
            // Canada area codes
            '204': 'CA', '226': 'CA', '236': 'CA', '249': 'CA', '250': 'CA', '289': 'CA', '306': 'CA', '343': 'CA',
            '354': 'CA', '365': 'CA', '367': 'CA', '403': 'CA', '416': 'CA', '418': 'CA', '431': 'CA', '437': 'CA',
            '438': 'CA', '450': 'CA', '506': 'CA', '514': 'CA', '519': 'CA', '548': 'CA', '579': 'CA', '581': 'CA',
            '587': 'CA', '604': 'CA', '613': 'CA', '639': 'CA', '647': 'CA', '672': 'CA', '705': 'CA', '709': 'CA',
            '778': 'CA', '782': 'CA', '807': 'CA', '819': 'CA', '825': 'CA', '867': 'CA', '873': 'CA', '902': 'CA', '905': 'CA',
            // Caribbean and territories
            '242': 'BS', '246': 'BB', '264': 'AI', '268': 'AG', '284': 'VG', '340': 'VI', '345': 'KY',
            '441': 'BM', '473': 'GD', '649': 'TC', '658': 'JM', '664': 'MS', '670': 'MP', '671': 'GU',
            '684': 'AS', '721': 'SX', '758': 'LC', '767': 'DM', '784': 'VC', '787': 'PR', '809': 'DO',
            '829': 'DO', '849': 'DO', '868': 'TT', '869': 'KN', '876': 'JM', '939': 'PR'
            // All other +1 numbers default to US
        },
        // +7 Russia, Kazakhstan, and territories
        '+7': {
            // Kazakhstan area codes (6xx and 7xx ranges per ITU agreement)
            '600': 'KZ', '601': 'KZ', '602': 'KZ', '603': 'KZ', '604': 'KZ', '605': 'KZ', '606': 'KZ', '607': 'KZ',
            '608': 'KZ', '609': 'KZ', '610': 'KZ', '611': 'KZ', '612': 'KZ', '613': 'KZ', '614': 'KZ', '615': 'KZ',
            '616': 'KZ', '617': 'KZ', '618': 'KZ', '619': 'KZ', '620': 'KZ', '621': 'KZ', '622': 'KZ', '623': 'KZ',
            '624': 'KZ', '625': 'KZ', '626': 'KZ', '627': 'KZ', '628': 'KZ', '629': 'KZ', '630': 'KZ', '631': 'KZ',
            '632': 'KZ', '633': 'KZ', '634': 'KZ', '635': 'KZ', '636': 'KZ', '637': 'KZ', '638': 'KZ', '639': 'KZ',
            '640': 'KZ', '641': 'KZ', '642': 'KZ', '643': 'KZ', '644': 'KZ', '645': 'KZ', '646': 'KZ', '647': 'KZ',
            '648': 'KZ', '649': 'KZ', '650': 'KZ', '651': 'KZ', '652': 'KZ', '653': 'KZ', '654': 'KZ', '655': 'KZ',
            '656': 'KZ', '657': 'KZ', '658': 'KZ', '659': 'KZ', '660': 'KZ', '661': 'KZ', '662': 'KZ', '663': 'KZ',
            '664': 'KZ', '665': 'KZ', '666': 'KZ', '667': 'KZ', '668': 'KZ', '669': 'KZ', '670': 'KZ', '671': 'KZ',
            '672': 'KZ', '673': 'KZ', '674': 'KZ', '675': 'KZ', '676': 'KZ', '677': 'KZ', '678': 'KZ', '679': 'KZ',
            '680': 'KZ', '681': 'KZ', '682': 'KZ', '683': 'KZ', '684': 'KZ', '685': 'KZ', '686': 'KZ', '687': 'KZ',
            '688': 'KZ', '689': 'KZ', '690': 'KZ', '691': 'KZ', '692': 'KZ', '693': 'KZ', '694': 'KZ', '695': 'KZ',
            '696': 'KZ', '697': 'KZ', '698': 'KZ', '699': 'KZ', '700': 'KZ', '701': 'KZ', '702': 'KZ', '703': 'KZ',
            '704': 'KZ', '705': 'KZ', '706': 'KZ', '707': 'KZ', '708': 'KZ', '709': 'KZ', '710': 'KZ', '711': 'KZ',
            '712': 'KZ', '713': 'KZ', '714': 'KZ', '715': 'KZ', '716': 'KZ', '717': 'KZ', '718': 'KZ', '719': 'KZ',
            '720': 'KZ', '721': 'KZ', '722': 'KZ', '723': 'KZ', '724': 'KZ', '725': 'KZ', '726': 'KZ', '727': 'KZ',
            '728': 'KZ', '729': 'KZ', '730': 'KZ', '731': 'KZ', '732': 'KZ', '733': 'KZ', '734': 'KZ', '735': 'KZ',
            '736': 'KZ', '737': 'KZ', '738': 'KZ', '739': 'KZ', '740': 'KZ', '741': 'KZ', '742': 'KZ', '743': 'KZ',
            '744': 'KZ', '745': 'KZ', '746': 'KZ', '747': 'KZ', '748': 'KZ', '749': 'KZ', '750': 'KZ', '751': 'KZ',
            '752': 'KZ', '753': 'KZ', '754': 'KZ', '755': 'KZ', '756': 'KZ', '757': 'KZ', '758': 'KZ', '759': 'KZ',
            '760': 'KZ', '761': 'KZ', '762': 'KZ', '763': 'KZ', '764': 'KZ', '765': 'KZ', '766': 'KZ', '767': 'KZ',
            '768': 'KZ', '769': 'KZ', '770': 'KZ', '771': 'KZ', '772': 'KZ', '773': 'KZ', '774': 'KZ', '775': 'KZ',
            '776': 'KZ', '777': 'KZ', '778': 'KZ', '779': 'KZ', '780': 'KZ', '781': 'KZ', '782': 'KZ', '783': 'KZ',
            '784': 'KZ', '785': 'KZ', '786': 'KZ', '787': 'KZ', '788': 'KZ', '789': 'KZ', '790': 'KZ', '791': 'KZ',
            '792': 'KZ', '793': 'KZ', '794': 'KZ', '795': 'KZ', '796': 'KZ', '797': 'KZ', '798': 'KZ', '799': 'KZ'
            // All other +7 numbers default to Russia (RU)
        },
        // +20 Egypt and Western Sahara
        '+20': {
            '5288': 'EH', '5289': 'EH' // Western Sahara area codes
            // All other +20 numbers default to Egypt (EG)
        },
        // +27 South Africa and territories
        '+27': {
            // South Africa uses various city codes (11=Johannesburg, 21=Cape Town, etc.)
            // Prince Edward Islands are minor case, default to South Africa
        },
        // +30 Greece and Mount Athos
        '+30': {
            '23770': 'GR' // Mount Athos (autonomous monastic state, but still Greece)
            // All other +30 numbers default to Greece (GR)
        },
        // +31 Netherlands and Caribbean Netherlands
        '+31': {
            '7': 'BQ' // Caribbean Netherlands (Bonaire, Saba, Sint Eustatius)
            // All other +31 numbers default to Netherlands (NL)
        },
        // +33 France and overseas territories
        '+33': {
            // All French overseas territories use +33 with geographic prefixes
            // Default to France (FR) as they're all part of France
        },
        // +34 Spain, Ceuta and Melilla
        '+34': {
            '856': 'ES', '952': 'ES' // Ceuta (856) and Melilla (952) - autonomous cities
            // All other +34 numbers default to Spain (ES)
        },
        // +39 Italy, Vatican City, San Marino
        '+39': {
            '06698': 'VA', '0549': 'SM' // Vatican City and San Marino
            // All other +39 numbers default to Italy (IT)
        },
        // +41 Switzerland and Liechtenstein
        '+41': {
            '75': 'LI' // Liechtenstein (Vaduz area code)
            // All other +41 numbers default to Switzerland (CH)
        },
        // +44 UK and Crown Dependencies
        '+44': {
            // Landline area codes
            '1481': 'GG', '1534': 'JE', '1624': 'IM', '28': 'GB', // Northern Ireland uses 28
            // Mobile prefixes
            '7524': 'IM', '7624': 'IM', '7924': 'IM', // Isle of Man mobile
            '7781': 'GG', '7839': 'GG', '7911': 'GG', // Guernsey mobile  
            '7797': 'JE', '7829': 'JE', '7937': 'JE'  // Jersey mobile
            // All other +44 numbers default to United Kingdom (GB)
        },
        // +47 Norway, Svalbard, Jan Mayen
        '+47': {
            '79': 'SJ' // Svalbard and Jan Mayen
            // All other +47 numbers default to Norway (NO)
        },
        // +48 Poland and Antarctic station
        '+48': {
            '813300': 'PL' // H. Arctowski Antarctic station (special case)
            // All other +48 numbers default to Poland (PL)
        },
        // +49 Germany and Heligoland
        '+49': {
            '04725': 'DE' // Heligoland island (still Germany)
            // All other +49 numbers default to Germany (DE)
        },
        // +52 Mexico and Revillagigedo Islands
        '+52': {
            // Revillagigedo Islands are part of Mexican numbering plan
            // All +52 numbers default to Mexico (MX)
        },
        // +54 Argentina and Antarctic Territory
        '+54': {
            '901': 'AR' // Argentine Antarctica bases
            // All other +54 numbers default to Argentina (AR)
        },
        // +56 Chile, Easter Island, Antarctic Territory
        '+56': {
            '32': 'CL' // Easter Island (still Chile)
            // All other +56 numbers default to Chile (CL)
        },
        // +61 Australia and external territories
        '+61': {
            '89162': 'CC', '89164': 'CX', '3': 'NF' // Cocos, Christmas, Norfolk Islands
            // All other +61 numbers default to Australia (AU)
        },
        // +64 New Zealand and territories
        '+64': {
            '9': 'PN' // Pitcairn Islands
            // All other +64 numbers default to New Zealand (NZ)
        },
        // +290 Saint Helena and Tristan da Cunha
        '+290': {
            '8': 'TA' // Tristan da Cunha
            // All other +290 numbers default to Saint Helena (SH)
        },
        // +358 Finland and Åland Islands
        '+358': {
            '18': 'AX' // Åland Islands
            // All other +358 numbers default to Finland (FI)
        },
        // +500 Falkland Islands and South Georgia
        '+500': {
            '3': 'GS' // South Georgia and South Sandwich Islands
            // All other +500 numbers default to Falkland Islands (FK)
        },
        // +590 Guadeloupe, Saint Barthélemy, Saint Martin
        '+590': {
            // All use +590 with different geographic prefixes
            // Default to Guadeloupe (GP)
        },
        // +599 Curaçao and former Netherlands Antilles
        '+599': {
            '3': 'BQ', '4': 'BQ', '7': 'BQ', '9': 'CW' // Caribbean Netherlands and Curaçao
            // Note: Bonaire, Saba, Sint Eustatius now use +31 since 2011
        }
    };

    /**
     * Default country mappings for dial codes with multiple countries
     * Used when area code detection fails or is incomplete
     * Updated with complete verification table
     * 
     * @private
     * @memberof MobileNumberInputComponent
     */
    private readonly DEFAULT_COUNTRY_MAPPINGS: { [dialCode: string]: string } = {
        '+1': 'US',   // Default to United States for NANP
        '+7': 'RU',   // Default to Russia
        '+20': 'EG',  // Default to Egypt
        '+27': 'ZA',  // Default to South Africa
        '+30': 'GR',  // Default to Greece
        '+31': 'NL',  // Default to Netherlands
        '+33': 'FR',  // Default to France
        '+34': 'ES',  // Default to Spain
        '+39': 'IT',  // Default to Italy
        '+41': 'CH',  // Default to Switzerland
        '+44': 'GB',  // Default to United Kingdom
        '+47': 'NO',  // Default to Norway
        '+48': 'PL',  // Default to Poland
        '+49': 'DE',  // Default to Germany
        '+52': 'MX',  // Default to Mexico
        '+54': 'AR',  // Default to Argentina
        '+56': 'CL',  // Default to Chile
        '+61': 'AU',  // Default to Australia
        '+64': 'NZ',  // Default to New Zealand
        '+290': 'SH', // Default to Saint Helena
        '+358': 'FI', // Default to Finland
        '+500': 'FK', // Default to Falkland Islands
        '+590': 'GP', // Default to Guadeloupe
        '+599': 'CW'  // Default to Curaçao
    };

    /**
     * Detects the correct country based on dial code and area code
     * This is a comprehensive solution for all duplicate dial code cases
     * 
     * @param {string} phoneNumber - Complete phone number with dial code
     * @returns {Country | null} Detected country or null
     * @private
     * @memberof MobileNumberInputComponent
     */
    private detectCountryByAreaCode(phoneNumber: string): Country | null {
        if (!phoneNumber.startsWith('+')) {
            return null;
        }

        // Find the dial code
        let dialCode = '';
        let numberPart = '';
        
        // Try to match dial codes from longest to shortest
        const sortedDialCodes = Object.keys(this.AREA_CODE_MAPPINGS).sort((a, b) => b.length - a.length);
        
        for (const code of sortedDialCodes) {
            if (phoneNumber.startsWith(code)) {
                dialCode = code;
                numberPart = phoneNumber.substring(code.length);
                break;
            }
        }

        if (!dialCode || !this.AREA_CODE_MAPPINGS[dialCode]) {
            return null;
        }

        const areaCodeMap = this.AREA_CODE_MAPPINGS[dialCode];
        
        // Try different area code lengths (from longest to shortest for better matching)
        const maxAreaCodeLength = Math.max(...Object.keys(areaCodeMap).map(code => code.length));
        
        for (let length = maxAreaCodeLength; length >= 2; length--) {
            if (numberPart.length >= length) {
                const areaCode = numberPart.substring(0, length);
                const countryCode = areaCodeMap[areaCode];
                
                if (countryCode) {
                    const country = this.countries.find(c => c.code === countryCode);
                    if (country) {
                        return country;
                    }
                }
            }
        }

        // If no area code match found, use default country for this dial code
        const defaultCountryCode = this.DEFAULT_COUNTRY_MAPPINGS[dialCode];
        if (defaultCountryCode) {
            return this.countries.find(c => c.code === defaultCountryCode) || null;
        }

        return null;
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