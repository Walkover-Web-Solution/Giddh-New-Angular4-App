# Mobile Number Input Component

A comprehensive Angular Material 16 standalone component for mobile number input with country selection, validation, and auto-detection features.

## Features

- ✅ **Standalone Component**: No module imports required
- ✅ **Angular Material 16**: Full Material Design integration
- ✅ **Country Selection**: Dropdown with flags and country codes
- ✅ **Auto-Detection**: Automatically detects country from +countrycode input
- ✅ **Real-time Validation**: Country-specific mobile number validation
- ✅ **Reactive Forms**: Full ControlValueAccessor implementation
- ✅ **Accessibility**: WCAG compliant with proper ARIA attributes
- ✅ **Mobile Responsive**: Optimized for mobile devices
- ✅ **International Support**: Multiple country formats supported
- ✅ **Error Handling**: Material Design error states and messages

## Quick Start Example

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MobileNumberInputComponent } from './shared/mobile-number-input/mobile-number-input.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MobileNumberInputComponent],
  template: `
    <div class="container">
      <h2>Mobile Number Input Demo</h2>
      
      <!-- Basic Usage -->
      <app-mobile-number-input
        [(ngModel)]="basicMobile"
        label="Your Mobile Number"
        [required]="true">
      </app-mobile-number-input>
      
      <!-- With Form -->
      <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
        <app-mobile-number-input
          formControlName="mobile"
          label="Contact Number"
          [required]="true"
          defaultCountry="+62"
          (countryChanged)="onCountryChanged($event)"
          (mobileChanged)="onMobileChanged($event)">
        </app-mobile-number-input>
        
        <button mat-raised-button color="primary" type="submit" 
                [disabled]="contactForm.invalid">
          Submit
        </button>
      </form>
      
      <!-- Display Values -->
      <div class="output">
        <p>Basic Mobile: {{ basicMobile }}</p>
        <p>Form Mobile: {{ contactForm.get('mobile')?.value }}</p>
        <p>Selected Country: {{ selectedCountry?.name }}</p>
      </div>
    </div>
  `
})
export class AppComponent {
  basicMobile = '';
  selectedCountry: any;
  
  contactForm = this.fb.group({
    mobile: ['', Validators.required]
  });

  constructor(private fb: FormBuilder) {}

  onCountryChanged(country: any): void {
    this.selectedCountry = country;
    console.log('Country changed:', country);
  }

  onMobileChanged(mobile: string): void {
    console.log('Mobile changed:', mobile);
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Form submitted:', this.contactForm.value);
    }
  }
}
```

## Supported Countries

| Country | Code | Dial Code | Pattern | Length |
|---------|------|-----------|---------|--------|
| India | IN | +91 | 6-9XXXXXXXXX | 10 digits |
| Indonesia | ID | +62 | 8XXXXXXXXX | 10-12 digits |
| Hungary | HU | +36 | 1-9XXXXXXXX | 9 digits |
| Iceland | IS | +354 | 6-9XXXXXX | 7 digits |
| Iran | IR | +98 | 9XXXXXXXXX | 10 digits |
| Hong Kong | HK | +852 | 5-9XXXXXXX | 8 digits |
| Iraq | IQ | +964 | 75-79XXXXXXXX | 10 digits |

## Installation

Since this is a standalone component, simply import it where needed:

```typescript
import { MobileNumberInputComponent } from './shared/mobile-number-input';
```

## Basic Usage

### Template-Driven Forms

```html
<app-mobile-number-input
    [(ngModel)]="mobileNumber"
    label="Mobile Number"
    [required]="true"
    (countryChanged)="onCountryChanged($event)"
    (mobileChanged)="onMobileChanged($event)">
</app-mobile-number-input>
```

### Reactive Forms

```html
<form [formGroup]="myForm">
    <app-mobile-number-input
        formControlName="mobile"
        label="Contact Number"
        [required]="true"
        defaultCountry="+62">
    </app-mobile-number-input>
</form>
```

```typescript
export class MyComponent {
    myForm = this.fb.group({
        mobile: ['', Validators.required]
    });

    constructor(private fb: FormBuilder) {}
}
```

## Component API

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | `string` | `'Mobile Number'` | Label for the input field |
| `required` | `boolean` | `false` | Whether the field is required |
| `disabled` | `boolean` | `false` | Whether the field is disabled |
| `defaultCountry` | `string` | `'+91'` | Default country dial code |

### Outputs

| Event | Type | Description |
|-------|------|-------------|
| `countryChanged` | `EventEmitter<Country>` | Emitted when country selection changes |
| `mobileChanged` | `EventEmitter<string>` | Emitted when mobile number changes |

### Interfaces

```typescript
interface Country {
    name: string;
    code: string;
    dialCode: string;
    flag: string;
    pattern: RegExp;
    placeholder: string;
    minLength: number;
    maxLength: number;
}
```

## Advanced Usage

### Custom Validation Example

```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MobileNumberInputComponent } from './shared/mobile-number-input/mobile-number-input.component';

