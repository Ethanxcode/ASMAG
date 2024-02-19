import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class Toast {
  constructor(private messageService: MessageService) {}

  showSuccess(string: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: string
    });
  }

  showInfo(string: string) {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: string
    });
  }

  showWarn(string: string) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warn',
      detail: string
    });
  }

  showError(string: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: string
    });
  }
}
