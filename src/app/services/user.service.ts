import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  DocumentData
} from '@angular/fire/firestore';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  user as authState,
  User
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
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
    const credential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    const u = credential.user;
    const userRef = doc(this.firestore, `users/${u.uid}`);
    await setDoc(userRef, {
      ['uid']: u.uid,
      ['email']: u.email,
      ['username']: username,
      ['image_url']: '',
      ['description']: '',
      ['events_organizing']: [],
      ['events_attending']: [],
      ['follows']: [],
      ['followers']: [],
      ['createdAt']: new Date()
    });
    return u;
  }

  async loginUser(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    return credential.user;
  }

  async getUserData(
    uid: string | null
  ): Promise<{
    ['username']: string;
    ['events_attending']: string[];
    ['events_organizing']: string[];
    ['image_url']: string;
    ['follows']: string[];
    ['followers']: string[];
    ['description']: string;
  } | null> {
    if (!uid) return null;
    const userRef = doc(this.firestore, `users/${uid}`);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return null;
    const data = snap.data() as DocumentData;
    return {
      ['username']: data['username'] || '',
      ['events_attending']: data['events_attending'] || [],
      ['events_organizing']: data['events_organizing'] || [],
      ['image_url']: data['image_url'] || '',
      ['follows']: data['follows'] || [],
      ['followers']: data['followers'] || [],
      ['description']: data['description'] || ''
    };
  }

  async getUserById(uid: string): Promise<DocumentData> {
    const userRef = doc(this.firestore, `users/${uid}`);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      throw new Error(`Usuario ${uid} no encontrado`);
    }
    return snap.data() as DocumentData;
  }

  getCurrentUserUid(): Promise<string | null> {
    return new Promise(resolve => {
      this.auth.onAuthStateChanged(u => resolve(u ? u.uid : null));
    });
  }
}