@Component({
  selector: 'app-advanced-form',
  standalone: true,
  imports: [MobileNumberInputComponent],
  template: `
    <form [formGroup]="advancedForm" (ngSubmit)="onSubmit()">
      <app-mobile-number-input
        formControlName="primaryMobile"
        label="Primary Mobile Number"
        [required]="true"
        defaultCountry="+91"
        (countryChanged)="onPrimaryCountryChanged($event)">
      </app-mobile-number-input>
      
      <app-mobile-number-input
        formControlName="secondaryMobile"
        label="Secondary Mobile Number (Optional)"
        [required]="false"
        defaultCountry="+91">
      </app-mobile-number-input>
      
      <div *ngIf="advancedForm.get('primaryMobile')?.errors?.['customMobile']" class="error">
        {{ advancedForm.get('primaryMobile')?.errors?.['customMobile'] }}
      </div>
      
      <button mat-raised-button color="primary" type="submit" [disabled]="advancedForm.invalid">
        Save Contact Details
      </button>
    </form>
  `
})
export class AdvancedFormComponent {
  advancedForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.advancedForm = this.fb.group({
      primaryMobile: ['', [Validators.required, this.customMobileValidator]],
      secondaryMobile: ['']
    });
  }

  // Custom validator for business-specific rules
  customMobileValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    // Example: Block certain number patterns
    if (value.includes('0000000000')) {
      return { customMobile: 'Invalid mobile number pattern' };
    }
    
    // Example: Ensure different primary and secondary numbers
    const form = control.parent;
    if (form) {
      const secondary = form.get('secondaryMobile')?.value;
      if (secondary && value === secondary) {
        return { customMobile: 'Primary and secondary numbers must be different' };
      }
    }
    
    return null;
  }

  onPrimaryCountryChanged(country: any): void {
    console.log('Primary country changed:', country);
    // Auto-update secondary mobile country
    // this.advancedForm.patchValue({ secondaryMobile: country.dialCode });
  }

  onSubmit(): void {
    if (this.advancedForm.valid) {
      const formData = this.advancedForm.value;
      console.log('Advanced form submitted:', formData);
    }
  }
}
```

### Auto-Detection Example

```typescript
@Component({
  selector: 'app-auto-detect-demo',
  standalone: true,
  imports: [MobileNumberInputComponent],
  template: `
    <div class="demo-container">
      <h3>Auto-Detection Demo</h3>
      <p>Try typing these numbers to see auto-detection in action:</p>
      <ul>
        <li>+919876543210 (India)</li>
        <li>+628123456789 (Indonesia)</li>
        <li>+36301234567 (Hungary)</li>
        <li>+85298765432 (Hong Kong)</li>
      </ul>
      
      <app-mobile-number-input
        [(ngModel)]="autoDetectNumber"
        label="Type a number with country code"
        (countryChanged)="onAutoDetectedCountry($event)"
        (mobileChanged)="onNumberChanged($event)">
      </app-mobile-number-input>
      
      <div class="detection-result" *ngIf="detectionResult">
        <h4>Detection Result:</h4>
        <p><strong>Country:</strong> {{ detectionResult.country }}</p>
        <p><strong>Dial Code:</strong> {{ detectionResult.dialCode }}</p>
        <p><strong>Number:</strong> {{ detectionResult.number }}</p>
        <p><strong>Valid:</strong> {{ detectionResult.isValid ? '✅' : '❌' }}</p>
      </div>
    </div>
  `
})
export class AutoDetectDemoComponent {
  autoDetectNumber = '';
  detectionResult: any = null;

  onAutoDetectedCountry(country: any): void {
    this.updateDetectionResult(country, this.autoDetectNumber);
  }

  onNumberChanged(number: string): void {
    // Get current country from component if needed
    this.updateDetectionResult(null, number);
  }

  private updateDetectionResult(country: any, number: string): void {
    this.detectionResult = {
      country: country?.name || 'Not detected',
      dialCode: country?.dialCode || 'N/A',
      number: number,
      isValid: this.validateNumber(number, country)
    };
  }

