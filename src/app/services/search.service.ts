import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  startAt,
  endAt
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private firestore: Firestore) {}

  /**
   * Busca usuarios cuyo username empiece por prefix,
   * excluye currentUsername, y calcula foto + seguidores en común.
   */
  async searchUsersByUsernamePrefix(
    prefix: string,
    currentUsername: string,
    currentUserId: string
  ) {
    try {
      // 1) Cargo mis seguidores
      const meSnap = await getDoc(doc(this.firestore, 'users', currentUserId));
      const myFollowers: string[] = (meSnap.data()?.['followers'] as string[]) || [];

      // 2) Query de usuarios por prefijo
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

      // 3) Recorro resultados
      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const uid = docSnap.id;

        // no autocompletarse a uno mismo
        if (data['username'] === currentUsername) continue;

        // foto: si no tiene image_url uso avatar.jpg
        const photoURL = (data['image_url'] as string)
          ? data['image_url']
          : 'assets/avatar.jpg';

        // seguidores en común
        const theirFollowers: string[] = (data['followers'] as string[]) || [];
        const common = theirFollowers.filter(f => myFollowers.includes(f));

        // tomo hasta 2 ejemplos de username
        const sampleIds = common.slice(0, 2);
        const sampleUsernames: string[] = [];
        for (const sId of sampleIds) {
          const uSnap = await getDoc(doc(this.firestore, 'users', sId));
          const uName = uSnap.data()?.['username'];
          if (uName) sampleUsernames.push(uName);
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

  /**
   * Dada una lista de UIDs, carga foto, username y
   * seguidores en común respecto a currentUserId.
   */
  async getUsersByIds(
    ids: string[],
    currentUserId: string
  ): Promise<Array<{
    uid: string;
    username: string;
    photoURL: string;
    commonFollowersSample: string[];
    commonFollowersRest: number;
  }>> {
    // cargo mis seguidores
    const meSnap = await getDoc(doc(this.firestore, 'users', currentUserId));
    const myFollowers: string[] = (meSnap.data()?.['followers'] as string[]) || [];

    const results = [];
    for (const uid of ids) {
      const snap = await getDoc(doc(this.firestore, 'users', uid));
      if (!snap.exists()) continue;
      const data = snap.data()!;
      const photoURL = (data['image_url'] as string)
        ? data['image_url']
        : 'assets/avatar.jpg';
      // seguidores en común
      const theirFollowers: string[] = (data['followers'] as string[]) || [];
      const common = theirFollowers.filter(f => myFollowers.includes(f));
      const sampleIds = common.slice(0, 2);
      const sampleUsernames: string[] = [];
      for (const sId of sampleIds) {
        const uSnap = await getDoc(doc(this.firestore, 'users', sId));
        const uName = uSnap.data()?.['username'];
        if (uName) sampleUsernames.push(uName);
      }
      const restCount = common.length - sampleUsernames.length;
      results.push({
        uid,
        username: data['username'] as string,
        photoURL,
        commonFollowersSample: sampleUsernames,
        commonFollowersRest: restCount
      });
    }
    return results;
  }

  async getRecommendations(
    currentUserId: string,
    limitCount = 5
  ): Promise<Array<{ uid: string }>> {
    const usersRef = collection(this.firestore, 'users');
    const allSnaps = await getDocs(usersRef);
    const arr: Array<{ uid: string; count: number }> = [];
    allSnaps.forEach(d => {
      if (d.id === currentUserId) return;
      const cnt = (d.data()['followers'] as string[])?.length || 0;
      arr.push({ uid: d.id, count: cnt });
    });
    // orden descendente por count
    arr.sort((a, b) => b.count - a.count);
    return arr.slice(0, limitCount).map(x => ({ uid: x.uid }));
  }
}
