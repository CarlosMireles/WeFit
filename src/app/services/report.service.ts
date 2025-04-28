// src/app/services/report.service.ts

import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(
    private auth: Auth,
    private userService: UserService
  ) {}

  /**
   * Genera un mailto donde el asunto incluye el username
   * del usuario que reporta, no su correo.
   *
   * @param creatorUsername Username del creador del evento
   * @param eventName Nombre del evento a reportar
   * @returns Enlace mailto con asunto codificado
   */
  async generateMailToLink(
    creatorUsername: string,
    eventName: string
  ): Promise<string> {
    const uid = this.auth.currentUser?.uid;
    let reportingUsername = '';

    if (uid) {
      // Obtenemos los datos del usuario y accedemos con corchetes
      const userData = await this.userService.getUserData(uid);
      reportingUsername =
        (userData?.['username'] as string) ||
        (userData?.['displayName'] as string) ||
        '';
    }

    const subject = `${reportingUsername} reporting event '${eventName}' by ${creatorUsername}`;
    return `mailto:wefit@gmail.com?subject=${encodeURIComponent(subject)}`;
  }
}
