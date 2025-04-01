import { Injectable } from '@angular/core';
import {doc, Firestore, setDoc} from '@angular/fire/firestore';
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: Firestore, private auth: Auth) {}

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
}
