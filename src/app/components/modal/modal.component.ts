import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() isVisible: boolean = false;
  @Input() title: string = 'Default Title';
  @Input() message: string = 'Default Message';
  @Input() modalType: 'text' | 'image' | 'apiKey' = 'text';
  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmModal = new EventEmitter<string | void>();

  inputApiKey: string = '';

  close() {
    this.isVisible = false;
    this.closeModal.emit();
  }

  confirm() {
    if (this.modalType === 'apiKey') {
      this.confirmModal.emit(this.inputApiKey);
    } else {
      this.confirmModal.emit();
    }
    this.isVisible = false;
  }
}
