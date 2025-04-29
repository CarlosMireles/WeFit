import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  DocumentData
} from '@angular/fire/firestore';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  user as authState,
  User, sendPasswordResetEmail
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser$: Observable<User | null>;

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {
    this.currentUser$ = authState(this.auth);
  }

  async registerUser(
    email: string,
    password: string,
    username: string
  ): Promise<User> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    const u = credential.user;
    await sendEmailVerification(u);
    const userRef = doc(this.firestore, `users/${u.uid}`);
    await setDoc(userRef, {
      uid: u.uid,
      email: u.email,
      username,
      image_url: '',
      description: '',
      follows: [],
      followers: [],
      events_organizing: [],
      events_attending: [],
      createdAt: new Date()
    });
    return u;
  }

  async loginUser(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    return credential.user;
  }

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  async getUserData(uid: string | null): Promise<DocumentData | null> {
    if (!uid) return null;
    const ref = doc(this.firestore, `users/${uid}`);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as DocumentData) : null;
  }

  async getUserById(uid: string): Promise<DocumentData> {
    const ref = doc(this.firestore, `users/${uid}`);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error(`Usuario ${uid} no encontrado`);
    return snap.data() as DocumentData;
  }

  getCurrentUserUid(): Promise<string | null> {
    return new Promise(resolve => {
      this.auth.onAuthStateChanged(u => resolve(u ? u.uid : null));
    });
  }

  async followUser(targetUid: string): Promise<void> {
    const me = await this.getCurrentUserUid();
    if (!me) throw new Error('No hay usuario autenticado');
    const meRef = doc(this.firestore, `users/${me}`);
    const targetRef = doc(this.firestore, `users/${targetUid}`);
    await updateDoc(meRef,   { follows:   arrayUnion(targetUid) });
    await updateDoc(targetRef,{ followers: arrayUnion(me)         });
  }

  async unfollowUser(targetUid: string): Promise<void> {
    const me = await this.getCurrentUserUid();
    if (!me) throw new Error('No hay usuario autenticado');
    const meRef = doc(this.firestore, `users/${me}`);
    const targetRef = doc(this.firestore, `users/${targetUid}`);
    await updateDoc(meRef,   { follows:   arrayRemove(targetUid) });
    await updateDoc(targetRef,{ followers: arrayRemove(me)         });
  }

  async updateUsername(newUsername: string): Promise<void> {
    const uid = await this.getCurrentUserUid();
    if (!uid) throw new Error('No hay usuario autenticado');

    const userRef = doc(this.firestore, `users/${uid}`);
    await updateDoc(userRef, { username: newUsername });
  }

  async updateProfilePicture(newImageUrl: string): Promise<void> {
    const uid = await this.getCurrentUserUid();
    if (!uid) throw new Error('No hay usuario autenticado');

    const userRef = doc(this.firestore, `users/${uid}`);
    await updateDoc(userRef, { image_url: newImageUrl });
  }

  async updateDescription(newDescription: string): Promise<void> {
    const uid = await this.getCurrentUserUid();
    if (!uid) throw new Error('No hay usuario autenticado');

    const userRef = doc(this.firestore, `users/${uid}`);
    await updateDoc(userRef, { description: newDescription });
  }
}
