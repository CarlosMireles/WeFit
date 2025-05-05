import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';

import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { DietService } from '../../services/diet.service';
import { Diet } from '../../models/diet';
import { DietCardComponent } from '../../components/diet-card/diet-card.component';
import { UserService } from '../../services/user.service';
import {LanguageService} from '../../services/translate.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-diets',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    DietCardComponent,
    TranslatePipe
  ],
  templateUrl: './diets.component.html',
  styleUrls: ['./diets.component.css']
})
export class DietsComponent implements OnInit {
  dietSlots = Array.from({ length: 10 });
  diets$!: Observable<Diet[]>;

  constructor(
    private router: Router,
    private dietService: DietService,
    private userService: UserService,
    private langService: LanguageService
  ) {}

  async ngOnInit() {
    this.diets$ = this.userService.currentUser$.pipe(
      filter(u => !!u?.uid),
      switchMap(u => this.dietService.getUserDietsByUid$(u!.uid)),
      tap(ds => console.log('Dietas cargadas:', ds))
    );
    const lang = this.langService.currentLang;
    await this.langService.changeLang(lang);
  }

  addNewDiet() {
    this.router.navigate(['/new-diet']);
  }
}
