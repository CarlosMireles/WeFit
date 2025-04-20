import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../services/search.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-find-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './find-user.component.html',
  styleUrls: ['./find-user.component.css']
})
export class FindUserComponent implements OnInit, AfterViewInit {
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  searchResults: Array<{ uid: string; username: string }> = [];
  selectedUid: string | null = null;

  currentUsername: string = 'currentUserName';
  currentUserId: string | null = null;

  constructor(
    private searchService: SearchService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.getCurrentUserUid().then(uid => {
      this.currentUserId = uid;
    });
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchInput.nativeElement, 'input').pipe(
      map((event: any) => event.target.value),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((text: string) => {
      const term = text.trim();
      this.selectedUid = null;  // reset selección al escribir
      if (term) {
        this.searchService
          .searchUsersByUsernamePrefix(term, this.currentUsername)
          .then(results => this.searchResults = results)
          .catch(err => console.error(err));
      } else {
        this.searchResults = [];
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

    if (!this.selectedUid) {
      try {
        this.searchResults = await this.searchService
          .searchUsersByUsernamePrefix(term, this.currentUsername);
        if (this.searchResults.length > 0) {
          this.selectedUid = this.searchResults[0].uid;
        }
      } catch (err) {
        console.error('Error en búsqueda:', err);
      }
    }

    if (!this.selectedUid) return;

    // Navegar según sea tu propio perfil o el de otro
    if (this.selectedUid === this.currentUserId) {
      this.router.navigate(['/userProfile']);
    } else {
      this.router.navigate(['/profile-search', this.selectedUid]);
    }
  }

  selectUser(user: { uid: string; username: string }) {
    this.searchInput.nativeElement.value = user.username;
    this.searchResults = [];
    this.selectedUid = user.uid;
  }
}
