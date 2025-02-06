import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-input',
  standalone: true,
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {
  @Output() categorySelected = new EventEmitter<string>();

  updateCategory(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value.trim();
    this.categorySelected.emit(inputValue);
  }
}