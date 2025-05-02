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

@Component({
  selector: 'app-diets',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    DietCardComponent
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
    private userService: UserService
  ) {}

  ngOnInit() {
    this.diets$ = this.userService.currentUser$.pipe(
      filter(u => !!u?.uid),
      switchMap(u => this.dietService.getUserDietsByUid$(u!.uid)),
      tap(ds => console.log('Dietas cargadas:', ds))
    );
  }

  addNewDiet() {
    this.router.navigate(['/new-diet']);
  }
}
