import { Injectable } from '@angular/core';
import { collection, Firestore, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, Query, QueryConstraint, CollectionReference, DocumentData } from '@angular/fire/firestore';

export interface EventFilters {
  date?: string;             // Ej: '2025-05-15'
  hour?: string;             // Ej: '18:00'
  sport?: string;            // Ej: 'fútbol'
  maxParticipants?: number;  // Ej: 20
  privacy?: string;          // Ej: 'Público' o 'Privado'
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  // Especificamos el tipo CollectionReference<DocumentData>
  private eventsCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.eventsCollection = collection(this.firestore, 'eventos');
  }

  // Obtiene eventos aplicando filtros (si se especifica alguno)
  async getFilteredEvents(filters: EventFilters): Promise<any[]> {
    try {
      // Preparamos un arreglo de restricciones para la consulta
      const constraints: QueryConstraint[] = [];

      if (filters.date) {
        constraints.push(where('date', '==', filters.date));
      }
      if (filters.hour) {
        constraints.push(where('hour', '==', filters.hour));
      }
      if (filters.sport) {
        constraints.push(where('sport', '==', filters.sport));
      }
      // Solo se añade la restricción si maxParticipants NO es null ni undefined
      if (filters.maxParticipants !== null && filters.maxParticipants !== undefined) {
        constraints.push(where('maxParticipants', '==', filters.maxParticipants));
      }
      if (filters.privacy) {
        constraints.push(where('privacy', '==', filters.privacy));
      }

      // Declaramos q como Query<DocumentData>
      let q: Query<DocumentData> = this.eventsCollection;
      if (constraints.length > 0) {
        q = query(this.eventsCollection, ...constraints);
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error al obtener eventos filtrados:', error);
      throw error;
    }
  }

  async getEvents(): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(this.eventsCollection);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error al obtener los eventos:', error);
      throw error;
    }
  }

  async createEvent(event: any): Promise<string> {
    try {
      const docRef = await addDoc(this.eventsCollection, event);
      return docRef.id;
    } catch (error) {
      console.error('Error al crear el evento:', error);
      throw error;
    }
  }

  async updateEvent(id: string, event: any): Promise<void> {
    try {
      const eventRef = doc(this.firestore, 'eventos', id);
      await updateDoc(eventRef, event);
    } catch (error) {
      console.error('Error al modificar el evento:', error);
      throw error;
    }
  }

  async deleteEvent(id: string): Promise<void> {
    try {
      const eventRef = doc(this.firestore, 'eventos', id);
      await deleteDoc(eventRef);
    } catch (error) {
      console.error('Error al borrar el evento:', error);
      throw error;
    }
  }
}
