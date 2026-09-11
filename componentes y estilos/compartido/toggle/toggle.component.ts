import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-toggle',
  standalone: true,
  template: `
    <label class="inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        class="sr-only peer"
        [checked]="value"
        [disabled]="disabled"
        (change)="onToggle($event)">
      <div class="relative w-9 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#1c3766]/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1c3766]"></div>
      <span class="select-none ms-3 text-sm font-semibold text-gray-700">{{ label }}</span>
    </label>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleComponent),
      multi: true
    }
  ]
})
export class ToggleComponent implements ControlValueAccessor {
  @Input() label: string = 'Toggle me';
  
  value: boolean = false;
  disabled: boolean = false;
  
  onChange: any = () => {};
  onTouch: any = () => {};
  
  onToggle(event: any) {
    if (this.disabled) return;
    this.value = event.target.checked;
    this.onChange(this.value);
    this.onTouch();
  }
  
  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      this.value = value;
    }
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
