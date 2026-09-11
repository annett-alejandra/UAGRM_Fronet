import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './textarea.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() rows: number = 2;
  @Input() maxLength: number = 300;
  @Input() invalido: boolean = false;
  
  value: string = '';
  isDisabled: boolean = false;

  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(value: any): void {
    this.value = value || '';
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInput(event: Event) {
    const val = (event.target as HTMLTextAreaElement).value;
    this.value = val;
    this.onChange(val);
    this.onTouch();
  }

  get remainingChars(): number {
    return this.maxLength - this.value.length;
  }

  get isLimitReached(): boolean {
    return this.remainingChars <= 0;
  }

  get isNearLimit(): boolean {
    return this.remainingChars > 0 && this.remainingChars <= 15;
  }
}
