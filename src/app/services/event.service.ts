import { Injectable } from '@angular/core';
import { collection, Firestore, getDocs, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventosCollection;

  constructor(private firestore: Firestore) {
    // Inicializamos la colección de eventos en Firestore
    this.eventosCollection = collection(this.firestore, 'eventos');
  }

  /**
   * Método para obtener todos los eventos desde Firestore.
   * @returns Un array de eventos obtenidos.
   */
  async getEvents(): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(this.eventosCollection);
      console.log('Número de documentos obtenidos:', querySnapshot.size);

      const eventos = querySnapshot.docs.map(doc => {
        console.log('Documento:', doc.id, doc.data());
        return { id: doc.id, ...doc.data() };
      });

      console.log('Eventos obtenidos del servicio:', eventos);
      return eventos;
    } catch (error) {
      console.error('Error al obtener los eventos:', error);
      throw error;
    }
  }

  /**
   * Método para crear un nuevo evento en Firestore.
   * @param evento Los datos del evento a crear.
   * @returns El ID del evento creado.
   */
  async createEvent(evento: any): Promise<string> {
    try {
      const docRef = await addDoc(this.eventosCollection, evento);
      console.log('Evento creado con ID:', docRef.id);
      return docRef.id;  // Retornamos el ID del documento creado
    } catch (error) {
      console.error('Error al crear el evento:', error);
      throw error;
    }
  }

  /**
   * Método para modificar un evento existente en Firestore.
   * @param id El ID del evento a modificar.
   * @param evento Los nuevos datos del evento a actualizar.
   */
  async updateEvent(id: string, evento: any): Promise<void> {
    try {
      const eventoRef = doc(this.firestore, 'eventos', id);  // Referencia al documento del evento
      await updateDoc(eventoRef, evento);  // Actualizamos los datos del documento
      console.log('Evento actualizado con ID:', id);
    } catch (error) {
      console.error('Error al modificar el evento:', error);
      throw error;
    }
  }

  /**
   * Método para borrar un evento de Firestore.
   * @param id El ID del evento a borrar.
   */
  async deleteEvent(id: string): Promise<void> {
    try {
      const eventoRef = doc(this.firestore, 'eventos', id);  // Referencia al documento del evento
      await deleteDoc(eventoRef);  // Eliminamos el documento
      console.log('Evento borrado con ID:', id);
    } catch (error) {
      console.error('Error al borrar el evento:', error);
      throw error;
    }
  }
}