  private validateNumber(number: string, country: any): boolean {
    if (!number || !country) return false;
    return country.pattern?.test(number.replace(/\D/g, ''));
  }
}
```

### Real-World Integration Example

```typescript
@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [MobileNumberInputComponent],
  template: `
    <form [formGroup]="registrationForm" (ngSubmit)="register()">
      <mat-form-field>
        <mat-label>Full Name</mat-label>
        <input matInput formControlName="fullName" required>
      </mat-form-field>
      
      <mat-form-field>
        <mat-label>Email</mat-label>
        <input matInput type="email" formControlName="email" required>
      </mat-form-field>
      
      <app-mobile-number-input
        formControlName="mobile"
        label="Mobile Number"
        [required]="true"
        [defaultCountry]="userCountry"
        (countryChanged)="onCountryChanged($event)"
        (mobileChanged)="onMobileChanged($event)">
      </app-mobile-number-input>
      
      <mat-checkbox formControlName="smsNotifications">
        Send SMS notifications to this number
      </mat-checkbox>
      
      <div class="form-actions">
        <button mat-raised-button color="primary" type="submit" 
                [disabled]="registrationForm.invalid || isSubmitting">
          {{ isSubmitting ? 'Registering...' : 'Register' }}
        </button>
      </div>
      
      <div class="validation-summary" *ngIf="showValidationSummary">
        <h4>Validation Summary:</h4>
        <ul>
          <li *ngFor="let error of validationErrors">{{ error }}</li>
        </ul>
      </div>
    </form>
  `
})
export class UserRegistrationComponent {
  registrationForm: FormGroup;
  userCountry = '+91'; // Default to India
  isSubmitting = false;
  showValidationSummary = false;
  validationErrors: string[] = [];
  selectedCountry: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.registrationForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, this.mobileValidator.bind(this)]],
      smsNotifications: [true]
    });

    // Detect user's country from IP or browser settings
    this.detectUserCountry();
  }

  private async detectUserCountry(): Promise<void> {
    try {
      // Example: Get country from IP geolocation service
      const location = await this.userService.getUserLocation();
      this.userCountry = location.dialCode || '+91';
    } catch (error) {
      console.log('Could not detect user country, using default');
    }
  }

  mobileValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    // Custom business rules
    if (this.selectedCountry) {
      const cleanNumber = value.replace(/\D/g, '');
      
      // Check minimum length
      if (cleanNumber.length < this.selectedCountry.minLength) {
        return { mobileLength: `Mobile number must be at least ${this.selectedCountry.minLength} digits` };
      }
      
      // Check maximum length
      if (cleanNumber.length > this.selectedCountry.maxLength) {
        return { mobileLength: `Mobile number cannot exceed ${this.selectedCountry.maxLength} digits` };
      }
      
      // Check pattern
      if (!this.selectedCountry.pattern.test(cleanNumber)) {
        return { mobilePattern: `Invalid mobile number format for ${this.selectedCountry.name}` };
      }
    }

    return null;
  }

  onCountryChanged(country: any): void {
    this.selectedCountry = country;
    console.log('Country changed to:', country.name);
    
    // Revalidate mobile number with new country rules
    this.registrationForm.get('mobile')?.updateValueAndValidity();
    
    // Update SMS notification text based on country
    this.updateSmsNotificationText(country);
  }

  onMobileChanged(mobile: string): void {
    console.log('Mobile number changed:', mobile);
    
    // Real-time validation feedback
    this.validateMobileInRealTime(mobile);
  }

  private validateMobileInRealTime(mobile: string): void {
    const errors: string[] = [];
    
    if (mobile && this.selectedCountry) {
      const cleanNumber = mobile.replace(/\D/g, '');
      
      if (cleanNumber.length < this.selectedCountry.minLength) {
        errors.push(`Enter at least ${this.selectedCountry.minLength} digits`);
      }
      
      if (!this.selectedCountry.pattern.test(cleanNumber)) {
        errors.push(`Invalid format for ${this.selectedCountry.name}`);
      }
    }
    
    this.validationErrors = errors;
    this.showValidationSummary = errors.length > 0;
  }

  private updateSmsNotificationText(country: any): void {
    // Update checkbox label based on country-specific SMS rates or availability
    const smsAvailable = this.checkSmsAvailability(country.code);
    if (!smsAvailable) {
      this.registrationForm.patchValue({ smsNotifications: false });
    }
  }

  private checkSmsAvailability(countryCode: string): boolean {
    // Example: Check if SMS service is available in the country
    const unavailableCountries = ['IR', 'IQ']; // Example restricted countries
    return !unavailableCountries.includes(countryCode);
  }

  async register(): Promise<void> {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    
    try {
      const formData = {
        ...this.registrationForm.value,
        countryCode: this.selectedCountry?.code,
        dialCode: this.selectedCountry?.dialCode
      };
      
      const result = await this.userService.registerUser(formData);
      
      if (result.success) {
        this.notificationService.showSuccess('Registration successful!');
        
        // Send SMS verification if enabled
        if (formData.smsNotifications) {
          await this.sendSmsVerification(formData.mobile);
        }
      }
    } catch (error) {
      this.notificationService.showError('Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      this.isSubmitting = false;
    }
  }

  private async sendSmsVerification(mobile: string): Promise<void> {
    try {
      await this.userService.sendSmsVerification(mobile);
      this.notificationService.showInfo('Verification SMS sent to your mobile number');
    } catch (error) {
      console.error('SMS verification error:', error);
    }
  }
}
```

### Event Handling & State Management

```typescript
@Component({
  selector: 'app-contact-manager',
  standalone: true,
  imports: [MobileNumberInputComponent],
  template: `
    <div class="contact-manager">
      <h3>Contact Manager</h3>
      
      <div class="contact-form">
        <app-mobile-number-input
          [(ngModel)]="currentContact.mobile"
          label="Mobile Number"
          [required]="true"
          [disabled]="isReadOnly"
          (countryChanged)="onCountryChanged($event)"
          (mobileChanged)="onMobileChanged($event)">
        </app-mobile-number-input>
        
        <div class="contact-actions">
          <button mat-button (click)="saveContact()" [disabled]="!isValidContact()">
            Save Contact
          </button>
          <button mat-button (click)="clearContact()">Clear</button>
          <button mat-button (click)="formatNumber()">Format</button>
        </div>
      </div>
      
      <div class="contact-history" *ngIf="contactHistory.length > 0">
        <h4>Recent Contacts</h4>
        <div class="contact-item" *ngFor="let contact of contactHistory" 
             (click)="loadContact(contact)">
          <span class="flag">{{ contact.country.flag }}</span>
          <span class="number">{{ contact.formattedNumber }}</span>
          <span class="country">{{ contact.country.name }}</span>
        </div>
      </div>
    </div>
  `
})
export class ContactManagerComponent {
  currentContact = { mobile: '', country: null };
  contactHistory: any[] = [];
  isReadOnly = false;
  
