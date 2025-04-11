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
  Query,
  QueryConstraint,
  CollectionReference,
  DocumentData,
  getDoc,
  arrayUnion,
  setDoc
} from '@angular/fire/firestore';
import {UserService} from './user.service';

export interface EventFilters {
  date?: string;             // Ej: '2025-05-15'
  hourMaximum?: string;             // Ej: '18:00'
  hourMinimum?: string       // Ej: '20:00'
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

  constructor(private firestore: Firestore, private userService: UserService) {
    this.eventsCollection = collection(this.firestore, 'eventos');
  }

  // Obtiene eventos aplicando filtros (si se especifica alguno)
  async getFilteredEvents(filters: EventFilters): Promise<any[]> {
    try {
      // Preparamos un arreglo de restricciones para la consulta
      const constraints: QueryConstraint[] = [];

      if (filters.date) {
        constraints.push(where('day', '==', filters.date));
      }
      if (filters.hourMinimum && filters.hourMaximum) {
        // Ambos filtros definidos
        constraints.push(where('hour', '>=', filters.hourMinimum));
        constraints.push(where('hour', '<=', filters.hourMaximum));
      } else if (filters.hourMinimum) {
        // Solo mínimo definido
        constraints.push(where('hour', '>=', filters.hourMinimum));
      } else if (filters.hourMaximum) {
        // Solo máximo definido
        constraints.push(where('hour', '<=', filters.hourMaximum));
      }
      if (filters.sport) {
        constraints.push(where('sport', '==', filters.sport));
      }
      // Solo se añade la restricción si maxParticipants NO es null ni undefined
      if (filters.maxParticipants !== null && filters.maxParticipants !== undefined) {
        constraints.push(where('maxParticipants', '<=', filters.maxParticipants));
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
      console.log('Número de documentos obtenidos:', querySnapshot.size);

      const events = querySnapshot.docs.map(doc => {
        console.log('Documento:', doc.id, doc.data());
        return { id: doc.id, ...doc.data() };
      });

      console.log('Eventos obtenidos del servicio:', events);
      return events;
    } catch (error) {
      console.error('Error al obtener los eventos:', error);
      throw error;
    }
  }


  async createEvent(event: any): Promise<string> {
    try {
      const docRef = await addDoc(this.eventsCollection, event);
      console.log('Evento creado con ID:', docRef.id);

      const userUid = await this.userService.getCurrentUserUid();
      if (userUid) {
        const userDocRef = doc(this.firestore, `users/${userUid}`);

        await setDoc(userDocRef, {
          events_organizing: arrayUnion(docRef.id)
        }, { merge: true });

        console.log('Evento añadido a los eventos organizando del usuario');
      } else {
        console.error('No hay usuario autenticado.');
      }

      return docRef.id;
    } catch (error) {
      console.error('Error al crear el evento:', error);
      throw error;
    }
  }



  async updateEvent(id: string, event: any): Promise<void> {
    try {
      const eventRef = doc(this.firestore, 'eventos', id);  // Referencia al documento del evento
      await updateDoc(eventRef, event);  // Actualizamos los datos del documento
      console.log('Evento actualizado con ID:', id);
    } catch (error) {
      console.error('Error al modificar el evento:', error);
      throw error;
    }
  }


  async deleteEvent(id: string): Promise<void> {
    try {
      const eventRef = doc(this.firestore, 'eventos', id);  // Referencia al documento del evento
      await deleteDoc(eventRef);  // Eliminamos el documento
      console.log('Evento borrado con ID:', id);
    } catch (error) {
      console.error('Error al borrar el evento:', error);
      throw error;
    }
  }

  async getEventById(path: string): Promise<any | null> {
    const eventRef = doc(this.firestore, 'eventos', path);
    const eventSnap = await getDoc(eventRef);
    if (eventSnap.exists()) {
      return eventSnap.data();
    } else {
      throw new Error(path);
    }
  }

  async getEventsFromPaths(paths: string[]): Promise<any[]> {
    const events: any[] = [];

    for (const path of paths) {
      const event = await this.getEventById(path);
      if (event) events.push(event);
    }

    return events;
  }
}
