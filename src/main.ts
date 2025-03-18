import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDxjryGnYkp6In-t_kfomLO-wq_hty76q0",
  authDomain: "wefit-5a03f.firebaseapp.com",
  projectId: "wefit-5a03f",
  storageBucket: "wefit-5a03f.appspot.com",
  messagingSenderId: "825832331908",
  appId: "1:825832331908:web:6b0e8f7696f908d11400d1",
  measurementId: "G-J12Y075NCD"
};

bootstrapApplication(AppComponent, {
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ]
});