  onCountryChanged(country: any): void {
    this.currentContact.country = country;
    console.log('Country changed:', country);
    
    // Auto-format existing number for new country
    if (this.currentContact.mobile) {
      this.formatNumberForCountry(country);
    }
    
    // Save country preference
    this.saveCountryPreference(country);
  }

  onMobileChanged(mobile: string): void {
    this.currentContact.mobile = mobile;
    console.log('Mobile changed:', mobile);
    
    // Real-time validation and formatting
    this.validateAndFormat(mobile);
  }

  private formatNumberForCountry(country: any): void {
    let number = this.currentContact.mobile.replace(/\D/g, '');
    
    // Remove country code if present
    if (number.startsWith(country.dialCode.replace('+', ''))) {
      number = number.substring(country.dialCode.length - 1);
    }
    
    // Apply country-specific formatting
    const formatted = this.applyCountryFormatting(number, country);
    this.currentContact.mobile = formatted;
  }

  private applyCountryFormatting(number: string, country: any): string {
    // Example formatting rules for different countries
    switch (country.code) {
      case 'IN':
        // Format: +91 98765 43210
        return number.replace(/(\d{5})(\d{5})/, '$1 $2');
      case 'ID':
        // Format: +62 812 3456 789
        return number.replace(/(\d{3})(\d{4})(\d{3,4})/, '$1 $2 $3');
      case 'HU':
        // Format: +36 30 123 4567
        return number.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3');
      default:
        return number;
    }
  }

  private validateAndFormat(mobile: string): void {
    if (!mobile || !this.currentContact.country) return;
    
    const cleanNumber = mobile.replace(/\D/g, '');
    const country = this.currentContact.country;
    
    // Validate length
    if (cleanNumber.length >= country.minLength && 
        cleanNumber.length <= country.maxLength) {
      
      // Validate pattern
      if (country.pattern.test(cleanNumber)) {
        // Valid number - apply formatting
        const formatted = this.applyCountryFormatting(cleanNumber, country);
        if (formatted !== mobile) {
          setTimeout(() => {
            this.currentContact.mobile = formatted;
          }, 0);
        }
      }
    }
  }

  saveContact(): void {
    if (this.isValidContact()) {
      const contact = {
        mobile: this.currentContact.mobile,
        country: this.currentContact.country,
        formattedNumber: this.formatDisplayNumber(),
        timestamp: new Date()
      };
      
      this.contactHistory.unshift(contact);
      this.contactHistory = this.contactHistory.slice(0, 10); // Keep last 10
      
      console.log('Contact saved:', contact);
    }
  }

  clearContact(): void {
    this.currentContact = { mobile: '', country: null };
  }

  formatNumber(): void {
    if (this.currentContact.mobile && this.currentContact.country) {
      const formatted = this.applyCountryFormatting(
        this.currentContact.mobile.replace(/\D/g, ''), 
        this.currentContact.country
      );
      this.currentContact.mobile = formatted;
    }
  }

  loadContact(contact: any): void {
    this.currentContact = {
      mobile: contact.mobile,
      country: contact.country
    };
  }

  isValidContact(): boolean {
    return !!(this.currentContact.mobile && 
             this.currentContact.country &&
             this.currentContact.mobile.length >= this.currentContact.country.minLength);
  }

