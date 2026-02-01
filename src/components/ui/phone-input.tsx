import * as React from "react";
import * as RPNInput from "react-phone-number-input";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Normalizes Russian phone number to E164 format (+7XXXXXXXXXX)
 */
function normalizeRussianPhone(input: string): string {
    const hasPlus = input.startsWith('+');
    const digits = input.replace(/\D/g, '');
    
    if (digits.length === 0) return '+7';
    
    if (hasPlus) {
        if (digits.startsWith('7')) {
            return '+' + digits;
        }
        return '+7' + digits;
    }
    
    if (digits.length === 11) {
        if (digits.startsWith('7') || digits.startsWith('8')) {
            return '+7' + digits.slice(1);
        }
    }
    
    if (digits.length === 10) {
        return '+7' + digits;
    }
    
    if (digits.startsWith('8')) {
        return '+7' + digits.slice(1);
    }
    
    if (digits.startsWith('7')) {
        return '+' + digits;
    }
    
    return '+7' + digits;
}

type PhoneInputProps = Omit<
    React.ComponentProps<"input">,
    "onChange" | "value" | "ref"
> &
    Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
        onChange?: (value: RPNInput.Value) => void;
    };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
    React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
        ({ className, onChange, value, ...props }, ref) => {
            const handleChange = React.useCallback((newValue: RPNInput.Value | undefined) => {
                if (!newValue || newValue === '') {
                    // Always keep +7 as minimum
                    onChange?.('+7' as RPNInput.Value);
                    return;
                }
                
                // Normalize the value
                const normalized = normalizeRussianPhone(newValue);
                onChange?.(normalized as RPNInput.Value);
            }, [onChange]);

            // Ensure value always has +7 prefix
            const normalizedValue = React.useMemo(() => {
                if (!value || value === '') return '+7';
                return normalizeRussianPhone(value);
            }, [value]);

            return (
                <RPNInput.default
                    ref={ref}
                    className={cn("flex", className)}
                    inputComponent={InputComponent}
                    countrySelectComponent={() => null}
                    defaultCountry="RU"
                    countries={["RU"]}
                    international
                    countryCallingCodeEditable={false}
                    limitMaxLength
                    smartCaret={false}
                    value={normalizedValue as RPNInput.Value}
                    onChange={handleChange}
                    {...props}
                />
            );
        },
    );
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<
    HTMLInputElement,
    React.ComponentProps<"input">
>(({ className, onPaste, ...props }, ref) => {
    const handlePaste = React.useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        const normalized = normalizeRussianPhone(pastedText);
        
        // Trigger onChange with normalized value
        const nativeEvent = new Event('input', { bubbles: true });
        const input = e.currentTarget;
        
        // Set the normalized value
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value'
        )?.set;
        
        nativeInputValueSetter?.call(input, normalized);
        input.dispatchEvent(nativeEvent);
        
        onPaste?.(e);
    }, [onPaste]);

    return (
        <Input
            className={cn("rounded-lg", className)}
            {...props}
            ref={ref}
            onPaste={handlePaste}
            maxLength={16}
        />
    );
});
InputComponent.displayName = "InputComponent";

export { PhoneInput };
