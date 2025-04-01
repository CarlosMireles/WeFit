import { Injectable } from '@angular/core';
import { collection, Firestore, getDocs, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventsCollection;

  constructor(private firestore: Firestore) {
    this.eventsCollection = collection(this.firestore, 'eventos');
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
}
