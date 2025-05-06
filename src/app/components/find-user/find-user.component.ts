import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../services/search.service';
import { UserService } from '../../services/user.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-find-user',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './find-user.component.html',
  styleUrls: ['./find-user.component.css']
})
export class FindUserComponent implements OnInit, AfterViewInit {
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  searchResults: Array<{
    uid: string;
    username: string;
    photoURL: string;
    commonFollowersSample: string[];
    commonFollowersRest: number;
  }> = [];
  selectedUid: string | null = null;

  currentUsername: string = 'currentUserName';
  currentUserId: string | null = null;

  constructor(
    private searchService: SearchService,
    private userService: UserService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.currentUserId = await this.userService.getCurrentUserUid();
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchInput.nativeElement, 'input').pipe(
      map((e: any) => e.target.value.trim()),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(async term => {
      this.selectedUid = null;
      if (!term) {
        this.searchResults = [];
        return;
      }
      if (!this.currentUserId) {
        this.currentUserId = await this.userService.getCurrentUserUid();
        if (!this.currentUserId) return;
      }
      try {
        this.searchResults = await this.searchService.searchUsersByUsernamePrefix(
          term,
          this.currentUsername,
          this.currentUserId!
        );
      } catch (err) {
        console.error(err);
      }
    });
  }

  async onSearchClick() {
    const term = this.searchInput.nativeElement.value.trim();
    if (!term) {
      this.searchResults = [];
      this.selectedUid = null;
      return;
    }
    if (!this.currentUserId) {
      this.currentUserId = await this.userService.getCurrentUserUid();
      if (!this.currentUserId) return;
    }
    if (!this.selectedUid) {
      try {
        this.searchResults = await this.searchService.searchUsersByUsernamePrefix(
          term,
          this.currentUsername,
          this.currentUserId!
        );
        this.selectedUid = this.searchResults[0]?.uid || null;
      } catch (err) {
        console.error('Error en búsqueda:', err);
      }
    }
    if (!this.selectedUid) return;

    if (this.selectedUid === this.currentUserId) {
      this.router.navigate(['/userProfile']);
    } else {
      this.router.navigate(['/profile-search', this.selectedUid]);
    }
  }

  selectUser(user: any) {
    // ——— Guardo en historial ———
    const raw = localStorage.getItem('search_counts');
    const map: Record<string, number> = raw ? JSON.parse(raw) : {};
    map[user.uid] = (map[user.uid] || 0) + 1;
    localStorage.setItem('search_counts', JSON.stringify(map));
    // ————————————————

    this.searchInput.nativeElement.value = user.username;
    this.searchResults = [];
    this.selectedUid = user.uid;
  }
}
