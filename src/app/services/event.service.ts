import { Injectable } from '@angular/core';
import {
  collection,
  Firestore,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  QueryConstraint,
  CollectionReference,
  DocumentData,
  getDoc,
  arrayUnion,
  setDoc,
  arrayRemove
} from '@angular/fire/firestore';
import { UserService } from './user.service';

export interface EventFilters {
  date?: string;
  hourMaximum?: string;
  hourMinimum?: string;
  sport?: string;
  maxParticipants?: number;
  privacy?: string;
}

@Injectable({ providedIn: 'root' })
export class EventService {
  private eventsCollection: CollectionReference<DocumentData>;

  constructor(
    private firestore: Firestore,
    private userService: UserService
  ) {
    this.eventsCollection = collection(this.firestore, 'eventos');
  }

  private async deleteOldEvents(): Promise<void> {
    const snapshot = await getDocs(this.eventsCollection);
    const todayStr = new Date().toISOString().split('T')[0];
    const toDelete = snapshot.docs.filter(d => {
      const day = (d.data() as any)['day'] as string;
      return day < todayStr;
    });
    for (const d of toDelete) {
      await this.deleteEvent(d.id);
    }
  }

  async getFilteredEvents(filters: EventFilters): Promise<any[]> {
    await this.deleteOldEvents();
    const constraints: QueryConstraint[] = [];

    if (filters.date) {
      constraints.push(where('day', '==', filters.date));
    }
    if (filters.hourMinimum) {
      constraints.push(where('hour', '>=', filters.hourMinimum));
    }
    if (filters.hourMaximum) {
      constraints.push(where('hour', '<=', filters.hourMaximum));
    }
    if (filters.sport) {
      constraints.push(where('sport', '==', filters.sport));
    }
    if (filters.maxParticipants != null) {
      constraints.push(where('maxParticipants', '<=', filters.maxParticipants));
    }
    if (filters.privacy) {
      constraints.push(where('privacy', '==', filters.privacy));
    }

    const q = constraints.length
      ? query(this.eventsCollection, ...constraints)
      : this.eventsCollection;

    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  }

  async getEvents(): Promise<any[]> {
    const snap = await getDocs(this.eventsCollection);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  }

  async getEventById(id: string): Promise<any> {
    const ref = doc(this.firestore, 'eventos', id);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('Evento no encontrado');
    return snap.data();
  }

  async getEventsFromPaths(paths: string[]): Promise<any[]> {
    const events: any[] = [];
    for (const path of paths) {
      try {
        const data = await this.getEventById(path);
        events.push({ id: path, ...data });
      } catch {
        // ignorar si no existe
      }
    }
    return events;
  }

  async createEvent(event: any): Promise<string> {
    const ref = await addDoc(this.eventsCollection, event);
    const uid = await this.userService.getCurrentUserUid();
    if (uid) {
      const userRef = doc(this.firestore, `users/${uid}`);
      await setDoc(
        userRef,
        { ['events_organizing']: arrayUnion(ref.id) },
        { merge: true }
      );
    }
    return ref.id;
  }

  async updateEvent(id: string, data: any): Promise<void> {
    const ref = doc(this.firestore, 'eventos', id);
    await updateDoc(ref, data);
  }

  async deleteEvent(id: string): Promise<void> {
    const ref = doc(this.firestore, 'eventos', id);
    await deleteDoc(ref);
  }

  async joinEvent(eventId: string, userId: string): Promise<void> {
    const evRef = doc(this.firestore, `eventos/${eventId}`);
    const uRef = doc(this.firestore, `users/${userId}`);
    await updateDoc(evRef, { ['participants']: arrayUnion(userId) });
    await updateDoc(uRef, { ['events_attending']: arrayUnion(eventId) });
  }

  async leaveEvent(eventId: string, userId: string): Promise<void> {
    const evRef = doc(this.firestore, `eventos/${eventId}`);
    const uRef = doc(this.firestore, `users/${userId}`);
    await updateDoc(evRef, { ['participants']: arrayRemove(userId) });
    await updateDoc(uRef, { ['events_attending']: arrayRemove(eventId) });
  }
}
