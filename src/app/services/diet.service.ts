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
  collectionData,
  CollectionReference,
  DocumentData
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Diet } from '../models/diet';

// Para crear/editar dietas sin id ni userId
export type NewDiet = Omit<Diet, 'id' | 'userId'>;

@Injectable({ providedIn: 'root' })
export class DietService {
  private dietsCollection: CollectionReference<DocumentData>;

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {
    // Inicializamos aquí, ya con this.firestore disponible
    this.dietsCollection = collection(this.firestore, 'diets');
  }

  /** Crea una dieta; el servicio añade userId y fecha */
  async createDiet(diet: NewDiet): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) throw new Error('Usuario no autenticado');
    const docData = {
      ...diet,
      userId: uid,
      createdAt: new Date()
    };
    await addDoc(this.dietsCollection, docData);
  }

  /** Obtiene las dietas del usuario autenticado */
  async getUserDiets(): Promise<Diet[]> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return [];
    const q = query(this.dietsCollection, where('userId', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Diet[];
  }

  /** Observa las dietas de cualquier UID */
  getUserDietsByUid$(uid: string): Observable<Diet[]> {
    const q = query(this.dietsCollection, where('userId', '==', uid));
    return collectionData(q, { idField: 'id' }) as Observable<Diet[]>;
  }

  /** Recupera una dieta por su ID */
  async getDietById(id: string): Promise<Diet | null> {
    const ref = doc(this.firestore, 'diets', id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as any) } as Diet;
  }

  /** Actualiza solo los campos indicados */
  async updateDiet(id: string, data: Partial<NewDiet>): Promise<void> {
    const ref = doc(this.firestore, 'diets', id);
    await updateDoc(ref, data as any);
  }

  /** Elimina una dieta */
  async deleteDiet(id: string): Promise<void> {
    const ref = doc(this.firestore, 'diets', id);
    await deleteDoc(ref);
  }
}
