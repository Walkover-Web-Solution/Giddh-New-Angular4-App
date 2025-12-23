# Integration Guide - Mobile Number Input Component

This guide explains how to integrate the Mobile Number Input Component into the existing Giddh Angular application.

## Quick Start

### 1. Import the Component

Since this is a standalone component, simply import it in your component:

```typescript
import { MobileNumberInputComponent } from '../shared/mobile-number-input';

@Component({
    selector: 'app-your-component',
    standalone: true, // If your component is standalone
    imports: [
        // other imports
        MobileNumberInputComponent
    ],
    // or add to module imports if using modules
})
```

### 2. Use in Template

```html
<app-mobile-number-input
    formControlName="mobileNumber"
    label="Mobile Number"
    [required]="true"
    defaultCountry="+91">
</app-mobile-number-input>
```

## Integration with Existing Forms

### Contact Forms

Replace existing mobile number inputs in contact forms:

```typescript
// Before
mobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]]

// After - validation is handled by the component
mobileNumber: ['', Validators.required]
```

### User Registration

```html
<!-- In signup/registration forms -->
<app-mobile-number-input
    formControlName="phone"
    label="Phone Number"
    [required]="true"
    (countryChanged)="updateUserCountry($event)">
</app-mobile-number-input>
```

### Profile Settings

```html
<!-- In user profile forms -->
<app-mobile-number-input
    formControlName="contactNumber"
    label="Contact Number"
    [required]="false"
    defaultCountry="+91">
</app-mobile-number-input>
```

## Integration with Existing Services

### API Integration

```typescript
export class ContactService {
    createContact(contactData: any) {
        // The component returns full international format
        // e.g., "+919876543210"
        const payload = {
            ...contactData,
            mobileNumber: contactData.mobileNumber // Already in +countrycode format
        };
        
        return this.http.post('/api/contacts', payload);
    }
}
```

### Validation Service

```typescript
import { mobileNumberValidator } from '../shared/mobile-number-input';

export class ValidationService {
    getMobileValidator(country: Country) {
        return mobileNumberValidator(country);
    }
}
```

## Styling Integration

### Using Existing CSS Variables

The component uses CSS custom properties that should match your existing theme:

```scss
// In your global styles or theme file
:root {
    --primary-color: #1976d2; // Your primary color
    --error-color: #f44336;   // Your error color
    --text-color-primary: #212121;
    --text-color-secondary: #757575;
    --border-color: #e0e0e0;
    --background-color-light: #fafafa;
}
```

### Custom Styling

```scss
// Override component styles if needed
app-mobile-number-input {
    .mobile-number-container {
        // Custom styles
        .country-select {
            // Country dropdown styles
        }
        
        .mobile-input {
            // Mobile input styles
        }
    }
}
```

## Common Integration Patterns

### 1. Contact Management

```typescript
@Component({
    template: `
        <form [formGroup]="contactForm">
            <app-mobile-number-input
                formControlName="primaryPhone"
                label="Primary Phone"
                [required]="true"
                (countryChanged)="onPrimaryCountryChanged($event)">
            </app-mobile-number-input>
            
            <app-mobile-number-input
                formControlName="secondaryPhone"
                label="Secondary Phone"
                [required]="false">
            </app-mobile-number-input>
        </form>
    `
})
export class ContactFormComponent {
    contactForm = this.fb.group({
        primaryPhone: ['', Validators.required],
        secondaryPhone: ['']
    });
    
    onPrimaryCountryChanged(country: Country) {
        // Update user's preferred country for future forms
        this.userService.updatePreferredCountry(country.code);
    }
}
```

### 2. Multi-step Forms

```typescript
// Step 1: Basic Info
@Component({
    template: `
        <app-mobile-number-input
            [(ngModel)]="wizardData.phone"
            label="Phone Number"
            [required]="true"
            (mobileChanged)="validateStep()">
        </app-mobile-number-input>
    `
})
export class Step1Component {
    @Input() wizardData: any;
    
    validateStep() {
        // Validate current step
        this.stepValid = this.wizardData.phone && this.wizardData.phone.length > 0;
    }
}
```

### 3. Search and Filter

```typescript
@Component({
    template: `
        <app-mobile-number-input
            [(ngModel)]="searchCriteria.phone"
            label="Search by Phone"
            [required]="false"
            (mobileChanged)="onSearchPhoneChanged($event)">
        </app-mobile-number-input>
    `
})
export class ContactSearchComponent {
    searchCriteria = { phone: '' };
    
    onSearchPhoneChanged(phone: string) {
        // Debounce search
        this.searchSubject.next(phone);
    }
}
```

## Migration from Existing Components

### From Basic Input

```html
<!-- Before -->
<mat-form-field>
    <mat-label>Mobile Number</mat-label>
    <input matInput type="tel" formControlName="mobile" 
           placeholder="Enter mobile number">
    <mat-error *ngIf="form.get('mobile')?.hasError('required')">
        Mobile number is required
    </mat-error>
    <mat-error *ngIf="form.get('mobile')?.hasError('pattern')">
        Invalid mobile number
    </mat-error>
</mat-form-field>

<!-- After -->
<app-mobile-number-input
    formControlName="mobile"
    label="Mobile Number"
    [required]="true">
</app-mobile-number-input>
```

### From Custom Phone Input

```typescript
// Remove custom validation logic
// Before
const phoneValidators = [
    Validators.required,
    Validators.pattern(/^[6-9]\d{9}$/), // India specific
    Validators.minLength(10),
    Validators.maxLength(10)
];

// After - validation handled by component
const phoneValidators = [Validators.required];
```

## Testing Integration

### Unit Tests

```typescript
import { MobileNumberInputComponent } from '../shared/mobile-number-input';

describe('YourComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MobileNumberInputComponent]
        });
    });
    
    it('should handle mobile number input', () => {
        // Test integration
    });
});
```

### E2E Tests

```typescript
// Cypress tests
it('should accept valid mobile numbers', () => {
    cy.get('app-mobile-number-input input[type="tel"]')
      .type('+919876543210');
      
    cy.get('app-mobile-number-input mat-select')
      .should('contain', 'India');
});
```

## Performance Considerations

### Lazy Loading

```typescript
// Load component only when needed
const MobileInputComponent = () => import('../shared/mobile-number-input');
```

### Bundle Size

The component adds minimal overhead:
- Angular Material modules (already in use)
- Country data (~2KB)
- Component logic (~5KB)

## Troubleshooting

### Common Issues

1. **Module Import Errors**
   ```
   Solution: Ensure MatFormFieldModule, MatSelectModule, MatInputModule are imported
   ```

2. **Styling Issues**
   ```
   Solution: Check CSS custom properties are defined in your theme
   ```

3. **Validation Not Working**
   ```
   Solution: Ensure FormControl is properly bound and component is initialized
   ```

### Debug Mode

Enable debug logging:

```typescript
// In component
(countryChanged)="console.log('Country:', $event)"
(mobileChanged)="console.log('Mobile:', $event)"
```

## Best Practices

1. **Always use with reactive forms** for better validation control
2. **Set appropriate default country** based on user location/preferences
3. **Handle country change events** to update related form fields
4. **Test with various country formats** during development
5. **Use consistent labeling** across your application

## Support

For issues or questions:
1. Check the README.md for detailed API documentation
2. Check the test file for usage patterns
3. Review this integration guide for common scenarios
4. Refer to the component source code for implementation details
