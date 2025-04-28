import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private auth: Auth) {}

  generateMailToLink(creatorUsername: string, eventName: string): string {
    const user = this.auth.currentUser;
    const fromEmail = user?.email || '';
    const subject = `${fromEmail} reporting event '${eventName}' by ${creatorUsername}`;
    return `mailto:wefit@gmail.com?subject=${encodeURIComponent(subject)}`;
  }
}