  private formatDisplayNumber(): string {
    const country = this.currentContact.country;
    return `${country.dialCode} ${this.currentContact.mobile}`;
  }

  private saveCountryPreference(country: any): void {
    localStorage.setItem('preferredCountry', JSON.stringify(country));
  }
}
```

## Validation Messages

The component provides built-in validation messages:

- **Required**: "Mobile number is required"
- **Invalid Length**: "Mobile number must be between X and Y digits"
- **Invalid Pattern**: "Please enter valid mobile number"

## Styling

The component uses CSS custom properties for theming. Override these variables in your global styles:

```scss
:root {
    --primary-color: #1976d2;
    --error-color: #f44336;
    --text-color-primary: #212121;
    --text-color-secondary: #757575;
    --border-color: #e0e0e0;
    --background-color-light: #fafafa;
}
```

## Accessibility

The component includes:

- Proper ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Examples

### India Mobile Number
```
Input: +919876543210
Result: ✅ Valid (India selected, 10 digits starting with 6-9)
```

### Indonesia Mobile Number
```
Input: +628123456789
Result: ✅ Valid (Indonesia selected, 11 digits starting with 8)
```

### Invalid Examples
```
Input: +911234567890
Result: ❌ Invalid (India pattern requires first digit 6-9)

Input: +9198765
Result: ❌ Invalid (Too short for India - requires 10 digits)
```

## Testing

### Unit Testing Examples

```typescript
// mobile-number-input.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MobileNumberInputComponent } from './mobile-number-input.component';

describe('MobileNumberInputComponent', () => {
  let component: MobileNumberInputComponent;
  let fixture: ComponentFixture<MobileNumberInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MobileNumberInputComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MobileNumberInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Basic Functionality', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should display default label', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('mat-label').textContent).toContain('Mobile Number');
    });

    it('should set custom label', () => {
      component.label = 'Phone Number';
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('mat-label').textContent).toContain('Phone Number');
    });

    it('should disable input when disabled property is true', () => {
      component.disabled = true;
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.disabled).toBeTruthy();
    });
  });

  describe('Country Selection', () => {
    it('should default to India (+91)', () => {
      expect(component.selectedCountry.dialCode).toBe('+91');
      expect(component.selectedCountry.code).toBe('IN');
    });

    it('should change country when defaultCountry is set', () => {
      component.defaultCountry = '+62';
      component.ngOnInit();
      expect(component.selectedCountry.dialCode).toBe('+62');
      expect(component.selectedCountry.code).toBe('ID');
    });

    it('should emit countryChanged event when country changes', () => {
      spyOn(component.countryChanged, 'emit');
      component.onCountryChange('+62');
      expect(component.countryChanged.emit).toHaveBeenCalledWith(
        jasmine.objectContaining({ dialCode: '+62', code: 'ID' })
      );
    });
  });

  describe('Auto-Detection', () => {
    it('should detect India from +91 prefix', () => {
      const input = fixture.nativeElement.querySelector('input');
      input.value = '+919876543210';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      
      expect(component.selectedCountry.code).toBe('IN');
    });

    it('should detect Indonesia from +62 prefix', () => {
      const input = fixture.nativeElement.querySelector('input');
      input.value = '+628123456789';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      
      expect(component.selectedCountry.code).toBe('ID');
    });

    it('should detect Hungary from +36 prefix', () => {
      const input = fixture.nativeElement.querySelector('input');
      input.value = '+36301234567';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      
      expect(component.selectedCountry.code).toBe('HU');
    });
  });

  describe('Validation', () => {
    it('should validate Indian mobile number correctly', () => {
      component.selectedCountry = component.countries.find(c => c.code === 'IN');
      
      // Valid Indian number
      expect(component.isValidMobileNumber('9876543210')).toBeTruthy();
      
      // Invalid Indian number (starts with 5)
      expect(component.isValidMobileNumber('5876543210')).toBeFalsy();
      
      // Invalid length
      expect(component.isValidMobileNumber('98765')).toBeFalsy();
    });

    it('should validate Indonesian mobile number correctly', () => {
      component.selectedCountry = component.countries.find(c => c.code === 'ID');
      
      // Valid Indonesian number
      expect(component.isValidMobileNumber('8123456789')).toBeTruthy();
      
      // Invalid Indonesian number (starts with 7)
      expect(component.isValidMobileNumber('7123456789')).toBeFalsy();
    });

    it('should show required error when field is required and empty', () => {
      component.required = true;
      component.value = '';
      component.onBlur();
      fixture.detectChanges();
      
      const errorElement = fixture.nativeElement.querySelector('mat-error');
      expect(errorElement?.textContent).toContain('Mobile number is required');
    });

    it('should show pattern error for invalid number', () => {
      component.selectedCountry = component.countries.find(c => c.code === 'IN');
      component.value = '1234567890'; // Invalid pattern for India
      component.onBlur();
      fixture.detectChanges();
      
      const errorElement = fixture.nativeElement.querySelector('mat-error');
      expect(errorElement?.textContent).toContain('Please enter valid mobile number');
    });
  });

  describe('Form Integration', () => {
    it('should work with reactive forms', () => {
      const formControl = new FormControl('');
      component.writeValue('9876543210');
      
      expect(component.value).toBe('9876543210');
    });

    it('should call onChange when value changes', () => {
      const onChangeSpy = jasmine.createSpy('onChange');
      component.registerOnChange(onChangeSpy);
      
      component.onInput({ target: { value: '9876543210' } } as any);
      
      expect(onChangeSpy).toHaveBeenCalledWith('9876543210');
    });

    it('should call onTouched when field is blurred', () => {
      const onTouchedSpy = jasmine.createSpy('onTouched');
      component.registerOnTouched(onTouchedSpy);
      
      component.onBlur();
      
      expect(onTouchedSpy).toHaveBeenCalled();
    });
  });

  describe('Event Emissions', () => {
    it('should emit mobileChanged when mobile number changes', () => {
      spyOn(component.mobileChanged, 'emit');
      
      component.onInput({ target: { value: '9876543210' } } as any);
      
      expect(component.mobileChanged.emit).toHaveBeenCalledWith('9876543210');
    });

    it('should emit countryChanged when country selection changes', () => {
      spyOn(component.countryChanged, 'emit');
      
      component.onCountryChange('+62');
      
      expect(component.countryChanged.emit).toHaveBeenCalledWith(
        jasmine.objectContaining({ dialCode: '+62' })
      );
    });
  });
});
```

### Integration Testing

```typescript
// mobile-number-form.integration.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { MobileNumberInputComponent } from './mobile-number-input.component';

