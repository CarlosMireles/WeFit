import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {doc, Firestore, getDoc, setDoc} from '@angular/fire/firestore';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  constructor(private translate: TranslateService, private firestore: Firestore, private http: HttpClient) {
    this.translate.addLangs(['es', 'en']);
    this.translate.setDefaultLang('es');
    this.translate.use('es');
  }

    async changeLang(lang: string) {
      let json = await this.getJSONFromFirestore(lang);

      if (!json) {
        const baseJson = await this.getJSONFromFirestore('es');
        if (!baseJson) {
          console.warn('No se encontró traducción base en español');
          return;
        }

        try {
          json = await this.translateViaBackend(baseJson, lang);
          await this.saveTranslationToFirestore(lang, json);
        } catch (error) {
          console.error('Error traduciendo:', error);
          return;
        }
      }

      this.setTranslation(lang, json, true);
      this.translate.use(lang);
    }

  translateViaBackend(json: any, targetLang: string): Promise<any> {
    return lastValueFrom(
      this.http.post('http://localhost:5000/translate', {
        text: json,
        target: targetLang
      })
    );
  }

  async saveTranslationToFirestore(lang: string, data: any) {
    const ref = doc(this.firestore, 'translations', lang);
    await setDoc(ref, data);
  }

  async getJSONFromFirestore(lang: string): Promise<any | null> {
    const ref = doc(this.firestore, 'translations', lang);
    const snapshot = await getDoc(ref);
    return snapshot.exists() ? snapshot.data() : null;
  }

  setTranslation(lang: string, json: any, boolean: boolean) {
    this.translate.setTranslation(lang, json, boolean);
  }

  get currentLang(): string {
    return this.translate.currentLang;
  }


  }
