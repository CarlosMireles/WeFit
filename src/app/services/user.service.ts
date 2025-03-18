import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';

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
        createdAt: new Date()
      });

      return user;
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      throw error;
    }
  }
}