@Component({
  template: `
    <form [formGroup]="testForm">
      <app-mobile-number-input
        formControlName="mobile"
        label="Test Mobile"
        [required]="true"
        (countryChanged)="onCountryChanged($event)"
        (mobileChanged)="onMobileChanged($event)">
      </app-mobile-number-input>
    </form>
  `
})
class TestHostComponent {
  testForm = this.fb.group({
    mobile: ['', Validators.required]
  });

  countryChangedEvent: any;
  mobileChangedEvent: string = '';

  constructor(private fb: FormBuilder) {}

  onCountryChanged(country: any): void {
    this.countryChangedEvent = country;
  }

  onMobileChanged(mobile: string): void {
    this.mobileChangedEvent = mobile;
  }
}

describe('MobileNumberInput Integration', () => {
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      imports: [MobileNumberInputComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should integrate with reactive forms', () => {
    const input = fixture.nativeElement.querySelector('input');
    
    // Simulate user input
    input.value = '9876543210';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Check form value
    expect(hostComponent.testForm.get('mobile')?.value).toBe('9876543210');
  });

  it('should emit events to parent component', () => {
    const input = fixture.nativeElement.querySelector('input');
    
    // Simulate user input
    input.value = '9876543210';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Check events were emitted
    expect(hostComponent.mobileChangedEvent).toBe('9876543210');
  });

  it('should validate form correctly', () => {
    // Form should be invalid initially (required field empty)
    expect(hostComponent.testForm.invalid).toBeTruthy();

    // Add valid mobile number
    const input = fixture.nativeElement.querySelector('input');
    input.value = '9876543210';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    // Form should now be valid
    expect(hostComponent.testForm.valid).toBeTruthy();
  });
});
```

### E2E Testing Examples

```typescript
// mobile-number-input.e2e.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Mobile Number Input E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mobile-number-demo');
  });

  test('should allow user to enter mobile number', async ({ page }) => {
    const input = page.locator('input[placeholder*="mobile"]');
    
    await input.fill('9876543210');
    await expect(input).toHaveValue('9876543210');
  });

  test('should auto-detect country from dial code', async ({ page }) => {
    const input = page.locator('input[placeholder*="mobile"]');
    const countrySelect = page.locator('mat-select[aria-label="Country"]');
    
    // Type number with country code
    await input.fill('+628123456789');
    
    // Check if Indonesia is selected
    await expect(countrySelect).toContainText('🇮🇩');
  });

  test('should show validation errors', async ({ page }) => {
    const input = page.locator('input[placeholder*="mobile"]');
    const submitButton = page.locator('button[type="submit"]');
    
    // Try to submit without entering mobile number
    await submitButton.click();
    
    // Check for error message
    await expect(page.locator('mat-error')).toContainText('Mobile number is required');
  });

  test('should change country selection', async ({ page }) => {
    const countrySelect = page.locator('mat-select[aria-label="Country"]');
    const input = page.locator('input[placeholder*="mobile"]');
    
    // Open country dropdown
    await countrySelect.click();
    
    // Select Indonesia
    await page.locator('mat-option:has-text("🇮🇩 Indonesia")').click();
    
    // Verify placeholder changed
    await expect(input).toHaveAttribute('placeholder', '8XXXXXXXXX');
  });

  test('should format number correctly', async ({ page }) => {
    const input = page.locator('input[placeholder*="mobile"]');
    
    // Enter Indian mobile number
    await input.fill('9876543210');
    await input.blur();
    
    // Check if number is formatted (if formatting is implemented)
    // This depends on your specific formatting logic
    await expect(input).toHaveValue('9876543210');
  });

  test('should work with form submission', async ({ page }) => {
    const input = page.locator('input[placeholder*="mobile"]');
    const submitButton = page.locator('button[type="submit"]');
    
    // Fill valid mobile number
    await input.fill('9876543210');
    
    // Submit form
    await submitButton.click();
    
    // Check for success message or navigation
    await expect(page.locator('.success-message')).toBeVisible();
  });
});
```

### Manual Testing Checklist

#### Basic Functionality
- [ ] Component renders without errors
- [ ] Default country is India (+91)
- [ ] Label displays correctly
- [ ] Input accepts numeric input
- [ ] Required validation works
- [ ] Disabled state works

#### Country Selection
- [ ] Country dropdown opens and closes
- [ ] All supported countries are listed
- [ ] Country flags display correctly
- [ ] Selecting country updates dial code
- [ ] Country change event is emitted

#### Auto-Detection
- [ ] +91 prefix selects India
- [ ] +62 prefix selects Indonesia  
- [ ] +36 prefix selects Hungary
- [ ] +354 prefix selects Iceland
- [ ] +98 prefix selects Iran
- [ ] +852 prefix selects Hong Kong
- [ ] +964 prefix selects Iraq

#### Validation Tests
- [ ] Valid Indian number: 9876543210 ✅
- [ ] Invalid Indian number: 1234567890 ❌
- [ ] Valid Indonesian number: 8123456789 ✅
- [ ] Invalid Indonesian number: 7123456789 ❌
- [ ] Valid Hungarian number: 301234567 ✅
- [ ] Invalid Hungarian number: 201234567 ❌
- [ ] Too short numbers show error ❌
- [ ] Too long numbers show error ❌

#### Form Integration
- [ ] Works with template-driven forms
- [ ] Works with reactive forms
- [ ] Form validation triggers correctly
- [ ] Value updates propagate to form
- [ ] Form reset clears component

#### Accessibility
- [ ] Screen reader announces country changes
- [ ] Keyboard navigation works in dropdown
- [ ] Focus management is correct
- [ ] ARIA labels are present
- [ ] High contrast mode works

#### Mobile Responsiveness
- [ ] Component fits on mobile screens
- [ ] Touch interactions work
- [ ] Virtual keyboard appears correctly
- [ ] Country dropdown is usable on mobile

### Performance Testing

```typescript
// performance.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileNumberInputComponent } from './mobile-number-input.component';

