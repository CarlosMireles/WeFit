import { Injectable } from '@angular/core';
import {doc, Firestore, getDoc, setDoc} from '@angular/fire/firestore';
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, user, User} from '@angular/fire/auth';
import {DocumentData} from '@angular/fire/compat/firestore';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser$: Observable<User | null>;

  constructor(private firestore: Firestore, private auth: Auth) {
    this.currentUser$ = user(this.auth);
  }

  async registerUser(email: string, password: string, username: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      const userRef = doc(this.firestore, `users/${user.uid}`);

      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        username: username,
        image_url: "",
        events_organizing: [],
        events_attending: [],
        createdAt: new Date()
      });

      return user;
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      throw error;
    }
  }

  async loginUser(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  }

  async getUserData(uid: string | null): Promise<{
    username: string;
    events_attending: string[];
    events_organizing: string[];
    image_url: string
  } | null> {
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as DocumentData;
        return {
          username: data['username'] || '',
          events_attending: data['events_attending'] || [],
          events_organizing: data['events_organizing'] || [],
          image_url: data['image_url'] || ''
        };
      } else {
        console.warn('No existe el usuario con UID:', uid);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      return null;
    }
  }

  getCurrentUserUid(): Promise<string | null> {
    return new Promise((resolve) => {
      this.auth.onAuthStateChanged(user => {
        resolve(user ? user.uid : null);
      });
    });
  }
}
