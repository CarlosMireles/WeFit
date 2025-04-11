import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { SearchService } from '../../services/search.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-find-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './find-user.component.html',
  styleUrls: ['./find-user.component.css']
})
export class FindUserComponent implements AfterViewInit {
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  searchResults: any[] = [];

  // Define el username actual; reemplázalo según tu lógica (por ejemplo, de un servicio de autenticación)
  currentUsername: string = 'currentUserName';

  constructor(private searchService: SearchService) {}

  ngAfterViewInit(): void {
    // Búsqueda en tiempo real mientras escribes
    fromEvent(this.searchInput.nativeElement, 'input').pipe(
      map((event: any) => event.target.value),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((text: string) => {
      const trimmedText = text.trim();
      if (trimmedText.length > 0) {
        this.searchService.searchUsersByUsernamePrefix(trimmedText, this.currentUsername)
          .then(results => this.searchResults = results)
          .catch(error => console.error('Error en la búsqueda:', error));
      } else {
        this.searchResults = [];
      }
    });
  }

  async onSearchClick() {
    const text: string = this.searchInput.nativeElement.value;
    const trimmedText = text.trim();
    if (trimmedText.length > 0) {
      try {
        this.searchResults = await this.searchService.searchUsersByUsernamePrefix(trimmedText, this.currentUsername);
      } catch (error) {
        console.error('Error en la búsqueda por click:', error);
      }
    } else {
      this.searchResults = [];
    }
  }

  selectUser(user: any) {
    this.searchInput.nativeElement.value = user.username;
    this.searchResults = [];
  }
}
