// src/app/services/diet.service.ts

import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  setDoc
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Diet } from '../models/diet';
import { collectionData } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class DietService {
  private dietsCollection;

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {
    this.dietsCollection = collection(this.firestore, 'diets');
  }

  async createDiet(diet: Diet): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) throw new Error('Usuario no autenticado');
    const docData = { ...diet, userId: uid, createdAt: new Date() };
    console.log('Creating diet:', docData);
    await addDoc(this.dietsCollection, docData);
  }

  async getUserDiets(): Promise<Diet[]> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return [];
    const q = query(this.dietsCollection, where('userId', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  }

  getUserDietsByUid$(uid: string): Observable<Diet[]> {
    const q = query(this.dietsCollection, where('userId', '==', uid));
    return collectionData(q, { idField: 'id' }) as Observable<Diet[]>;
  }

  async getDietById(id: string): Promise<Diet | null> {
    const ref = doc(this.firestore, 'diets', id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as any) };
  }

  async updateDiet(id: string, data: Partial<Diet>): Promise<void> {
    const ref = doc(this.firestore, 'diets', id);
    console.log(`Updating diet ${id} with`, data);
    await setDoc(ref, data, { merge: true });
    console.log(`Diet ${id} updated`);
  }

  async deleteDiet(id: string): Promise<void> {
    const ref = doc(this.firestore, 'diets', id);
    console.log(`Deleting diet ${id}`);
    await deleteDoc(ref);
    console.log(`Diet ${id} deleted`);
  }
}
