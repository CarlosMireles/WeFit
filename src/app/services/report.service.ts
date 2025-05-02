import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly REPORT_EMAIL = 'wefitreportsection@gmail.com';

  constructor(
    private auth: Auth,
    private userService: UserService
  ) {}

  async getGmailComposeUrl(
    creatorUsername: string,
    eventName: string
  ): Promise<string> {
    const uid = this.auth.currentUser?.uid;
    let reportingUsername = '';
    if (uid) {
      const userData = await this.userService.getUserData(uid);
      reportingUsername =
        (userData?.['username'] as string) ||
        (userData?.['displayName'] as string) ||
        '';
    }

    const subject = `${reportingUsername} reporting event '${eventName}' by ${creatorUsername}`;

    const base = 'https://mail.google.com/mail/u/0/';
    const params = new URLSearchParams({
      view: 'cm',
      fs: '1',
      to: this.REPORT_EMAIL,
      su: subject
    });
    return `${base}?${params.toString()}`;
  }
}