describe('MobileNumberInput Performance', () => {
  let component: MobileNumberInputComponent;
  let fixture: ComponentFixture<MobileNumberInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileNumberInputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MobileNumberInputComponent);
    component = fixture.componentInstance;
  });

  it('should handle rapid input changes efficiently', async () => {
    const startTime = performance.now();
    
    // Simulate rapid typing
    for (let i = 0; i < 100; i++) {
      component.onInput({ target: { value: `987654321${i}` } } as any);
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Should complete within reasonable time (adjust threshold as needed)
    expect(duration).toBeLessThan(100); // 100ms
  });

  it('should not cause memory leaks with country changes', () => {
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
    // Simulate many country changes
    for (let i = 0; i < 50; i++) {
      component.onCountryChange('+91');
      component.onCountryChange('+62');
    }
    
    // Force garbage collection if available
    if ((window as any).gc) {
      (window as any).gc();
    }
    
    const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;
    
    // Memory increase should be minimal (adjust threshold as needed)
    expect(memoryIncrease).toBeLessThan(1024 * 1024); // 1MB
  });
});
```

### Running Tests

```bash
# Unit tests
npm test -- mobile-number-input.component.spec.ts

# Integration tests  
npm test -- mobile-number-form.integration.spec.ts

# E2E tests
npm run e2e -- mobile-number-input.e2e.spec.ts

# Performance tests
npm test -- performance.spec.ts

# All tests with coverage
npm run test:coverage

# Watch mode for development
npm test -- --watch mobile-number-input
```

## Migration from Other Components

If migrating from other phone input components:

1. Replace the old component with `<app-mobile-number-input>`
2. Update property names according to the API table
3. Update event handlers to use new event signatures
4. Test country-specific validation patterns

## Performance

- Lazy loading compatible
- Minimal bundle size impact
- Efficient change detection
- Optimized for mobile devices

## Troubleshooting

### Common Issues

#### Component Not Rendering
```typescript
// ❌ Wrong - Missing imports
@Component({
  imports: [] // MobileNumberInputComponent not imported
})

