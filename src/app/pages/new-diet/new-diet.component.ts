import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DietService } from '../../services/diet.service';
import { Diet, Meal } from '../../models/diet';

@Component({
  selector: 'app-new-diet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-diet.component.html',
  styleUrls: ['./new-diet.component.css']
})
export class NewDietComponent {
  model: Diet = {
    title: '',
    description1: '',
    meals: []
  };
  savedDiet: Diet | null = null;
  isSaving = false;

  constructor(
    private dietService: DietService,
    private router: Router
  ) {}

  addMeal() {
    if (this.model.meals.length < 10) {
      this.model.meals.push({
        lunch: '',
        description2: ''
      } as Meal);
    }
  }

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

  async saveDiet() {
    this.isSaving = true;
    await this.dietService.createDiet(this.model);
    this.savedDiet = { ...this.model };
    this.isSaving = false;
  }

  cancel() {
    this.router.navigate(['/diets']);
  }
  removeMeal(index: number) {
    if (this.model.meals.length > 1) {
      this.model.meals.splice(index, 1);
    }
  }

}
