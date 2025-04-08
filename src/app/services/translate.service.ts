import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  constructor(private translate: TranslateService) {
    this.translate.addLangs(['es', 'en']);
    this.translate.setDefaultLang('es');
  }

  changeLang(lang: string) {
    this.translate.use(lang);
  }

  get currentLang(): string {
    return this.translate.currentLang;
  }

  translateKey(key: string): string {
    return this.translate.instant(key);
  }

  getTranslation(key: string) {
    return this.translate.get(key);
  }
}
