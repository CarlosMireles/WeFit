import {Injectable} from '@angular/core';
import {collection, Firestore, getDocs} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventosCollection;

  constructor(private firestore: Firestore) {
    // La colección de eventos en Firestore
    this.eventosCollection = collection(this.firestore, 'eventos');
  }

  // Metodo para obtener todos los eventos
  async getEvents() {
    try {
      const querySnapshot = await getDocs(this.eventosCollection);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al obtener los eventos:', error);
      throw error;
    }
  }
}
