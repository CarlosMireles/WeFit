// src/app/components/find-history/find-history.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../services/search.service';
import { UserService } from '../../services/user.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-find-history',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './find-history.component.html',
  styleUrls: ['./find-history.component.css']
})
export class FindHistoryComponent implements OnInit {
  currentUserId: string | null = null;

  users: Array<{
    uid: string;
    username: string;
    photoURL: string;
    commonFollowersSample: string[];
    commonFollowersRest: number;
  }> = [];

  constructor(
    private searchService: SearchService,
    private userService: UserService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.currentUserId = await this.userService.getCurrentUserUid();
    if (!this.currentUserId) return;

    // 1) leo histórico de búsquedas (uid -> count)
    const raw = localStorage.getItem('search_counts');
    let historyIds: string[] = [];
    if (raw) {
      const map: Record<string, number> = JSON.parse(raw);
      historyIds = Object.entries(map)
        .sort(([, a], [, b]) => b - a)     // del más buscado al menos
        .map(([uid]) => uid)
        .filter(uid => uid !== this.currentUserId!); // excluyo siempre al propio usuario
    }

    // 2) preparo lista final de hasta 10 UIDs
    let finalIds: string[] = [];

    if (historyIds.length > 0) {
      finalIds = historyIds.slice(0, 10);
    }

    if (finalIds.length < 10) {
      // relleno con recomendaciones sin repetir ni al propio usuario
      const recs = await this.searchService.getRecommendations(this.currentUserId, 10);
      const recIds = recs
        .map(r => r.uid)
        .filter(uid =>
          uid !== this.currentUserId &&   // no recomendar al propio usuario
          !finalIds.includes(uid)         // no repetir IDs ya en histórico
        );
      const need = 10 - finalIds.length;
      finalIds = finalIds.concat(recIds.slice(0, need));
    }

    // 3) cargo datos de esos UIDs
    if (finalIds.length > 0) {
      this.users = await this.searchService.getUsersByIds(finalIds, this.currentUserId);
    }
  }

  goTo(u: { uid: string }) {
    if (!this.currentUserId) return;
    if (u.uid === this.currentUserId) {
      this.router.navigate(['/userProfile']);
    } else {
      this.router.navigate(['/profile-search', u.uid]);
    }
  }
}
