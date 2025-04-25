// src/app/services/search.service.ts
import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  query,
  orderBy,
  startAt,
  endAt,
  getDocs
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private firestore: Firestore) {}

  async searchUsersByUsernamePrefix(
    prefix: string,
    currentUsername: string,
    currentUserId: string
  ) {
    try {
      // 1) Cargo mis seguidores
      const meRef = doc(this.firestore, 'users', currentUserId);
      const meSnap = await getDoc(meRef);
      const meData = meSnap.data();
      const myFollowers: string[] = (meData?.['followers'] as string[]) || [];

      // 2) Busco usuarios por prefijo
      const usersRef = collection(this.firestore, 'users');
      const q = query(
        usersRef,
        orderBy('username'),
        startAt(prefix),
        endAt(prefix + '\uf8ff')
      );
      const querySnapshot = await getDocs(q);

      const users: Array<{
        uid: string;
        username: string;
        photoURL: string;
        commonFollowersSample: string[];
        commonFollowersRest: number;
      }> = [];

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const uid = docSnap.id;

        // Evito sugerir tu propio usuario
        if (data['username'] === currentUsername) {
          continue;
        }

        // 3) URL de la foto: uso avatar.jpg si no hay image_url
        const photoURL = (data['image_url'] as string)
          ? data['image_url']
          : 'assets/avatar.jpg';

        // 4) Seguidores en común
        const theirFollowers: string[] = (data['followers'] as string[]) || [];
        const common = theirFollowers.filter(f => myFollowers.includes(f));

        // Tomo hasta 2 ejemplos de username
        const sampleIds = common.slice(0, 2);
        const sampleUsernames: string[] = [];
        for (const sampleId of sampleIds) {
          const uSnap = await getDoc(doc(this.firestore, 'users', sampleId));
          const uData = uSnap.data();
          const uName = uData?.['username'];
          if (uName) {
            sampleUsernames.push(uName);
          }
        }
        const restCount = common.length - sampleUsernames.length;

        users.push({
          uid,
          username: data['username'] as string,
          photoURL,
          commonFollowersSample: sampleUsernames,
          commonFollowersRest: restCount
        });
      }

      return users;
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      throw error;
    }
  }
}