// ✅ Correct - Import the component
@Component({
  imports: [MobileNumberInputComponent]
})
```

#### Validation Not Working
```typescript
// ❌ Wrong - Missing form control setup
<app-mobile-number-input [(ngModel)]="mobile">

// ✅ Correct - Proper form setup
<form [formGroup]="myForm">
  <app-mobile-number-input formControlName="mobile" [required]="true">
</form>
```

#### Country Auto-Detection Issues
```typescript
// ❌ Wrong - Incomplete number
onInput('+91987') // Too short, won't detect

// ✅ Correct - Complete number with country code
onInput('+919876543210') // Will detect India
```

#### Events Not Firing
```html
<!-- ❌ Wrong - Incorrect event names -->
<app-mobile-number-input (selected)="onSelect($event)">

<!-- ✅ Correct - Use proper event names -->
<app-mobile-number-input 
  (countryChanged)="onCountryChanged($event)"
  (mobileChanged)="onMobileChanged($event)">
```

### Performance Issues

#### Slow Rendering
- Ensure you're using OnPush change detection if needed
- Avoid complex operations in event handlers
- Use trackBy functions for country lists

#### Memory Leaks
- Always unsubscribe from observables in ngOnDestroy
- Avoid creating new objects in templates
- Use proper lifecycle management

### Browser Compatibility

#### Safari Issues
- Ensure proper polyfills for older Safari versions
- Test input masking on iOS devices
- Verify touch events work correctly

#### Internet Explorer (if supported)
- Include necessary polyfills
- Test CSS custom properties fallbacks
- Verify ES6 features are transpiled

### Debugging Tips

```typescript
// Enable debug mode for detailed logging
@Component({
  template: `
    <app-mobile-number-input
      [debug]="true"
      (countryChanged)="debugCountryChange($event)"
      (mobileChanged)="debugMobileChange($event)">
    </app-mobile-number-input>
  `
})
export class DebugComponent {
  debugCountryChange(country: any): void {
    console.log('Country Debug:', {
      selected: country,
      timestamp: new Date(),
      validation: this.validateCountry(country)
    });
  }

  debugMobileChange(mobile: string): void {
    console.log('Mobile Debug:', {
      value: mobile,
      length: mobile.length,
      isValid: this.validateMobile(mobile),
      timestamp: new Date()
    });
  }
}
```

## FAQ

### Q: How do I add a new country?
A: Add the country object to the `countries` array with proper validation pattern, flag, and dial code.

### Q: Can I customize the validation messages?
A: Yes, you can override the default messages by providing custom error templates.

### Q: Does it work with Angular Universal (SSR)?
A: Yes, the component is SSR-compatible and handles client-side hydration properly.

### Q: How do I handle multiple mobile numbers in one form?
A: Use multiple instances with different form control names:

```html
<app-mobile-number-input formControlName="primaryMobile" label="Primary">
<app-mobile-number-input formControlName="secondaryMobile" label="Secondary">
```

### Q: Can I disable certain countries?
A: Currently not supported, but you can filter the countries array before passing to the component.

### Q: How do I format the display value?
A: The component handles formatting internally. For custom formatting, listen to the `mobileChanged` event.

## Contributing

When adding new countries:

1. **Add Country Data**:
```typescript
{
  name: 'New Country',
  code: 'NC',
  dialCode: '+123',
  flag: '🏳️',
  pattern: /^[0-9]{8,12}$/,
  placeholder: 'XXXXXXXX',
  minLength: 8,
  maxLength: 12
}
```

2. **Update Tests**: Add test cases for the new country validation
3. **Update Documentation**: Add the country to the supported countries table
4. **Test Thoroughly**: Verify auto-detection and validation work correctly

### Development Setup

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Run in development mode
npm run start

# Run tests
npm test

# Build for production
npm run build
```

### Code Style

- Follow Angular style guide
- Use TypeScript strict mode
- Add JSDoc comments for public methods
- Write unit tests for new features
- Follow semantic versioning

## Changelog

### v1.2.0
- Added auto-detection for country codes
- Improved validation patterns
- Enhanced accessibility features
- Added comprehensive test suite

### v1.1.0
- Added support for more countries
- Improved error handling
- Better mobile responsiveness
- Performance optimizations

### v1.0.0
- Initial release
- Basic country selection
- Form integration
- Validation support

## License

This component is part of the Giddh application and follows the project's licensing terms.

---

**Need Help?** 
- Check the [troubleshooting section](#troubleshooting)
- Review the [examples](#examples) 
- Run the [test suite](#testing)
- Contact the development team for support
