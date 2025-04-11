import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageService} from '../../services/translate.service';

@Component({
    selector: 'app-search-bar',
  imports: [
    NgOptimizedImage,
    RouterLink,
    TranslatePipe
  ],
    templateUrl: './search-bar.component.html',
    standalone: true,
    styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  constructor(private langService: LanguageService) {
  }
}
