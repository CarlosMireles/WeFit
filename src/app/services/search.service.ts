import { Injectable } from '@angular/core';
import { Firestore, collection, query, orderBy, startAt, endAt, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private firestore: Firestore) {}
  async searchUsersByUsernamePrefix(prefix: string, currentUsername: string) {
    try {
      const usersRef = collection(this.firestore, 'users');
      const q = query(
        usersRef,
        orderBy('username'),
        startAt(prefix),
        endAt(prefix + '\uf8ff')
      );
      const querySnapshot = await getDocs(q);

      const users: any[] = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        if (data['username'] !== currentUsername) {
          users.push({ id: doc.id, ...data });
        }
      });

      return users;
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      throw error;
    }
  }
}
