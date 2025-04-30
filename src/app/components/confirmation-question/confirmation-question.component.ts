import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-question',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-question.component.html',
  styleUrl: './confirmation-question.component.css'
})
export class ConfirmationQuestionComponent {
  @Input() title: string = '¿Estás seguro?';
  @Input() message: string = '¿Quieres continuar con esta acción?';
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Cancelar';
  @Input() visible: boolean = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
