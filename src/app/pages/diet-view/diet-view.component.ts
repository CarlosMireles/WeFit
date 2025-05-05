// src/app/pages/diet-view/diet-view.component.ts

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth } from '@angular/fire/auth';

import { DietService } from '../../services/diet.service';
import { Diet, Meal } from '../../models/diet';
import {LanguageService} from '../../services/translate.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-diet-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslatePipe
  ],
  templateUrl: './diet-view.component.html',
  styleUrls: ['./diet-view.component.css']
})
export class DietViewComponent implements OnInit {
  diet!: Diet;
  editMode = false;
  saving = false;

  updated: Diet = {
    id: '',
    userId: '',
    title: '',
    description1: '',
    meals: []
  };

  currentUserId: string | null = null;
  isOwner = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dietService: DietService,
    private auth: Auth,
    private cdr: ChangeDetectorRef,
    private langService: LanguageService
  ) {}

  async ngOnInit(): Promise<void> {
    // 1) Obtener UID del usuario autenticado
    this.currentUserId = this.auth.currentUser?.uid || null;

    // 2) Leer ID de dieta de la URL y cargar
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      await this.router.navigate(['/diets']);
      return;
    }

    const d = await this.dietService.getDietById(id);
    if (!d) {
      await this.router.navigate(['/diets']);
      return;
    }

    this.diet = d;
    // Preparamos copia para edición
    this.updated = JSON.parse(JSON.stringify(d));

    // 3) Determinar autoría
    this.isOwner = this.currentUserId === this.diet.userId;

    const lang = this.langService.currentLang;
    await this.langService.changeLang(lang);
  }

  toggleEdit(): void {
    this.editMode = true;
  }

  async saveEdit(): Promise<void> {
    if (!this.diet.id) return;

    // Validar nombre y descripción de cada meal
    const invalid = this.updated.meals.find(m =>
      !m.lunch.trim() || !m.description2.trim()
    );
    if (invalid) {
      alert('Cada comida debe tener nombre y descripción.');
      return;
    }

    this.saving = true;
    try {
      // Fallback de imagen
      this.updated.meals.forEach(m => {
        if (!m.img_url) m.img_url = 'assets/healthy-food.png';
      });

      const mealsToSave: Meal[] = this.updated.meals.map(m => {
        const clean: any = {
          lunch: m.lunch,
          description2: m.description2,
          img_url: m.img_url
        };
        if (m.proteins != null)      clean.proteins = m.proteins;
        if (m.carbohydrates != null) clean.carbohydrates = m.carbohydrates;
        if (m.fats != null)          clean.fats = m.fats;
        if (m.calories != null)      clean.calories = m.calories;
        return clean as Meal;
      });

      await this.dietService.updateDiet(this.diet.id, {
        title: this.updated.title,
        description1: this.updated.description1,
        meals: mealsToSave
      });

      this.diet = { ...this.updated, meals: mealsToSave };
      this.editMode = false;
    } finally {
      this.saving = false;
    }
  }

  async deleteDiet(): Promise<void> {
    if (!this.diet.id) return;
    if (!confirm('¿Eliminar esta dieta?')) return;
    await this.dietService.deleteDiet(this.diet.id);
    await this.router.navigate(['/diets']);
  }

  cancel(): void {
    if (this.editMode) {
      // Deshacer cambios
      this.updated = JSON.parse(JSON.stringify(this.diet));
      this.editMode = false;
    } else {
      // Si no es el autor, vamos a su perfil; si es, al listado general
      if (!this.isOwner) {
        this.router.navigate(['/profile-search', this.diet.userId]);
      } else {
        this.router.navigate(['/diets']);
      }
    }
  }

  addMeal(): void {
    if (this.updated.meals.length >= 10) return;
    this.updated.meals.push({
      lunch: '',
      description2: '',
      proteins: undefined,
      carbohydrates: undefined,
      fats: undefined,
      calories: undefined,
      img_url: undefined
    });
    this.cdr.detectChanges();
  }

  removeMeal(i: number): void {
    if (this.updated.meals.length <= 1) return;
    this.updated.meals.splice(i, 1);
    this.cdr.detectChanges();
  }

  onFileSelected(event: Event, meal: Meal): void {
    const inp = event.target as HTMLInputElement;
    if (inp.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => (meal.img_url = reader.result as string);
      reader.readAsDataURL(inp.files[0]);
    }
  }
}
