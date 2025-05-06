import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LanguageService} from '../../services/translate.service';

@Component({
  selector: 'app-confirmation-question',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-question.component.html',
  styleUrl: './confirmation-question.component.css'
})
export class ConfirmationQuestionComponent {
  @Input() title: string = 'edit-profile.confirmation-title';
  @Input() message: string = 'edit-profile.confirmation-message';
  @Input() confirmText: string = 'edit-profile.confirmation-text';
  @Input() cancelText: string = 'edit-profile.confirmation-cancel';
  @Input() visible: boolean = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor(private langService: LanguageService) { }

  async ngOnInit() {
    const lang = this.langService.currentLang;
    await this.langService.changeLang(lang);
  }


  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
