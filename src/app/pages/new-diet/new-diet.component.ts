// src/app/pages/new-diet/new-diet.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { DietService, NewDiet } from '../../services/diet.service';
import { Meal } from '../../models/diet';

@Component({
  selector: 'app-new-diet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-diet.component.html',
  styleUrls: ['./new-diet.component.css']
})
export class NewDietComponent {
  /** Modelo de nueva dieta sin id ni userId */
  model: NewDiet = {
    title: '',
    description1: '',
    meals: []
  };

  savedDiet: NewDiet | null = null;
  isSaving = false;

  constructor(
    private dietService: DietService,
    private router: Router
  ) {}

  /** Añade una comida vacía (hasta 10) */
  addMeal() {
    if (this.model.meals.length < 10) {
      this.model.meals.push({
        lunch: '',
        description2: '',
        // img_url se asigna en saveDiet o en preview
      } as Meal);
    }
  }

  /** Captura archivo y lo carga en base64 */
  onFileSelected(evt: Event, index: number) {
    const input = evt.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.model.meals[index].img_url = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  /** Guarda la nueva dieta */
  async saveDiet() {
    this.isSaving = true;

    // fallback de imagen
    this.model.meals.forEach(meal => {
      if (!meal.img_url) {
        meal.img_url = 'assets/healthy-food.png';
      }
    });

    await this.dietService.createDiet(this.model);
    this.savedDiet = { ...this.model };
    this.isSaving = false;
  }

  /** Cancela y vuelve al listado */
  cancel() {
    this.router.navigate(['/diets']);
  }

  /** Elimina la comida en la posición dada (manteniendo al menos 1) */
  removeMeal(index: number) {
    if (this.model.meals.length > 1) {
      this.model.meals.splice(index, 1);
    }
  }
}
